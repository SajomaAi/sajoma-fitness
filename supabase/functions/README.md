# Supabase Edge Functions

## Setup (one-time)

```bash
# Install Supabase CLI (brew on macOS; scoop on Windows)
brew install supabase/tap/supabase

# Link to your project
supabase link --project-ref sffqsaysjfnlorbwwvpf
```

## Secrets

```bash
# Anthropic API key used by analyze-meal
supabase secrets set ANTHROPIC_API_KEY=sk-ant-xxxxx

# RevenueCat webhook shared secret + Supabase service role key
# (for revenuecat-webhook — never exposed to clients)
supabase secrets set \
  REVENUECAT_WEBHOOK_AUTH="Bearer your-shared-secret" \
  SUPABASE_SERVICE_ROLE_KEY="eyJ..."   # Project Settings → API → service_role
```

## Deploy

```bash
# Deploy a single function
supabase functions deploy analyze-meal

# Deploy all functions
supabase functions deploy
```

## Local development

```bash
supabase functions serve analyze-meal --env-file ./supabase/.env.local
# Call it:
curl -X POST http://localhost:54321/functions/v1/analyze-meal \
  -H 'Authorization: Bearer <anon-key>' \
  -H 'Content-Type: application/json' \
  -d '{"imageBase64":"...","mimeType":"image/jpeg"}'
```

## Functions

### `analyze-meal`
Accepts a meal photo (base64) and returns structured nutrition data via Claude vision.

**Request:**
```json
{ "imageBase64": "<base64>", "mimeType": "image/jpeg", "language": "en" }
```

**Response:**
```json
{
  "name": "Grilled chicken salad",
  "calories": 420,
  "protein_g": 38, "carbs_g": 22, "fat_g": 18, "fiber_g": 6,
  "serving_size": "1 bowl (~350g)",
  "confidence": "medium",
  "notes": "Visible olive oil drizzle; actual calories may vary."
}
```

**Errors:**
- `{ "error": "not_food" }` — image doesn't contain food
- `{ "error": "unclear" }` — image too blurry/empty to analyze

### `revenuecat-webhook`
Receives RevenueCat webhooks and mirrors entitlements to `profiles.subscription_tier`.

**Deploy:**
```bash
supabase functions deploy revenuecat-webhook --no-verify-jwt
```
The `--no-verify-jwt` flag is required because RevenueCat calls the function without a Supabase JWT; the shared-secret `Authorization` header handles auth instead.

**RevenueCat dashboard setup (Integrations → Webhooks):**
- URL: `https://<project-ref>.supabase.co/functions/v1/revenuecat-webhook`
- Authorization header: same value as `REVENUECAT_WEBHOOK_AUTH` (e.g. `Bearer your-shared-secret`)

**Handled event types:**
- `INITIAL_PURCHASE`, `RENEWAL`, `PRODUCT_CHANGE`, `NON_RENEWING_PURCHASE`, `UNCANCELLATION` → upgrade tier
- `CANCELLATION`, `EXPIRATION`, `SUBSCRIPTION_PAUSED`, `BILLING_ISSUE` → downgrade to `free` when expired
- `TEST`, `TRANSFER` → acknowledged, no state change

**Entitlement ID convention:** RevenueCat entitlement IDs must be `basic_premium` and `full_premium` to map correctly. Change in `revenuecat-webhook/index.ts` if you use different IDs.
