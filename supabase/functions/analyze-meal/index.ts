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

import { corsHeaders } from '../_shared/cors.ts';

const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

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

  // Cap base64 size to avoid abuse (roughly 8MB decoded)
  if (imageBase64.length > 11_000_000) {
    return new Response(JSON.stringify({ error: 'Image too large (max 8MB)' }), {
      status: 413,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
