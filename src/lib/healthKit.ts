// Thin wrapper around @perfood/capacitor-healthkit.
// Returns null values on non-native platforms so the UI has a single code path.

import { Capacitor } from '@capacitor/core';
import { CapacitorHealthkit, SampleNames, type OtherData, type QueryOutput } from '@perfood/capacitor-healthkit';

const READ_SCOPE = [
  SampleNames.STEP_COUNT,
  SampleNames.ACTIVE_ENERGY_BURNED,
  SampleNames.DISTANCE_WALKING_RUNNING,
  SampleNames.APPLE_EXERCISE_TIME,
  SampleNames.WORKOUT_TYPE,
  SampleNames.WEIGHT,
  SampleNames.HEART_RATE,
] as string[];

let authorized = false;
let authorizing: Promise<boolean> | null = null;

export const isNative = () => Capacitor.isNativePlatform();

export async function isHealthKitAvailable(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    await CapacitorHealthkit.isAvailable();
    return true;
  } catch {
    return false;
  }
}

export async function requestHealthKitAuthorization(): Promise<boolean> {
  if (!isNative()) return false;
  if (authorized) return true;
  if (authorizing) return authorizing;

  authorizing = (async () => {
    try {
      await CapacitorHealthkit.requestAuthorization({ read: READ_SCOPE, write: [], all: [] });
      authorized = true;
      return true;
    } catch {
      authorized = false;
      return false;
    } finally {
      authorizing = null;
    }
  })();

  return authorizing;
}

function startOfDay(d = new Date()): string {
  const s = new Date(d);
  s.setHours(0, 0, 0, 0);
  return s.toISOString();
}

function nowIso(): string {
  return new Date().toISOString();
}

async function sumSamples(sampleName: string, startDate: string, endDate: string): Promise<number> {
  if (!isNative()) return 0;
  try {
    const res = (await CapacitorHealthkit.queryHKitSampleType<OtherData>({
      sampleName, startDate, endDate, limit: 1000,
    })) as QueryOutput<OtherData>;
    return res.resultData.reduce((sum, s) => sum + (s.value ?? 0), 0);
  } catch {
    return 0;
  }
}

export async function getTodaySteps(): Promise<number> {
  return Math.round(await sumSamples(SampleNames.STEP_COUNT, startOfDay(), nowIso()));
}

export async function getTodayActiveEnergyKcal(): Promise<number> {
  return Math.round(await sumSamples(SampleNames.ACTIVE_ENERGY_BURNED, startOfDay(), nowIso()));
}

export async function getTodayDistanceMeters(): Promise<number> {
  return await sumSamples(SampleNames.DISTANCE_WALKING_RUNNING, startOfDay(), nowIso());
}

export interface DailyTotals {
  date: string; // YYYY-MM-DD
  steps: number;
  activeEnergyKcal: number;
}

// Fetch per-day totals for the last N days (inclusive of today).
export async function getDailyTotals(days: number): Promise<DailyTotals[]> {
  if (!isNative()) return [];
  const today = new Date();
  const results: DailyTotals[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const start = new Date(d); start.setHours(0, 0, 0, 0);
    const end = new Date(d); end.setHours(23, 59, 59, 999);
    const [steps, kcal] = await Promise.all([
      sumSamples(SampleNames.STEP_COUNT, start.toISOString(), end.toISOString()),
      sumSamples(SampleNames.ACTIVE_ENERGY_BURNED, start.toISOString(), end.toISOString()),
    ]);
    results.push({
      date: start.toISOString().slice(0, 10),
      steps: Math.round(steps),
      activeEnergyKcal: Math.round(kcal),
    });
  }
  return results;
}
