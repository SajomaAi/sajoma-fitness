// Origin allowlist for edge-function CORS.
// - Vercel prod + preview URLs (project slug pinned; wildcard preview subdomains)
// - Localhost for Vite dev
// - Capacitor iOS WebView origins (iOS 14+ uses capacitor://localhost)
//
// Additional origins can be added at deploy time via the ALLOWED_ORIGINS secret
// (comma-separated). This is safer than leaving `*` open even though the
// analyze-meal function also enforces JWT auth, because it prevents unrelated
// pages from probing the function's error surface.
const STATIC_ALLOW = new Set<string>([
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'capacitor://localhost',
  'ionic://localhost',
]);

function isAllowed(origin: string): boolean {
  if (STATIC_ALLOW.has(origin)) return true;
  // Vercel project domains: <project>-<hash>.vercel.app and <project>.vercel.app.
  // Tighten by requiring the project slug prefix to belong to this app.
  if (/^https:\/\/(oleva|sajoma-fitness)(-[a-z0-9-]+)?\.vercel\.app$/.test(origin)) return true;
  const extra = (Deno.env.get('ALLOWED_ORIGINS') ?? '').split(',').map(s => s.trim()).filter(Boolean);
  return extra.includes(origin);
}

const BASE_HEADERS = {
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Vary': 'Origin',
};

export function corsHeadersFor(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') ?? '';
  if (origin && isAllowed(origin)) {
    return { ...BASE_HEADERS, 'Access-Control-Allow-Origin': origin };
  }
  // Omit Allow-Origin entirely when the origin isn't recognised. The browser
  // will block the response, which is the correct outcome for unknown callers.
  return BASE_HEADERS;
}

// Legacy static export retained for callers not yet migrated. New functions
// should prefer corsHeadersFor(req).
export const corsHeaders = {
  ...BASE_HEADERS,
  'Access-Control-Allow-Origin': '*',
};
