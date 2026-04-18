// Supabase Edge Function: revenuecat-webhook
// Receives RevenueCat webhooks and mirrors the active entitlement into profiles.subscription_tier.
// This gives the server-side source of truth for cross-device / admin checks
// (the client also syncs via SubscriptionContext, so both stay in agreement).
//
// Setup (one-time):
// 1. supabase secrets set \
//      REVENUECAT_WEBHOOK_AUTH=Bearer-your-shared-secret \
//      SUPABASE_SERVICE_ROLE_KEY=eyJ...   (from Project Settings → API → service_role)
// 2. supabase functions deploy revenuecat-webhook --no-verify-jwt
// 3. In RevenueCat dashboard → Integrations → Webhooks:
//      URL:  https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook
//      Authorization header: Bearer-your-shared-secret  (same value as REVENUECAT_WEBHOOK_AUTH)
//
// RevenueCat payload reference: https://www.revenuecat.com/docs/integrations/webhooks/sample-events

import { corsHeaders } from '../_shared/cors.ts';

const ENTITLEMENT_TO_TIER: Record<string, 'basic_premium' | 'full_premium'> = {
  basic_premium: 'basic_premium',
  full_premium: 'full_premium',
};

interface RcEvent {
  type: string;
  app_user_id: string;
  original_app_user_id?: string;
  entitlement_ids?: string[];
  entitlement_id?: string;
  expiration_at_ms?: number | null;
}

interface RcPayload {
  event: RcEvent;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  // Shared-secret auth: RevenueCat sends whatever we configured in the Authorization header.
  const expected = Deno.env.get('REVENUECAT_WEBHOOK_AUTH');
  const got = req.headers.get('authorization');
  if (!expected || got !== expected) {
    return new Response('Unauthorized', { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRole) {
    return new Response('Server misconfigured', { status: 500, headers: corsHeaders });
  }

  let payload: RcPayload;
  try { payload = await req.json(); }
  catch { return new Response('Bad JSON', { status: 400, headers: corsHeaders }); }

  const ev = payload.event;
  if (!ev || !ev.app_user_id) {
    return new Response('Missing event', { status: 400, headers: corsHeaders });
  }

  // Derive next tier. We read entitlement_ids (new RC payloads) with a fallback
  // to entitlement_id (older payloads). If CANCELLATION/EXPIRATION with no active
  // entitlements, reset to free.
  const activeIds = ev.entitlement_ids ?? (ev.entitlement_id ? [ev.entitlement_id] : []);
  let nextTier: 'free' | 'basic_premium' | 'full_premium' = 'free';

  if (['INITIAL_PURCHASE', 'RENEWAL', 'PRODUCT_CHANGE', 'NON_RENEWING_PURCHASE', 'UNCANCELLATION'].includes(ev.type)) {
    if (activeIds.includes('full_premium')) nextTier = 'full_premium';
    else if (activeIds.some(id => ENTITLEMENT_TO_TIER[id])) nextTier = ENTITLEMENT_TO_TIER[activeIds[0]] ?? 'basic_premium';
  } else if (['CANCELLATION', 'EXPIRATION', 'SUBSCRIPTION_PAUSED', 'BILLING_ISSUE'].includes(ev.type)) {
    // Keep tier if expiration is in the future (user still has access until then)
    if (ev.expiration_at_ms && ev.expiration_at_ms > Date.now()) {
      if (activeIds.includes('full_premium')) nextTier = 'full_premium';
      else if (activeIds.length > 0) nextTier = ENTITLEMENT_TO_TIER[activeIds[0]] ?? 'basic_premium';
    } else {
      nextTier = 'free';
    }
  } else {
    // TEST, TRANSFER, etc. — ack but don't change state.
    return new Response(JSON.stringify({ ok: true, ignored: ev.type }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  // Service-role REST update bypasses RLS so we can write to any profile row.
  const expiresIso = ev.expiration_at_ms ? new Date(ev.expiration_at_ms).toISOString() : null;
  const patch = {
    subscription_tier: nextTier,
    subscription_expires_at: expiresIso,
  };

  const res = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${encodeURIComponent(ev.app_user_id)}`, {
    method: 'PATCH',
    headers: {
      apikey: serviceRole,
      authorization: `Bearer ${serviceRole}`,
      'content-type': 'application/json',
      prefer: 'return=minimal',
    },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    const detail = await res.text();
    return new Response(JSON.stringify({ ok: false, error: detail }), {
      status: 502,
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, tier: nextTier }), {
    headers: { ...corsHeaders, 'content-type': 'application/json' },
  });
});
