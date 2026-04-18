import { supabase } from './supabase';

export interface MealAnalysis {
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

export type AnalyzeMealResult =
  | { ok: true; analysis: MealAnalysis; photoPath: string | null }
  | { ok: false; error: string };

// Resize an image to max 1024px on the longest side and return a JPEG base64 string.
// Reduces upload size and keeps Claude vision costs predictable.
async function resizeToBase64(file: Blob, maxDim = 1024, quality = 0.85): Promise<{ base64: string; blob: Blob }> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable');
  ctx.drawImage(img, 0, 0, w, h);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/jpeg', quality)
  );
  const buf = await blob.arrayBuffer();
  // Convert to base64 without btoa's 64KB-per-call limit issue on large arrays
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 32_768;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return { base64: btoa(binary), blob };
}

/**
 * Upload the photo to the `meal-photos` bucket and call the analyze-meal edge function.
 * Returns the structured analysis and the storage path of the uploaded photo.
 */
export async function analyzeMealPhoto(file: Blob, language: 'en' | 'es' = 'en'): Promise<AnalyzeMealResult> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return { ok: false, error: 'Not authenticated' };
  const userId = userData.user.id;

  let resized;
  try {
    resized = await resizeToBase64(file);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Failed to process image' };
  }

  // Fire upload + analysis in parallel — both are independent
  const storagePath = `${userId}/${Date.now()}.jpg`;
  const uploadPromise = supabase.storage.from('meal-photos').upload(storagePath, resized.blob, {
    contentType: 'image/jpeg',
    upsert: false,
  });

  const analysisPromise = supabase.functions.invoke<MealAnalysis | { error: string }>('analyze-meal', {
    body: { imageBase64: resized.base64, mimeType: 'image/jpeg', language },
  });

  const [uploadRes, analysisRes] = await Promise.all([uploadPromise, analysisPromise]);

  if (analysisRes.error) return { ok: false, error: analysisRes.error.message };
  const data = analysisRes.data;
  if (!data) return { ok: false, error: 'Empty response from analyze-meal' };
  if ('error' in data) {
    const msg = data.error === 'not_food'
      ? (language === 'es' ? 'La imagen no parece ser comida.' : "That doesn't look like food.")
      : data.error === 'unclear'
        ? (language === 'es' ? 'La imagen no es clara.' : 'Image was too unclear to analyze.')
        : data.error;
    return { ok: false, error: msg };
  }

  const photoPath = uploadRes.error ? null : storagePath;
  return { ok: true, analysis: data, photoPath };
}

export async function saveMealLog(params: {
  analysis: MealAnalysis;
  photoPath: string | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  source: 'manual' | 'barcode' | 'ai_photo' | 'cultural_db';
  barcode?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return { error: 'Not authenticated' };

  const { analysis, photoPath, mealType, source, barcode } = params;
  const { error } = await supabase.from('meal_logs').insert({
    user_id: userData.user.id,
    meal_type: mealType,
    name: analysis.name,
    calories: analysis.calories,
    protein_g: analysis.protein_g,
    carbs_g: analysis.carbs_g,
    fat_g: analysis.fat_g,
    fiber_g: analysis.fiber_g,
    serving_size: analysis.serving_size,
    source,
    barcode: barcode ?? null,
    photo_url: photoPath,
    ai_analysis: source === 'ai_photo' ? analysis : null,
  });
  return { error: error?.message ?? null };
}
