// Supabase Edge Function: analyze-meal
// POST { imageBase64: string, mimeType: 'image/jpeg' | 'image/png' | 'image/webp', language?: 'en' | 'es' }
// → { name, calories, protein_g, carbs_g, fat_g, fiber_g, serving_size, confidence, notes }
//
// Requires env var ANTHROPIC_API_KEY set via:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//
// Deploy:
//   supabase functions deploy analyze-meal --no-verify-jwt=false
//
// The function runs with the caller's auth — RLS still applies to any DB calls.

import { corsHeadersFor } from '../_shared/cors.ts';

const MODEL = 'claude-sonnet-5';
const MAX_TOKENS = 1024;

// Per-user AI-scan quotas per calendar day (server-enforced; matches free-tier client cap).
const QUOTA_FREE = 3;
const QUOTA_PREMIUM = 100;

const SYSTEM_PROMPT = `You are a registered dietitian analyzing meal photos for a fitness app. Given a photo of food, estimate:
- name: short dish name (include cultural variants when visible, e.g. "Arroz con pollo")
- calories: total kcal for the visible portion
- protein_g, carbs_g, fat_g, fiber_g: macros in grams (numeric, not strings)
- serving_size: human-readable (e.g. "1 plate (~300g)")
- confidence: "low" | "medium" | "high"
- notes: 1 sentence — anything notable (e.g. "Cooked with visible oil, estimate may be high")

Rules:
- Return ONLY valid JSON matching the schema — no markdown, no prose, no code fences.
- If the image is NOT food, return { "error": "not_food" }.
- If the image is unclear or empty, return { "error": "unclear" }.
- Be realistic — don't guess beyond what's visible. Prefer medium confidence when uncertain.
- For the notes field, match the user's language (language code is passed in the prompt).`;

interface AnalyzeMealRequest {
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif';
  language?: 'en' | 'es';
}

interface MealAnalysis {
  name: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  serving_size: string;
  confidence: 'low' | 'medium' | 'high';
  notes: string;
}

Deno.serve(async (req: Request) => {
  const corsHeaders = corsHeadersFor(req);
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body: AnalyzeMealRequest;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const { imageBase64, mimeType, language = 'en' } = body;
  if (!imageBase64 || !mimeType) {
    return new Response(JSON.stringify({ error: 'imageBase64 and mimeType required' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Cap base64 size at ~4MB decoded — Anthropic's per-image limit is 5MB, leave headroom for JSON framing.
  if (imageBase64.length > 5_500_000) {
    return new Response(JSON.stringify({ error: 'Image too large (max 4MB decoded)' }), {
      status: 413,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Auth + per-user quota. The client's supabase.functions.invoke() forwards
  // the user's session JWT as the Authorization header — use it to identify
  // the caller and enforce day-level scan limits at the server.
  const authHeader = req.headers.get('authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!authHeader || !supabaseUrl || !anonKey) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const userRes = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, authorization: authHeader },
  });
  if (!userRes.ok) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const userInfo = await userRes.json();
  const userId: string | undefined = userInfo.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Fetch tier + today's ai_photo count in parallel using service role (bypasses RLS,
  // which is fine here since we've already authenticated the JWT above and scoped queries by user_id).
  const serviceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (serviceRole) {
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const [tierRes, countRes] = await Promise.all([
      fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=subscription_tier`, {
        headers: { apikey: serviceRole, authorization: `Bearer ${serviceRole}` },
      }),
      fetch(`${supabaseUrl}/rest/v1/meal_logs?user_id=eq.${userId}&source=eq.ai_photo&logged_at=gte.${startOfDay.toISOString()}&select=id`, {
        headers: { apikey: serviceRole, authorization: `Bearer ${serviceRole}`, prefer: 'count=exact' },
      }),
    ]);
    const tierRows = tierRes.ok ? await tierRes.json() : [];
    const tier: string = tierRows[0]?.subscription_tier ?? 'free';
    const isPremium = tier === 'basic_premium' || tier === 'full_premium';
    const contentRange = countRes.headers.get('content-range'); // "0-N/total" or "*/total"
    const count = contentRange ? Number(contentRange.split('/')[1] ?? '0') : 0;
    const quota = isPremium ? QUOTA_PREMIUM : QUOTA_FREE;
    if (count >= quota) {
      return new Response(JSON.stringify({ error: 'quota_exceeded', quota, tier }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  const userText = language === 'es'
    ? 'Analiza esta foto de comida. Devuelve SOLO JSON con las notas en español.'
    : 'Analyze this meal photo. Return ONLY JSON with notes in English.';

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mimeType, data: imageBase64 },
            },
            { type: 'text', text: userText },
          ],
        },
      ],
    }),
  });

  if (!anthropicRes.ok) {
    const errText = await anthropicRes.text();
    return new Response(JSON.stringify({ error: 'Anthropic API error', detail: errText }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const anthropicData = await anthropicRes.json();
  const textBlock = anthropicData.content?.find((c: { type: string }) => c.type === 'text');
  const raw = textBlock?.text ?? '';

  // Strip accidental code fences if the model slips
  const cleaned = raw.trim().replace(/^```json\s*/i, '').replace(/```$/, '').trim();

  let parsed: MealAnalysis | { error: string };
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return new Response(JSON.stringify({ error: 'Model returned invalid JSON', raw }), {
      status: 502,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
