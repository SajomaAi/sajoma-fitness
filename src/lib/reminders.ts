// Schedule local notifications from the `reminders` table.
// Uses @capacitor/local-notifications. On web we no-op (return success) so the UI
// can still persist preferences for next time the app runs in a native shell.

import { Capacitor } from '@capacitor/core';
import { LocalNotifications, type ScheduleOptions } from '@capacitor/local-notifications';
import { supabase } from './supabase';

export type ReminderKind =
  | 'meal_breakfast'
  | 'meal_lunch'
  | 'meal_dinner'
  | 'water'
  | 'workout'
  | 'morning_checkin'
  | 'custom';

export interface ReminderRow {
  id: string;
  user_id: string;
  kind: ReminderKind;
  enabled: boolean;
  time_of_day: string | null;      // 'HH:MM:SS' or 'HH:MM'
  days_of_week: number[] | null;    // 0=Sunday..6=Saturday
  custom_message: string | null;
}

const DEFAULTS: Array<{ kind: ReminderKind; time: string; message: { en: string; es: string } }> = [
  { kind: 'meal_breakfast', time: '08:00', message: { en: 'Time for breakfast 🥣', es: 'Hora del desayuno 🥣' } },
  { kind: 'meal_lunch',     time: '12:30', message: { en: 'Lunch break 🥗',         es: 'Hora del almuerzo 🥗' } },
  { kind: 'meal_dinner',    time: '18:30', message: { en: 'Dinner time 🍽️',         es: 'Hora de la cena 🍽️' } },
  { kind: 'water',          time: '10:00', message: { en: 'Hydrate! 💧 Log a glass.', es: '¡Hidrátate! 💧 Registra un vaso.' } },
  { kind: 'workout',        time: '17:00', message: { en: 'Workout time 💪',        es: 'Hora de entrenar 💪' } },
  { kind: 'morning_checkin',time: '07:30', message: { en: 'Morning check-in ✨',    es: 'Chequeo de la mañana ✨' } },
];

export const isNative = () => Capacitor.isNativePlatform();

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNative()) return true;
  try {
    const res = await LocalNotifications.requestPermissions();
    return res.display === 'granted';
  } catch {
    return false;
  }
}

// Deterministic positive int id per reminder UUID. Capacitor requires numeric ids.
function reminderNotificationId(reminderId: string): number {
  let h = 0;
  for (let i = 0; i < reminderId.length; i++) {
    h = (h * 31 + reminderId.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function parseTime(hhmm: string | null): { hour: number; minute: number } | null {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hour: h, minute: m };
}

export async function scheduleReminder(row: ReminderRow, language: 'en' | 'es' = 'en'): Promise<void> {
  if (!isNative()) return;
  if (!row.enabled) { await cancelReminder(row.id); return; }

  const time = parseTime(row.time_of_day);
  if (!time) return;

  const body = row.custom_message
    ?? DEFAULTS.find(d => d.kind === row.kind)?.message[language]
    ?? 'Sajoma Fitness reminder';

  const days = row.days_of_week?.length ? row.days_of_week : [0, 1, 2, 3, 4, 5, 6];
  const baseId = reminderNotificationId(row.id);

  // LocalNotifications only allow one `on` pattern per notification; schedule one per day of week.
  // (Capacitor maps weekday 1=Sun..7=Sat, we use 0=Sun..6=Sat — add 1.)
  const opts: ScheduleOptions = {
    notifications: days.map((dow, idx) => ({
      id: baseId + idx + 1,
      title: titleForKind(row.kind, language),
      body,
      schedule: {
        on: { weekday: dow + 1, hour: time.hour, minute: time.minute },
        allowWhileIdle: true,
      },
      smallIcon: 'ic_stat_icon_config_sample',
    })),
  };

  await LocalNotifications.schedule(opts);
}

function titleForKind(kind: ReminderKind, lang: 'en' | 'es'): string {
  const en: Record<ReminderKind, string> = {
    meal_breakfast: 'Breakfast',
    meal_lunch: 'Lunch',
    meal_dinner: 'Dinner',
    water: 'Water',
    workout: 'Workout',
    morning_checkin: 'Morning check-in',
    custom: 'Reminder',
  };
  const es: Record<ReminderKind, string> = {
    meal_breakfast: 'Desayuno',
    meal_lunch: 'Almuerzo',
    meal_dinner: 'Cena',
    water: 'Agua',
    workout: 'Entrenamiento',
    morning_checkin: 'Chequeo matutino',
    custom: 'Recordatorio',
  };
  return (lang === 'es' ? es : en)[kind];
}

export async function cancelReminder(reminderId: string): Promise<void> {
  if (!isNative()) return;
  const base = reminderNotificationId(reminderId);
  // Cancel all 7 possible weekday variants
  const ids = Array.from({ length: 7 }, (_, i) => ({ id: base + i + 1 }));
  try {
    await LocalNotifications.cancel({ notifications: ids });
  } catch { /* non-fatal */ }
}

export async function rescheduleAllReminders(userId: string, language: 'en' | 'es' = 'en'): Promise<void> {
  if (!isNative()) return;
  const { data } = await supabase
    .from('reminders')
    .select('id, user_id, kind, enabled, time_of_day, days_of_week, custom_message')
    .eq('user_id', userId);
  const rows = (data as ReminderRow[]) ?? [];
  for (const row of rows) await scheduleReminder(row, language);
}

// Create default reminders for a user if none exist yet. Called on first RemindersPage visit.
export async function seedDefaultReminders(userId: string): Promise<ReminderRow[]> {
  const { data: existing } = await supabase
    .from('reminders')
    .select('id, user_id, kind, enabled, time_of_day, days_of_week, custom_message')
    .eq('user_id', userId);
  if (existing && existing.length > 0) return existing as ReminderRow[];

  const rows = DEFAULTS.map(d => ({
    user_id: userId,
    kind: d.kind,
    enabled: false,
    time_of_day: d.time + ':00',
    days_of_week: [0, 1, 2, 3, 4, 5, 6],
    custom_message: null,
  }));
  const { data: inserted } = await supabase.from('reminders').insert(rows).select();
  return (inserted as ReminderRow[]) ?? [];
}
