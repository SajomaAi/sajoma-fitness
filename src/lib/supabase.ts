import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Copy .env.example to .env.local and fill in your Supabase project values.'
  );
}

// Client is left untyped: the hand-written Database schema in ./database.types.ts
// does not satisfy postgrest-js's GenericSchema constraint under strict TS (interface
// row types don't extend Record<string, unknown> without an explicit index signature,
// and adding one defeats the purpose). Callers cast query results to the exported
// Row types (ProfileRow, MealLogRow, ...) at read sites.
// Replace this with the official generator when the CLI can be run:
//   npx supabase gen types typescript --project-id sffqsaysjfnlorbwwvpf > src/lib/database.types.ts
// then pass <Database> as the generic and drop the Row-type casts.
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
