interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  requestHealthKitAuthorization,
  getTodaySteps,
  getTodayActiveEnergyKcal,
  isHealthKitAvailable,
} from '../lib/healthKit';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

const GLASS_ML = 250;

const DashboardPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile, user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [steps, setSteps] = useState<number | null>(null);
  const [burned, setBurned] = useState<number | null>(null);
  const [consumed, setConsumed] = useState<number>(0);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);

  const userName = profile?.full_name || user?.email?.split('@')[0] || '';
  const stepGoal = 10000;
  const goalMl = profile?.daily_water_goal_ml ?? 2000;
  const goalGlasses = Math.round(goalMl / GLASS_ML);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('good_morning') || 'Good Morning');
    else if (hour < 18) setGreeting(t('good_afternoon') || 'Good Afternoon');
    else setGreeting(t('good_evening') || 'Good Evening');
  }, [t]);

  useEffect(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startIso = start.toISOString();

    (async () => {
      // DB-sourced stats (always available)
      const [meals, water] = await Promise.all([
        supabase.from('meal_logs').select('calories').gte('logged_at', startIso),
        supabase.from('water_logs').select('amount_ml').gte('logged_at', startIso),
      ]);
      const mealCals = (meals.data ?? []).reduce((s: number, m: { calories: number | null }) => s + (m.calories ?? 0), 0);
      const waterMl = (water.data ?? []).reduce((s: number, w: { amount_ml: number }) => s + (w.amount_ml ?? 0), 0);
      setConsumed(Math.round(mealCals));
      setWaterGlasses(Math.round(waterMl / GLASS_ML));

      // HealthKit (native only) — request auth once, then read
      if (await isHealthKitAvailable()) {
        const granted = await requestHealthKitAuthorization();
        if (granted) {
          const [s, kcal] = await Promise.all([getTodaySteps(), getTodayActiveEnergyKcal()]);
          setSteps(s);
          setBurned(kcal);
        }
      }

      // Fallback: compute burned from today's logged workouts if HealthKit unavailable
      if (!(await isHealthKitAvailable())) {
        const { data: wk } = await supabase
          .from('workouts')
          .select('calories_burned')
          .gte('performed_at', startIso);
        const kcal = (wk ?? []).reduce((s: number, w: { calories_burned: number | null }) => s + (w.calories_burned ?? 0), 0);
        setBurned(Math.round(kcal));
      }
    })();
  }, []);

  const stepPct = steps != null ? Math.min(Math.round((steps / stepGoal) * 100), 100) : 0;
  const dashOffset = 213.6 - (stepPct / 100) * 213.6;

  const features = [
    { id: 'workout', title: t('core_power_workout') || 'Core Power Workout', desc: '15 min • ' + (t('all_levels') || 'All Levels'), icon: '🔥', btn: t('start_workout') || 'Start Workout', path: '/exercise' },
    { id: 'meditation', title: t('zen_mind_meditation') || 'Zen Mind Meditation', desc: '10 min • ' + (t('relaxing') || 'Relaxing'), icon: '🧘', btn: t('play') || 'Play', path: '/meditation' },
    { id: 'water', title: t('hydration_tracker') || 'Hydration Tracker', desc: `${waterGlasses}/${goalGlasses} glasses`, icon: '💧', btn: t('add_food') || 'Add', path: '/water-tracker' },
  ];

  const fmt = (n: number | null) => (n == null ? '—' : n.toLocaleString());

  const stats = [
    { label: t('burned') || 'Burned', value: fmt(burned), unit: 'kcal', icon: '🔥', color: '#F0F1F3' },
    { label: t('consumed') || 'Consumed', value: consumed.toLocaleString(), unit: 'kcal', icon: '🍎', color: '#E3F2FD' },
    { label: t('steps') || 'Steps', value: fmt(steps), unit: 'Steps', icon: '👟', color: '#F1F8E9' },
    { label: t('water') || 'Water', value: `${waterGlasses}/${goalGlasses}`, unit: 'glasses', icon: '💧', color: '#F0F1F3' },
  ];

  return (
    <div className="page animate-in">
      <PageHeader onOpenMenu={onOpenMenu} />

      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{t('daily_hub') || 'Daily Hub'}</h2>

      <div className="card card-gold" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 20px', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6" strokeDasharray="213.6"
              strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏃</div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>{greeting}{userName ? `, ${userName}` : ''}!</h3>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: 8 }}>{t('todays_goal') || "Today's Goal"}:</p>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{stepGoal.toLocaleString()} {t('steps') || 'steps'}</div>
          <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: 2 }}>
            {steps != null ? `${steps.toLocaleString()} / ${stepGoal.toLocaleString()}` : t('connect_health') || 'Connect Apple Health to track'}
          </div>
        </div>
      </div>

      <div className="scroll-row" style={{ marginBottom: 24 }}>
        {features.map(f => (
          <div key={f.id} className="feature-card" onClick={() => navigate(f.path)} style={{ cursor: 'pointer' }}>
            <div className="feature-card-icon">{f.icon}</div>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <button className="feature-card-btn">{f.btn}</button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-title">{t('statistics') || 'Statistics'}</h3>
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" onClick={() => navigate('/health-tracker')}>
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <h3 className="section-title">{t('community_feed') || 'Community Feed'}</h3>
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>👤</div>
          ))}
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>+12</div>
        </div>
        <button className="btn btn-gold btn-full" onClick={() => navigate('/premium')}>{t('view_full_feed') || 'View Full Feed'}</button>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
