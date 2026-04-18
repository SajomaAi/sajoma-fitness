// Database types matching supabase/migrations/0001_initial_schema.sql
// Regenerate with: npx supabase gen types typescript --project-id sffqsaysjfnlorbwwvpf > src/lib/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface ProfileRow {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  language: 'en' | 'es';
  goal: string | null;
  fitness_level: string | null;
  diet_preference: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  birth_year: number | null;
  sex: string | null;
  activity_level: string | null;
  daily_calorie_goal: number | null;
  daily_water_goal_ml: number | null;
  subscription_tier: 'free' | 'basic_premium' | 'full_premium';
  subscription_expires_at: string | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntryRow {
  id: string;
  user_id: string;
  entry_date: string;
  mood: number | null;
  energy: number | null;
  gratitude: string | null;
  notes: string | null;
  prompt: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutRow {
  id: string;
  user_id: string;
  workout_type: string;
  duration_min: number;
  calories_burned: number | null;
  intensity: 'low' | 'medium' | 'high' | null;
  notes: string | null;
  performed_at: string;
  created_at: string;
}

export interface WaterLogRow {
  id: string;
  user_id: string;
  amount_ml: number;
  logged_at: string;
}

export interface MealLogRow {
  id: string;
  user_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
  name: string;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  serving_size: string | null;
  source: 'manual' | 'barcode' | 'ai_photo' | 'cultural_db' | null;
  barcode: string | null;
  photo_url: string | null;
  ai_analysis: Json | null;
  logged_at: string;
  created_at: string;
}

export interface ProgressPhotoRow {
  id: string;
  user_id: string;
  storage_path: string;
  weight_kg: number | null;
  notes: string | null;
  taken_at: string;
  created_at: string;
}

export interface ReminderRow {
  id: string;
  user_id: string;
  kind: 'meal_breakfast' | 'meal_lunch' | 'meal_dinner' | 'water' | 'workout' | 'morning_checkin' | 'custom';
  enabled: boolean;
  time_of_day: string | null;
  days_of_week: number[] | null;
  custom_message: string | null;
  created_at: string;
  updated_at: string;
}

type TableDef<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDef<ProfileRow>;
      journal_entries: TableDef<JournalEntryRow>;
      workouts: TableDef<WorkoutRow>;
      water_logs: TableDef<WaterLogRow>;
      meal_logs: TableDef<MealLogRow>;
      progress_photos: TableDef<ProgressPhotoRow>;
      reminders: TableDef<ReminderRow>;
    };
    Views: { [key: string]: never };
    Functions: { [key: string]: never };
    Enums: { [key: string]: never };
    CompositeTypes: { [key: string]: never };
  };
}
