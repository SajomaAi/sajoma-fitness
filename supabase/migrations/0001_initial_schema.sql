-- Sajoma Fitness — Initial schema
-- Tables: profiles, journal_entries, workouts, water_logs, meal_logs, progress_photos, reminders
-- Each row is owned by auth.uid(); RLS enforces that users can only see/modify their own rows.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- profiles — extends auth.users with app-specific fields
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  language text not null default 'en' check (language in ('en', 'es')),

  -- Onboarding answers
  goal text,                     -- lose_weight | build_muscle | maintain | eat_healthier
  fitness_level text,            -- beginner | intermediate | advanced
  diet_preference text,          -- none | vegetarian | vegan | keto | paleo | mediterranean
  height_cm numeric,
  weight_kg numeric,
  birth_year int,
  sex text,                      -- male | female | other | prefer_not_to_say
  activity_level text,           -- sedentary | light | moderate | active | very_active
  daily_calorie_goal int,
  daily_water_goal_ml int default 2000,

  -- Subscription
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'basic_premium', 'full_premium')),
  subscription_expires_at timestamptz,

  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- journal_entries
-- ============================================================
create table public.journal_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  mood int check (mood between 1 and 5),
  energy int check (energy between 1 and 5),
  gratitude text,
  notes text,
  prompt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index journal_entries_user_date_idx on public.journal_entries (user_id, entry_date desc);

-- ============================================================
-- workouts
-- ============================================================
create table public.workouts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_type text not null,    -- cardio | strength | yoga | hiit | walking | running | cycling | other
  duration_min int not null check (duration_min > 0),
  calories_burned int,
  intensity text check (intensity in ('low', 'medium', 'high')),
  notes text,
  performed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index workouts_user_performed_idx on public.workouts (user_id, performed_at desc);

-- ============================================================
-- water_logs — one row per drink event; aggregate on read
-- ============================================================
create table public.water_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml int not null check (amount_ml > 0),
  logged_at timestamptz not null default now()
);
create index water_logs_user_logged_idx on public.water_logs (user_id, logged_at desc);

-- ============================================================
-- meal_logs
-- ============================================================
create table public.meal_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  meal_type text check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  name text not null,
  calories int,
  protein_g numeric,
  carbs_g numeric,
  fat_g numeric,
  fiber_g numeric,
  serving_size text,
  source text check (source in ('manual', 'barcode', 'ai_photo', 'cultural_db')),
  barcode text,
  photo_url text,
  ai_analysis jsonb,
  logged_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index meal_logs_user_logged_idx on public.meal_logs (user_id, logged_at desc);

-- ============================================================
-- progress_photos — stores references to files in 'progress-photos' storage bucket
-- ============================================================
create table public.progress_photos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,    -- path within progress-photos bucket
  weight_kg numeric,
  notes text,
  taken_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index progress_photos_user_taken_idx on public.progress_photos (user_id, taken_at desc);

-- ============================================================
-- reminders — local notifications scheduled on device; row is source of truth
-- ============================================================
create table public.reminders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('meal_breakfast', 'meal_lunch', 'meal_dinner', 'water', 'workout', 'morning_checkin', 'custom')),
  enabled boolean not null default true,
  time_of_day time,              -- e.g. '08:00:00'
  days_of_week int[] default array[0,1,2,3,4,5,6], -- 0=Sunday..6=Saturday
  custom_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reminders_user_idx on public.reminders (user_id);

-- ============================================================
-- Triggers: updated_at autostamp
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger journal_entries_updated_at before update on public.journal_entries
  for each row execute function public.set_updated_at();
create trigger reminders_updated_at before update on public.reminders
  for each row execute function public.set_updated_at();

-- ============================================================
-- Auto-create profile on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;
alter table public.workouts enable row level security;
alter table public.water_logs enable row level security;
alter table public.meal_logs enable row level security;
alter table public.progress_photos enable row level security;
alter table public.reminders enable row level security;

-- profiles: user can read/update own row only
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Generic owner-only CRUD for the rest
create policy "journal_owner_all" on public.journal_entries for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "workouts_owner_all" on public.workouts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "water_owner_all" on public.water_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals_owner_all" on public.meal_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "photos_owner_all" on public.progress_photos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reminders_owner_all" on public.reminders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for progress photos (private, per-user folders)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

create policy "progress_photos_owner_select" on storage.objects for select
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "progress_photos_owner_insert" on storage.objects for insert
  with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "progress_photos_owner_update" on storage.objects for update
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "progress_photos_owner_delete" on storage.objects for delete
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Storage bucket for meal photos (private, for AI analysis)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('meal-photos', 'meal-photos', false)
on conflict (id) do nothing;

create policy "meal_photos_owner_select" on storage.objects for select
  using (bucket_id = 'meal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "meal_photos_owner_insert" on storage.objects for insert
  with check (bucket_id = 'meal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "meal_photos_owner_delete" on storage.objects for delete
  using (bucket_id = 'meal-photos' and (storage.foldername(name))[1] = auth.uid()::text);
