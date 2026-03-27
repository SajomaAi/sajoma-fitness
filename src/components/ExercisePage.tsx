import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface Workout { id: number; type: string; category: string; duration: number; calories: number; intensity: string; date: string; }

const ExercisePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'browse' | 'log' | 'history'>('browse');
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

  const presetWorkouts = [
    { id: 1, name: 'Core Power', duration: '15 min', level: 'All Levels', calories: 150, icon: '💪', color: 'var(--gold-gradient-card)', steps: [
      { name: 'Plank', desc: 'Hold a strong plank position, engaging your core and maintaining proper form.' },
      { name: 'Squats', desc: 'Lower your body with controlled movement, keeping your back straight.' },
      { name: 'Core Power', desc: 'Activate your core with dynamic crunches and leg raises.' },
      { name: 'Cool Down', desc: 'Gentle stretching to relax muscles and improve flexibility.' },
    ]},
    { id: 2, name: 'HIIT Burn', duration: '20 min', level: 'Intermediate', calories: 250, icon: '🔥', color: 'linear-gradient(145deg, #F8B4C8 0%, #E090A8 100%)', steps: [
      { name: 'Jumping Jacks', desc: 'Full body warm-up with explosive jumps.' },
      { name: 'Burpees', desc: 'High-intensity full body exercise for maximum calorie burn.' },
      { name: 'Mountain Climbers', desc: 'Fast-paced cardio targeting core and legs.' },
      { name: 'Sprint Intervals', desc: 'Alternate between sprints and rest periods.' },
    ]},
    { id: 3, name: 'Yoga Flow', duration: '30 min', level: 'Beginner', calories: 120, icon: '🧘', color: 'linear-gradient(145deg, #A8D8A8 0%, #7CB87C 100%)', steps: [
      { name: 'Sun Salutation', desc: 'Flowing sequence to warm up the entire body.' },
      { name: 'Warrior Poses', desc: 'Build strength and balance with warrior series.' },
      { name: 'Tree Pose', desc: 'Improve balance and focus with this standing pose.' },
      { name: 'Savasana', desc: 'Final relaxation to absorb the benefits of your practice.' },
    ]},
    { id: 4, name: 'Full Body Blast', duration: '25 min', level: 'Advanced', calories: 300, icon: '⚡', color: 'linear-gradient(145deg, #B8A0D8 0%, #9080B8 100%)', steps: [
      { name: 'Deadlifts', desc: 'Compound movement targeting posterior chain.' },
      { name: 'Push-ups', desc: 'Classic upper body strength builder.' },
      { name: 'Lunges', desc: 'Unilateral leg exercise for balance and strength.' },
      { name: 'Plank Hold', desc: 'Core stability finisher.' },
    ]},
  ];

  const [selectedWorkout, setSelectedWorkout] = useState<typeof presetWorkouts[0] | null>(null);

  const estimateCal = () => {
    const d = parseInt(form.duration) || 0;
    const mult = form.intensity === 'light' ? 4 : form.intensity === 'moderate' ? 7 : form.intensity === 'intense' ? 10 : 13;
    return d * mult;
  };

  const handleLog = () => {
    if (!form.type || !form.duration) return;
    const w: Workout = { id: Date.now(), type: form.type, category: form.category, duration: parseInt(form.duration), calories: estimateCal(), intensity: form.intensity, date: new Date().toISOString() };
    const updated = [w, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('sajoma-workouts', JSON.stringify(updated));
    setForm({ type: '', category: 'cardio', duration: '', intensity: 'moderate' });
  };

  const weekWorkouts = workouts.filter(w => { const diff = (Date.now() - new Date(w.date).getTime()) / 86400000; return diff <= 7; });
  const weekCal = weekWorkouts.reduce((s, w) => s + w.calories, 0);
  const weekMin = weekWorkouts.reduce((s, w) => s + w.duration, 0);

  // Workout Detail View
  if (selectedWorkout) {
    return (
      <div className="page animate-in">
        <div className="page-header">
          <button className="page-back" onClick={() => setSelectedWorkout(null)}>‹</button>
          <h1 className="page-header-title">{selectedWorkout.name}</h1>
          <div style={{ width: 32 }} />
        </div>

        {/* Video/Image Area */}
        <div style={{ background: 'linear-gradient(135deg, #3E2723 0%, #5D4037 100%)', borderRadius: 20, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
          <div style={{ fontSize: '4rem', opacity: 0.3, position: 'absolute' }}>{selectedWorkout.icon}</div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', color: 'white', zIndex: 1, boxShadow: '0 4px 20px rgba(212,160,23,0.4)' }}>▶</div>
        </div>

        {/* Stats Bar */}
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 12px', marginBottom: 20, position: 'relative' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A017' }}>15</div>
            <div style={{ fontSize: '0.72rem', color: '#8D6E63', fontWeight: 600 }}>min</div>
          </div>
          <div style={{ width: 1.5, height: 36, background: 'linear-gradient(180deg, transparent, #D4A017, transparent)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3E2723' }}>All</div>
            <div style={{ fontSize: '0.72rem', color: '#8D6E63', fontWeight: 600 }}>Levels</div>
          </div>
          <div style={{ width: 1.5, height: 36, background: 'linear-gradient(180deg, transparent, #D4A017, transparent)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A017' }}>150</div>
            <div style={{ fontSize: '0.72rem', color: '#8D6E63', fontWeight: 600 }}>Calories (Est.)</div>
          </div>
        </div>

        {/* Step-by-Step Exercises */}
        <div className="card" style={{ padding: '8px 18px', marginBottom: 24 }}>
          {selectedWorkout.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: i < selectedWorkout.steps.length - 1 ? '1px solid rgba(212,160,23,0.08)' : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', color: 'white', flexShrink: 0, boxShadow: '0 2px 8px rgba(212,160,23,0.25)' }}>▶</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#3E2723', marginBottom: 2 }}>Step {i + 1}: {step.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#8D6E63', lineHeight: 1.5 }}>{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-gold btn-full btn-lg" style={{ fontSize: '1.05rem', letterSpacing: '0.05em', padding: '18px 28px', fontWeight: 800 }}>
          START WORKOUT
        </button>

        <BottomNav />
      </div>
    );
  }

  // Main View
  return (
    <div className="page animate-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">{t('workouts') || 'Workouts'}</h1>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>{t('browse') || 'Browse'}</button>
        <button className={`tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>{t('log') || 'Log'}</button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>{t('history') || 'History'}</button>
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Category Filter */}
          <div className="scroll-row" style={{ marginBottom: 20 }}>
            {['All', 'Cardio', 'Strength', 'Yoga', 'HIIT', 'Stretching'].map((cat, i) => (
              <button key={cat} className={`btn ${i === 0 ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flexShrink: 0 }}>{cat}</button>
            ))}
          </div>

          {/* Workout Cards */}
          {presetWorkouts.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer' }} onClick={() => setSelectedWorkout(w)}>
              <div style={{ width: 60, height: 60, borderRadius: 16, background: w.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, boxShadow: '0 4px 12px rgba(212,160,23,0.15)' }}>{w.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2, color: '#3E2723' }}>{w.name}</h3>
                <p style={{ fontSize: '0.78rem', color: '#8D6E63', margin: 0 }}>{w.duration} · {w.level} · {w.calories} cal</p>
              </div>
              <span style={{ color: '#D4A017', fontSize: '1.2rem', fontWeight: 600 }}>›</span>
            </div>
          ))}

          {/* Quick Start Card */}
          <div className="card card-gold" style={{ padding: 22, marginTop: 8, textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 8 }}>Quick Start</h3>
            <p style={{ fontSize: '0.8rem', opacity: 0.85, marginBottom: 16 }}>Start a timer and log your own workout</p>
            <button className="btn btn-full" style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 700 }}>⏱️ Start Timer</button>
          </div>
        </>
      )}

      {activeTab === 'log' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title">{t('log_workout') || 'Log Workout'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label">{t('category') || 'Category'}</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {categories.map(c => (
                  <button key={c.id} onClick={() => setForm({ ...form, category: c.id })} className={`btn ${form.category === c.id ? 'btn-gold' : 'btn-pink'} btn-sm`}>
                    {c.icon} {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div><label className="label">{t('exercise_type') || 'Exercise Type'}</label><input className="input" placeholder="e.g. Running, Push-ups..." value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></div>
            <div><label className="label">{t('duration_minutes') || 'Duration (min)'}</label><input className="input" type="number" placeholder="30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <div>
              <label className="label">{t('intensity') || 'Intensity'}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {['light', 'moderate', 'intense', 'extreme'].map(int => (
                  <button key={int} onClick={() => setForm({ ...form, intensity: int })} className={`btn ${form.intensity === int ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flex: 1, textTransform: 'capitalize' }}>{int}</button>
                ))}
              </div>
            </div>
            {form.duration && (
              <div className="card card-pink" style={{ padding: 14, textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#8D6E63', margin: '0 0 4px' }}>Estimated Calories</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D4A017', margin: 0 }}>🔥 {estimateCal()} kcal</p>
              </div>
            )}
            <button className="btn btn-gold btn-full btn-lg" onClick={handleLog} disabled={!form.type || !form.duration}>
              {t('log_workout') || 'Log Workout'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          {/* Weekly Summary */}
          <div className="card card-gold" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12 }}>{t('this_week') || 'This Week'}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weekWorkouts.length}</div><div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Workouts</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weekMin}</div><div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Minutes</div></div>
              <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.3rem', fontWeight: 800 }}>{weekCal}</div><div style={{ fontSize: '0.68rem', opacity: 0.8 }}>Calories</div></div>
            </div>
          </div>
          {workouts.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <p style={{ fontSize: '2rem', marginBottom: 8 }}>🏋️</p>
              <p style={{ color: '#8D6E63' }}>{t('no_workouts_yet') || 'No workouts logged yet'}</p>
            </div>
          ) : workouts.slice(0, 20).map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(212,160,23,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                {categories.find(c => c.id === w.category)?.icon || '💪'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{w.type}</div>
                <div style={{ fontSize: '0.75rem', color: '#8D6E63' }}>{new Date(w.date).toLocaleDateString()} · {w.duration} min</div>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#D4A017' }}>{w.calories} cal</div>
            </div>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ExercisePage;
