interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

interface Workout { id: number; type: string; category: string; duration: number; calories: number; intensity: string; date: string; }

const ExercisePage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'browse' | 'log' | 'history'>('browse');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('sajoma-workouts');
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({ type: '', category: 'cardio', duration: '', intensity: 'moderate' });
  const [workoutStarted, setWorkoutStarted] = useState(false);

  const categories = [
    { id: 'cardio', icon: '🏃', label: t('cardio') || 'Cardio' },
    { id: 'strength', icon: '🏋️', label: t('strength') || 'Strength' },
    { id: 'flexibility', icon: '🧘', label: t('flexibility') || 'Flexibility' },
    { id: 'sports', icon: '⚽', label: t('sports') || 'Sports' },
    { id: 'walking', icon: '🚶', label: t('walking_running') || 'Walking' },
  ];

  const presetWorkouts = [
    {
      id: 1, name: 'Core Power', duration: '15 min', level: 'All Levels', calories: 150, icon: '💪',
      color: 'var(--gold-gradient-card)',
      videoId: 'DHD1-2P94DI',
      steps: [
        { name: 'Plank', desc: 'Hold a strong plank position, engaging your core and maintaining proper form.' },
        { name: 'Squats', desc: 'Lower your body with controlled movement, keeping your back straight.' },
        { name: 'Core Crunches', desc: 'Activate your core with dynamic crunches and leg raises.' },
        { name: 'Cool Down', desc: 'Gentle stretching to relax muscles and improve flexibility.' },
      ]
    },
    {
      id: 2, name: 'HIIT Burn', duration: '20 min', level: 'Intermediate', calories: 250, icon: '🔥',
      color: 'linear-gradient(145deg, #F8B4C8 0%, #E090A8 100%)',
      videoId: 'ml6cT4AZdqI',
      steps: [
        { name: 'Jumping Jacks', desc: 'Full body warm-up with explosive jumps.' },
        { name: 'Burpees', desc: 'High-intensity full body exercise for maximum calorie burn.' },
        { name: 'Mountain Climbers', desc: 'Fast-paced cardio targeting core and legs.' },
        { name: 'Sprint Intervals', desc: 'Alternate between sprints and rest periods.' },
      ]
    },
    {
      id: 3, name: 'Yoga Flow', duration: '30 min', level: 'Beginner', calories: 120, icon: '🧘',
      color: 'linear-gradient(145deg, #A8D8A8 0%, #7CB87C 100%)',
      videoId: 'v7AYKMP6rOE',
      steps: [
        { name: 'Sun Salutation', desc: 'Flowing sequence to warm up the entire body.' },
        { name: 'Warrior Poses', desc: 'Build strength and balance with warrior series.' },
        { name: 'Tree Pose', desc: 'Improve balance and focus with this standing pose.' },
        { name: 'Savasana', desc: 'Final relaxation to absorb the benefits of your practice.' },
      ]
    },
    {
      id: 4, name: 'Full Body Blast', duration: '25 min', level: 'Advanced', calories: 300, icon: '⚡',
      color: 'linear-gradient(145deg, #B8A0D8 0%, #9080B8 100%)',
      videoId: 'UItWltVZZmE',
      steps: [
        { name: 'Deadlifts', desc: 'Compound movement targeting posterior chain.' },
        { name: 'Push-ups', desc: 'Classic upper body strength builder.' },
        { name: 'Lunges', desc: 'Unilateral leg exercise for balance and strength.' },
        { name: 'Plank Hold', desc: 'Core stability finisher.' },
      ]
    },
  ];

  const [selectedWorkout, setSelectedWorkout] = useState<typeof presetWorkouts[0] | null>(null);

  const estimateCal = () => {
    const d = parseInt(form.duration) || 0;
    const mult = form.intensity === 'light' ? 4 : form.intensity === 'moderate' ? 7 : form.intensity === 'intense' ? 10 : 13;
    return d * mult;
  };

  const handleLog = () => {
    if (!form.type || !form.duration) return;
    const w: Workout = { id: Date.now(), type: form.type, category: form.category, duration: parseInt(form.duration), calories: Number(estimateCal()), intensity: form.intensity, date: new Date().toISOString() };
    const updated = [w, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('sajoma-workouts', JSON.stringify(updated));
    setForm({ type: '', category: 'cardio', duration: '', intensity: 'moderate' });
    setActiveTab('history');
  };

  if (selectedWorkout) {
    return (
      <div className="page animate-in">
        <PageHeader title={selectedWorkout.name} showBack onOpenMenu={onOpenMenu} />

        {/* YouTube Video Embed - 16:9 responsive */}
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
                boxShadow: '0 4px 20px rgba(212,160,23,0.6)',
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
          <div style={{ width: 1.5, height: 36, background: 'rgba(212,160,23,0.2)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text)' }}>{selectedWorkout.level.split(' ')[0]}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Level</div></div>
          <div style={{ width: 1.5, height: 36, background: 'rgba(212,160,23,0.2)' }} />
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--gold)' }}>{selectedWorkout.calories}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Calories</div></div>
        </div>

        <div className="card" style={{ padding: '8px 18px', marginBottom: 24 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4, color: 'var(--text)', padding: '8px 0' }}>{t('workout_steps') || 'Workout Steps'}</h3>
          {selectedWorkout.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 0', borderBottom: i < selectedWorkout.steps.length - 1 ? '1px solid rgba(212,160,23,0.08)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '0.85rem', flexShrink: 0 }}>{i + 1}</div>
              <div><div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', marginBottom: 2 }}>{step.name}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{step.desc}</div></div>
            </div>
          ))}
        </div>

        <button className="btn btn-gold btn-full btn-lg" onClick={() => { setWorkoutStarted(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          {t('start_workout') || 'START WORKOUT'}
        </button>

        <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); window.location.href = '/login'; }} />
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
          {presetWorkouts.map(w => (
            <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, cursor: 'pointer', marginBottom: 12 }} onClick={() => { setSelectedWorkout(w); setWorkoutStarted(false); }}>
              <div style={{ width: 72, height: 54, borderRadius: 12, overflow: 'hidden', flexShrink: 0, position: 'relative', boxShadow: 'var(--shadow-sm)' }}>
                <img src={`https://img.youtube.com/vi/${w.videoId}/mqdefault.jpg`} alt={w.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(212,160,23,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', paddingLeft: 2, color: 'white' }}>▶</div>
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
            <div><label className="label">{t('category') || 'Category'}</label><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{categories.map(c => (<button key={c.id} onClick={() => setForm({ ...form, category: c.id })} className={`btn ${form.category === c.id ? 'btn-gold' : 'btn-pink'} btn-sm`}>{c.icon} {c.label}</button>))}</div></div>
            <div><label className="label">{t('exercise_type') || 'Exercise Type'}</label><input className="input" placeholder="e.g. Running..." value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} /></div>
            <div><label className="label">{t('duration_minutes') || 'Duration (min)'}</label><input className="input" type="number" placeholder="30" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>
            <button className="btn btn-gold btn-full btn-lg" onClick={handleLog} disabled={!form.type || !form.duration}>{t('log_workout') || 'Log Workout'}</button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {workouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}><div style={{ fontSize: '3rem', marginBottom: 16 }}>📅</div><h3 style={{ marginBottom: 8 }}>No workouts yet</h3><p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Complete your first workout to see your history here.</p></div>
          ) : (
            workouts.map(w => (
              <div key={w.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{categories.find(c => c.id === w.category)?.icon || '💪'}</div>
                <div style={{ flex: 1 }}><h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 2 }}>{w.type}</h3><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{w.duration} min · {w.calories} kcal · {new Date(w.date).toLocaleDateString()}</p></div>
              </div>
            ))
          )}
        </div>
      )}

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); window.location.href = '/login'; }} />
      <BottomNav />
    </div>
  );
};

export default ExercisePage;
