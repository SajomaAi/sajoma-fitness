interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import {
  isHealthKitAvailable,
  requestHealthKitAuthorization,
  getDailyTotals,
  type DailyTotals,
} from '../lib/healthKit';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

const GLASS_ML = 250;
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface DayAgg {
  date: string;   // YYYY-MM-DD
  label: string;  // Mon/Tue/...
  cal: number;    // consumed calories
  steps: number;  // from HealthKit
  water: number;  // glasses
  workouts: number;
}

const HealthTrackerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<DayAgg[]>([]);

  const rangeDays = period === 'week' ? 7 : 30;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - (rangeDays - 1));
      start.setHours(0, 0, 0, 0);

      const [meals, water, workouts, hk] = await Promise.all([
        supabase.from('meal_logs').select('calories, logged_at').gte('logged_at', start.toISOString()),
        supabase.from('water_logs').select('amount_ml, logged_at').gte('logged_at', start.toISOString()),
        supabase.from('workouts').select('performed_at, calories_burned').gte('performed_at', start.toISOString()),
        (async () => {
          if (await isHealthKitAvailable()) {
            const granted = await requestHealthKitAuthorization();
            if (granted) return getDailyTotals(rangeDays);
          }
          return [] as DailyTotals[];
        })(),
      ]);

      if (cancelled) return;

      const byDate = new Map<string, DayAgg>();
      for (let i = 0; i < rangeDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const iso = d.toISOString().slice(0, 10);
        byDate.set(iso, { date: iso, label: DAYS_OF_WEEK[d.getDay()], cal: 0, steps: 0, water: 0, workouts: 0 });
      }

      for (const m of meals.data ?? []) {
        const iso = (m as { logged_at: string }).logged_at.slice(0, 10);
        const entry = byDate.get(iso);
        if (entry) entry.cal += (m as { calories: number | null }).calories ?? 0;
      }
      for (const w of water.data ?? []) {
        const iso = (w as { logged_at: string }).logged_at.slice(0, 10);
        const entry = byDate.get(iso);
        if (entry) entry.water += ((w as { amount_ml: number }).amount_ml ?? 0) / GLASS_ML;
      }
      for (const wk of workouts.data ?? []) {
        const iso = (wk as { performed_at: string }).performed_at.slice(0, 10);
        const entry = byDate.get(iso);
        if (entry) entry.workouts += 1;
      }
      for (const h of hk) {
        const entry = byDate.get(h.date);
        if (entry) entry.steps = h.steps;
      }

      setDays(Array.from(byDate.values()).map(d => ({ ...d, cal: Math.round(d.cal), water: Math.round(d.water) })));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [rangeDays]);

  const showDays = useMemo(() => (period === 'week' ? days : days.slice(-14)), [days, period]);
  const maxCal = Math.max(1, ...showDays.map(d => d.cal));
  const maxSteps = Math.max(1, ...showDays.map(d => d.steps));
  const totalCal = showDays.reduce((s, d) => s + d.cal, 0);
  const totalSteps = showDays.reduce((s, d) => s + d.steps, 0);
  const totalWater = showDays.reduce((s, d) => s + d.water, 0);
  const totalWorkouts = showDays.reduce((s, d) => s + d.workouts, 0);
  const divisor = Math.max(1, showDays.length);
  const avgCal = Math.round(totalCal / divisor);
  const avgSteps = Math.round(totalSteps / divisor);

  return (
    <div className="page animate-in">
      <PageHeader title={t('analytics') || 'Analytics'} onOpenMenu={onOpenMenu} />

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>{t('this_week') || 'This Week'}</button>
        <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>{t('this_month') || 'This Month'}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { icon: '🔥', label: t('avg_calories') || 'Avg Calories', value: `${avgCal}`, unit: 'kcal/day', color: '#FF9800' },
          { icon: '👣', label: t('avg_steps') || 'Avg Steps', value: avgSteps.toLocaleString(), unit: 'steps/day', color: '#42A5F5' },
          { icon: '💧', label: t('total_water') || 'Total Water', value: `${totalWater}`, unit: 'glasses', color: '#29B6F6' },
          { icon: '💪', label: t('workouts') || 'Workouts', value: `${totalWorkouts}`, unit: period === 'week' ? 'this week' : 'this period', color: '#D4AF37' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#6C757D', fontWeight: 600 }}>{s.unit}</div>
            <div style={{ fontSize: '0.72rem', color: '#495057', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem', marginBottom: 16 }}>Loading…</div>
      ) : (
        <>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="section-title">{t('calorie_intake') || 'Calorie Intake'}</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 12 }}>
              {showDays.map((d, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: '0.58rem', color: '#6C757D', fontWeight: 600 }}>{d.cal}</span>
                  <div style={{
                    width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                    height: `${(d.cal / maxCal) * 80}px`,
                    background: d.cal > 2000 ? 'linear-gradient(to top, #FF9800, #FFB74D)' : 'var(--gold-gradient)',
                  }} />
                  {showDays.length <= 7 && (
                    <span style={{ fontSize: '0.62rem', color: '#6C757D', fontWeight: 600 }}>{d.label}</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(212,175,55,0.05)', borderRadius: 10 }}>
              <span style={{ fontSize: '0.75rem', color: '#495057' }}>{t('daily_average') || 'Daily Average'}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>{avgCal} kcal</span>
            </div>
          </div>

          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="section-title">{t('steps') || 'Steps'}</h3>
            {totalSteps === 0 ? (
              <div style={{ padding: '20px 0', textAlign: 'center', color: '#6C757D', fontSize: '0.82rem' }}>
                {t('connect_health') || 'Connect Apple Health on iOS to see your step history'}
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 12 }}>
                  {showDays.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{
                        width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                        height: `${(d.steps / maxSteps) * 70}px`,
                        background: d.steps >= 10000 ? 'linear-gradient(to top, #66BB6A, #A5D6A7)' : 'linear-gradient(to top, #D4AF37, #E9ECEF)',
                      }} />
                      {showDays.length <= 7 && (
                        <span style={{ fontSize: '0.58rem', color: '#6C757D' }}>{d.label}</span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(212,175,55,0.1)', borderRadius: 10 }}>
                  <span style={{ fontSize: '0.75rem', color: '#495057' }}>{t('daily_average') || 'Daily Average'}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>{avgSteps.toLocaleString()} steps</span>
                </div>
              </>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default HealthTrackerPage;
