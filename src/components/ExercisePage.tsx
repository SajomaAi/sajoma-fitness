import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface Workout { id: number; type: string; category: string; duration: number; calories: number; intensity: string; date: string; }

const ExercisePage: React.FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'log'|'history'|'summary'>('log');
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('sajoma-workouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ type: '', category: 'cardio', duration: '', intensity: 'moderate' });

  const categories = [
    { id: 'cardio', icon: '🏃', label: t('cardio') || 'Cardio' },
    { id: 'strength', icon: '🏋️', label: t('strength') || 'Strength' },
    { id: 'flexibility', icon: '🧘', label: t('flexibility') || 'Flexibility' },
    { id: 'sports', icon: '⚽', label: t('sports') || 'Sports' },
    { id: 'walking', icon: '🚶', label: t('walking_running') || 'Walking' },
  ];

  const intensities = ['light', 'moderate', 'intense', 'extreme'];

  const estimateCal = () => {
    const d = parseInt(form.duration) || 0;
    const mult = form.intensity === 'light' ? 4 : form.intensity === 'moderate' ? 7 : form.intensity === 'intense' ? 10 : 13;
    return d * mult;
  };

  const handleLog = () => {
    if (!form.type || !form.duration) return;
    const w: Workout = {
      id: Date.now(), type: form.type, category: form.category,
      duration: parseInt(form.duration), calories: estimateCal(),
      intensity: form.intensity, date: new Date().toISOString(),
    };
    const updated = [w, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('sajoma-workouts', JSON.stringify(updated));
    setForm({ type: '', category: 'cardio', duration: '', intensity: 'moderate' });
  };

  const weekWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  });
  const weekCal = weekWorkouts.reduce((s, w) => s + w.calories, 0);
  const weekMin = weekWorkouts.reduce((s, w) => s + w.duration, 0);

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>💪 {t('exercise_tracking') || 'Exercise'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 16 }}>{t('exercise_subtitle') || 'Track your workouts'}</p>

      <div className="sf-tabs">
        {(['log','history','summary'] as const).map(tb => (
          <button key={tb} className={`sf-tab ${tab === tb ? 'active' : ''}`} onClick={() => setTab(tb)}>
            {tb === 'log' ? (t('log_workout') || 'Log') : tb === 'history' ? (t('history') || 'History') : (t('weekly_summary') || 'Summary')}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div>
          <div className="sf-card" style={{ padding: 18, marginBottom: 16 }}>
            <label className="sf-label">{t('category') || 'Category'}</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {categories.map(c => (
                <button key={c.id} onClick={() => setForm({...form, category: c.id})}
                  style={{
                    padding: '10px 14px', borderRadius: 12, border: 'none', cursor: 'pointer',
                    background: form.category === c.id ? 'linear-gradient(135deg, #D4A017, #C5961B)' : '#FFF0F5',
                    color: form.category === c.id ? 'white' : '#5D4037',
                    fontWeight: 600, fontSize: '0.82rem', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  <span>{c.icon}</span> {c.label}
                </button>
              ))}
            </div>

            <label className="sf-label">{t('exercise_type') || 'Exercise Type'}</label>
            <input className="sf-input" placeholder={t('exercise_type_placeholder') || 'e.g. Running, Push-ups...'} value={form.type} onChange={e => setForm({...form, type: e.target.value})} style={{ marginBottom: 14 }} />

            <label className="sf-label">{t('duration_minutes') || 'Duration (min)'}</label>
            <input className="sf-input" type="number" placeholder="30" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} style={{ marginBottom: 14 }} />

            <label className="sf-label">{t('intensity') || 'Intensity'}</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {intensities.map(int => (
                <button key={int} onClick={() => setForm({...form, intensity: int})}
                  style={{
                    flex: 1, padding: '10px 4px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    background: form.intensity === int ? 'linear-gradient(135deg, #D4A017, #C5961B)' : '#FFF0F5',
                    color: form.intensity === int ? 'white' : '#5D4037',
                    fontWeight: 600, fontSize: '0.72rem', fontFamily: 'inherit', textTransform: 'capitalize',
                  }}>
                  {t(int) || int}
                </button>
              ))}
            </div>

            {form.duration && (
              <div className="sf-card sf-card-pink" style={{ padding: 14, marginBottom: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#8D6E63', margin: '0 0 4px' }}>{t('estimated_calories') || 'Estimated Calories'}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#C5961B', margin: 0 }}>🔥 {estimateCal()} kcal</p>
              </div>
            )}

            <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={handleLog} disabled={!form.type || !form.duration}>
              {t('log_workout') || 'Log Workout'}
            </button>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {workouts.length === 0 ? (
            <div className="sf-card" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>🏋️</p>
              <p style={{ color: '#8D6E63' }}>{t('no_workouts_yet') || 'No workouts logged yet'}</p>
            </div>
          ) : workouts.slice(0, 20).map(w => (
            <div key={w.id} className="sf-card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF0F5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                {categories.find(c => c.id === w.category)?.icon || '💪'}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: '0.92rem', margin: 0 }}>{w.type}</p>
                <p style={{ color: '#8D6E63', fontSize: '0.78rem', margin: 0 }}>{w.duration} min · {t(w.intensity) || w.intensity}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '0.92rem', margin: 0, color: '#C5961B' }}>{w.calories}</p>
                <p style={{ color: '#BCAAA4', fontSize: '0.7rem', margin: 0 }}>kcal</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'summary' && (
        <div>
          <div className="stat-grid" style={{ marginBottom: 16 }}>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF0F5' }}>🔥</div>
              <div className="stat-value">{weekCal}</div>
              <div className="stat-label">{t('calories_burned') || 'Calories Burned'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#FFF8E1' }}>⏱️</div>
              <div className="stat-value">{weekMin}</div>
              <div className="stat-label">{t('minutes_active') || 'Minutes Active'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#E3F2FD' }}>🏋️</div>
              <div className="stat-value">{weekWorkouts.length}</div>
              <div className="stat-label">{t('workouts') || 'Workouts'}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#F3E5F5' }}>📊</div>
              <div className="stat-value">{weekWorkouts.length > 0 ? Math.round(weekMin / weekWorkouts.length) : 0}</div>
              <div className="stat-label">{t('avg_duration') || 'Avg Duration'}</div>
            </div>
          </div>
          <div className="sf-card sf-card-gold" style={{ padding: 18, textAlign: 'center' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 4 }}>
              {weekWorkouts.length >= 5 ? '🎉 Amazing week!' : weekWorkouts.length >= 3 ? '💪 Great progress!' : '🌟 Keep going!'}
            </p>
            <p style={{ fontSize: '0.82rem', opacity: 0.9 }}>
              {t('weekly_goal_msg') || `${weekWorkouts.length} of 5 workouts this week`}
            </p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ExercisePage;
