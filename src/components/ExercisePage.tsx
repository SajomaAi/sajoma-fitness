interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { supabase } from '../lib/supabase';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

interface WorkoutRow {
  id: string;
  workout_type: string;
  duration_min: number;
  calories_burned: number | null;
  intensity: 'low' | 'medium' | 'high' | null;
  notes: string | null;
  performed_at: string;
}

const CATEGORIES = [
  { id: 'cardio', icon: '🏃', labelKey: 'cardio', defaultLabel: 'Cardio' },
  { id: 'strength', icon: '🏋️', labelKey: 'strength', defaultLabel: 'Strength' },
  { id: 'flexibility', icon: '🧘', labelKey: 'flexibility', defaultLabel: 'Flexibility' },
  { id: 'sports', icon: '⚽', labelKey: 'sports', defaultLabel: 'Sports' },
  { id: 'walking', icon: '🚶', labelKey: 'walking_running', defaultLabel: 'Walking' },
];

const PRESETS = [
  { id: 1, name: 'Core Power', duration: '15 min', level: 'All Levels', calories: 150, icon: '💪', videoId: 'DHD1-2P94DI',
    steps: [
      { name: 'Plank', desc: 'Hold a strong plank position, engaging your core and maintaining proper form.' },
      { name: 'Squats', desc: 'Lower your body with controlled movement, keeping your back straight.' },
      { name: 'Core Crunches', desc: 'Activate your core with dynamic crunches and leg raises.' },
      { name: 'Cool Down', desc: 'Gentle stretching to relax muscles and improve flexibility.' },
    ]},
  { id: 2, name: 'HIIT Burn', duration: '20 min', level: 'Intermediate', calories: 250, icon: '🔥', videoId: 'ml6cT4AZdqI',
    steps: [
      { name: 'Jumping Jacks', desc: 'Full body warm-up with explosive jumps.' },
      { name: 'Burpees', desc: 'High-intensity full body exercise for maximum calorie burn.' },
      { name: 'Mountain Climbers', desc: 'Fast-paced cardio targeting core and legs.' },
      { name: 'Sprint Intervals', desc: 'Alternate between sprints and rest periods.' },
    ]},
  { id: 3, name: 'Yoga Flow', duration: '30 min', level: 'Beginner', calories: 120, icon: '🧘', videoId: 'v7AYKMP6rOE',
    steps: [
      { name: 'Sun Salutation', desc: 'Flowing sequence to warm up the entire body.' },
      { name: 'Warrior Poses', desc: 'Build strength and balance with warrior series.' },
      { name: 'Tree Pose', desc: 'Improve balance and focus with this standing pose.' },
      { name: 'Savasana', desc: 'Final relaxation to absorb the benefits of your practice.' },
    ]},
  { id: 4, name: 'Full Body Blast', duration: '25 min', level: 'Advanced', calories: 300, icon: '⚡', videoId: 'UItWltVZZmE',
    steps: [
      { name: 'Deadlifts', desc: 'Compound movement targeting posterior chain.' },
      { name: 'Push-ups', desc: 'Classic upper body strength builder.' },
      { name: 'Lunges', desc: 'Unilateral leg exercise for balance and strength.' },
      { name: 'Plank Hold', desc: 'Core stability finisher.' },
    ]},
];

const ExercisePage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'browse' | 'log' | 'history'>('browse');
  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ type: '', category: 'cardio', duration: '', intensity: 'medium' as 'low' | 'medium' | 'high' });
  const [saving, setSaving] = useState(false);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<typeof PRESETS[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('workouts')
        .select('id, workout_type, duration_min, calories_burned, intensity, notes, performed_at')
        .order('performed_at', { ascending: false })
        .limit(50);
      setWorkouts((data as WorkoutRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const estimateCal = (duration: number, intensity: 'low' | 'medium' | 'high'): number => {
    const mult = intensity === 'low' ? 4 : intensity === 'medium' ? 7 : 10;
    return duration * mult;
  };

  const handleLog = async () => {
    const duration = parseInt(form.duration);
    if (!form.type || !duration) return;
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setSaving(false); showToast('Not signed in'); return; }
    const payload = {
      user_id: userData.user.id,
      workout_type: `${form.category}:${form.type}`,
      duration_min: duration,
      calories_burned: estimateCal(duration, form.intensity),
      intensity: form.intensity,
      notes: null,
      performed_at: new Date().toISOString(),
    };
    const { data, error } = await supabase.from('workouts').insert(payload).select().single();
    setSaving(false);
    if (error) { showToast(error.message); return; }
    setWorkouts([data as WorkoutRow, ...workouts]);
    setForm({ type: '', category: 'cardio', duration: '', intensity: 'medium' });
    showToast(t('workout_logged') || 'Workout logged!');
    setActiveTab('history');
  };

  const logPreset = async (preset: typeof PRESETS[0]) => {
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) { setSaving(false); showToast('Not signed in'); return; }
    const duration = parseInt(preset.duration) || 20;
    const { data, error } = await supabase.from('workouts').insert({
      user_id: userData.user.id,
      workout_type: `preset:${preset.name}`,
      duration_min: duration,
      calories_burned: preset.calories,
      intensity: 'medium' as const,
      notes: null,
      performed_at: new Date().toISOString(),
    }).select().single();
    setSaving(false);
    if (error) { showToast(error.message); return; }
    setWorkouts([data as WorkoutRow, ...workouts]);
    showToast(t('workout_logged') || 'Workout logged!');
  };

  const displayName = (w: WorkoutRow): string => {
    const parts = w.workout_type.split(':');
    return parts.length > 1 ? parts[1] : w.workout_type;
  };
  const displayCategory = (w: WorkoutRow): string => {
    const parts = w.workout_type.split(':');
    return parts.length > 1 ? parts[0] : 'other';
  };

  if (selectedWorkout) {
    return (
      <div className="page animate-in">
        <PageHeader title={selectedWorkout.name} showBack onOpenMenu={onOpenMenu} />

        <div style={{
          borderRadius: 20, overflow: 'hidden', marginBottom: 20,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          background: '#000',
          position: 'relative',
          paddingTop: '56.25%',
        }}>
          {workoutStarted ? (
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              src={`https://www.youtube.com/embed/${selectedWorkout.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={`${selectedWorkout.name} workout video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `url(https://img.youtube.com/vi/${selectedWorkout.videoId}/hqdefault.jpg) center/cover no-repeat`,
              }}
              onClick={() => setWorkoutStarted(true)}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
              <div style={{
                position: 'relative', zIndex: 2,
                width: 72, height: 72, borderRadius: '50%',
                background: 'var(--gold-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 20px rgba(212,175,55,0.6)',
                fontSize: '1.8rem', paddingLeft: 6,
              }}>▶</div>
              <div style={{
                position: 'absolute', bottom: 16, left: 0, right: 0,
                textAlign: 'center', color: 'white', fontSize: '0.85rem',
                fontWeight: 600, zIndex: 2, textShadow: '0 1px 4px rgba(0,0,0,0.8)'
              }}>Tap to play workout video</div>
            </div>
          )}
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '18px 12px', marginBottom: 20 }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>{selectedWorkout.duration.split(' ')[0]}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>min</div></div>
          <div style={{ width: 1.5, height: 36, background: 'rgba(212,175,55,0.2)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>{selectedWorkout.level.split(' ')[0]}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Level</div></div>
          <div style={{ width: 1.5, height: 36, background: 'rgba(212,175,55,0.2)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>{selectedWorkout.calories}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calories</div></div>
        </div>

        <div className="card" style={{ padding: '8px 18px', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4, color: 'var(--text)', padding: '8px 0' }}>{t('workout_steps') || 'Workout Steps'}</h3>
          {selectedWorkout.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: i < selectedWorkout.steps.length - 1 ? '1px solid rgba(212,175,55,0.08)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: 2 }}>{step.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <button className="btn btn-gold btn-lg" style={{ flex: 2 }} onClick={() => { setWorkoutStarted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            {t('start_workout') || 'START WORKOUT'}
          </button>
          <button className="btn btn-pink btn-lg" style={{ flex: 1 }} onClick={() => logPreset(selectedWorkout)} disabled={saving}>
            {saving ? '…' : (t('log_it') || 'Log it')}
          </button>
        </div>

        {toast && (
          <div style={{
            position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
            background: '#212529', color: 'white', padding: '10px 18px', borderRadius: 999,
            fontSize: '0.85rem', fontWeight: 600, zIndex: 1000, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}>{toast}</div>
        )}

        <BottomNav />
      </div>
    );
  }

  return (
    <div className="page animate-in">
      <PageHeader title={t('workouts') || 'Workouts'} onOpenMenu={onOpenMenu} />
      <div className="tabs">
        <button className={`tab ${activeTab === 'browse' ? 'active' : ''}`} onClick={() => setActiveTab('browse')}>{t('browse') || 'Browse'}</button>
        <button className={`tab ${activeTab === 'log' ? 'active' : ''}`} onClick={() => setActiveTab('log')}>{t('log') || 'Log'}</button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>{t('history') || 'History'}</button>
      </div>

      {activeTab === 'browse' && (
        <>
          <div className="scroll-row" style={{ marginBottom: 20 }}>
            {['All', 'Cardio', 'Strength', 'Yoga', 'HIIT'].map((cat, i) => (
              <button key={cat} className={`btn ${i === 0 ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flexShrink: 0 }}>{cat}</button>
            ))}
          </div>
          {PRESETS.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer', marginBottom: 12 }} onClick={() => { setSelectedWorkout(w); setWorkoutStarted(false); }}>
              <div style={{ width: 72, height: 54, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                <img src={`https://img.youtube.com/vi/${w.videoId}/mqdefault.jpg`} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(212,175,55,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', paddingLeft: 2, color: 'white' }}>▶</div>
                </div>
              </div>
              <div style={{ flex: 1 }}><h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 2, color: 'var(--text)' }}>{w.name}</h3><p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{w.duration} · {w.level} · {w.calories} cal</p></div>
              <span style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 600 }}>›</span>
            </div>
          ))}
        </>
      )}

      {activeTab === 'log' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-title">{t('log_workout') || 'Log Workout'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="label">{t('category') || 'Category'}</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setForm({ ...form, category: c.id })} className={`btn ${form.category === c.id ? 'btn-gold' : 'btn-pink'} btn-sm`}>
                    {c.icon} {t(c.labelKey) || c.defaultLabel}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">{t('exercise_type') || 'Exercise Type'}</label>
              <input className="input" placeholder="e.g. Running..." value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
            </div>
            <div>
              <label className="label">{t('duration_minutes') || 'Duration (min)'}</label>
              <input className="input" type="number" placeholder="30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
            </div>
            <div>
              <label className="label">{t('intensity') || 'Intensity'}</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['low', 'medium', 'high'] as const).map(i => (
                  <button key={i} onClick={() => setForm({ ...form, intensity: i })} className={`btn ${form.intensity === i ? 'btn-gold' : 'btn-pink'} btn-sm`} style={{ flex: 1 }}>
                    {t(`intensity_${i}`) || i}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn btn-gold btn-full btn-lg" onClick={handleLog} disabled={saving || !form.type || !form.duration}>
              {saving ? '…' : (t('log_workout') || 'Log Workout')}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
          ) : workouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📅</div>
              <h3 style={{ marginBottom: 8 }}>{t('no_workouts_yet') || 'No workouts yet'}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{t('complete_first_workout') || 'Complete your first workout to see your history here.'}</p>
            </div>
          ) : (
            workouts.map(w => (
              <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
                  {CATEGORIES.find(c => c.id === displayCategory(w))?.icon || '💪'}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 2 }}>{displayName(w)}</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {w.duration_min} min · {w.calories_burned ?? 0} kcal · {new Date(w.performed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {toast && (
        <div style={{
          position: 'fixed', bottom: 88, left: '50%', transform: 'translateX(-50%)',
          background: '#212529', color: 'white', padding: '10px 18px', borderRadius: 999,
          fontSize: '0.85rem', fontWeight: 600, zIndex: 1000, boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
        }}>{toast}</div>
      )}

      <BottomNav />
    </div>
  );
};

export default ExercisePage;
