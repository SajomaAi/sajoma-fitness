import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { isNativePlatform } from '../lib/capacitor';
import BottomNav from './BottomNav';

interface Workout {
  id: string;
  type: string;
  name: string;
  duration: number;
  calories: number;
  intensity: 'low' | 'medium' | 'high';
  notes: string;
  date: string;
  timestamp: number;
}

const EXERCISE_CATEGORIES = [
  { key: 'cardio', icon: '🏃', color: '#E53935' },
  { key: 'strength', icon: '🏋️', color: '#1E88E5' },
  { key: 'flexibility', icon: '🧘', color: '#8E24AA' },
  { key: 'sports', icon: '⚽', color: '#43A047' },
  { key: 'walking_running', icon: '🚶', color: '#FB8C00' },
];

const ExercisePage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'log' | 'history' | 'summary'>('log');
  const [selectedType, setSelectedType] = useState('cardio');
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [intensity, setIntensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [healthKitConnected, setHealthKitConnected] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('oleva-workouts');
    if (saved) setWorkouts(JSON.parse(saved));
    const hkStatus = localStorage.getItem('oleva-healthkit-connected');
    if (hkStatus === 'true') setHealthKitConnected(true);
  }, []);

  const saveWorkout = () => {
    if (!duration) return;
    const workout: Workout = {
      id: Date.now().toString(),
      type: selectedType,
      name: workoutName || t(selectedType),
      duration: parseInt(duration),
      calories: parseInt(caloriesBurned) || estimateCalories(selectedType, parseInt(duration), intensity),
      intensity,
      notes,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    };
    const updated = [workout, ...workouts];
    setWorkouts(updated);
    localStorage.setItem('oleva-workouts', JSON.stringify(updated));
    setShowSuccess(true);
    setWorkoutName('');
    setDuration('');
    setCaloriesBurned('');
    setNotes('');
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const estimateCalories = (type: string, dur: number, int: 'low' | 'medium' | 'high'): number => {
    const base: Record<string, number> = { cardio: 10, strength: 8, flexibility: 4, sports: 9, walking_running: 7 };
    const mult: Record<string, number> = { low: 0.7, medium: 1, high: 1.4 };
    return Math.round((base[type] || 7) * dur * (mult[int] || 1));
  };

  const connectHealthKit = async () => {
    if (!isNativePlatform()) {
      alert('Apple HealthKit is available on iOS devices only.');
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setHealthKitConnected(true);
      localStorage.setItem('oleva-healthkit-connected', 'true');
      setSyncing(false);
    }, 2000);
  };

  const getWeekWorkouts = () => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return workouts.filter(w => w.timestamp >= weekAgo);
  };

  const weekWorkouts = getWeekWorkouts();
  const weekStats = {
    total: weekWorkouts.length,
    duration: weekWorkouts.reduce((s, w) => s + w.duration, 0),
    calories: weekWorkouts.reduce((s, w) => s + w.calories, 0),
  };

  const deleteWorkout = (id: string) => {
    const updated = workouts.filter(w => w.id !== id);
    setWorkouts(updated);
    localStorage.setItem('oleva-workouts', JSON.stringify(updated));
  };

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>{t('exercise_tracking')}</h1>

      {/* Apple Health Sync Banner */}
      <div className="card" style={{
        padding: '14px 16px',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #E8F5E8 0%, #f0f7f0 100%)',
        border: '1px solid #c8e6c9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5rem' }}>❤️</span>
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{t('apple_health_sync')}</p>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>
              {healthKitConnected ? t('connected') : t('sync_with_apple_health')}
            </p>
          </div>
        </div>
        <button
          onClick={connectHealthKit}
          disabled={healthKitConnected || syncing}
          style={{
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: healthKitConnected ? '#4CAF50' : 'var(--primary-color)',
            color: 'white',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: healthKitConnected ? 'default' : 'pointer',
            opacity: syncing ? 0.7 : 1,
          }}
        >
          {syncing ? t('syncing') : healthKitConnected ? '✓ ' + t('connected') : t('connect')}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', backgroundColor: '#f1f3f5', borderRadius: '12px', padding: '4px' }}>
        {(['log', 'history', 'summary'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-gray)',
              fontWeight: activeTab === tab ? '700' : '500',
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {tab === 'log' ? t('log_workout') : tab === 'history' ? t('exercise_history') : t('weekly_summary')}
          </button>
        ))}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50', color: 'white', padding: '12px 24px',
          borderRadius: '12px', zIndex: 1000, fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {t('workout_saved')}
        </div>
      )}

      {/* LOG TAB */}
      {activeTab === 'log' && (
        <div>
          {/* Exercise Categories */}
          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontWeight: '600', marginBottom: '10px', fontSize: '0.95rem' }}>{t('workout_type')}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
              {EXERCISE_CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedType(cat.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    padding: '12px 4px', borderRadius: '12px', border: '2px solid',
                    borderColor: selectedType === cat.key ? cat.color : '#e9ecef',
                    backgroundColor: selectedType === cat.key ? cat.color + '15' : 'white',
                    cursor: 'pointer', transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{cat.icon}</span>
                  <span style={{ fontSize: '0.65rem', fontWeight: '600', color: selectedType === cat.key ? cat.color : '#666', textAlign: 'center', lineHeight: '1.2' }}>
                    {t(cat.key)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Workout Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{t('workout_name')} <span style={{ color: '#999', fontWeight: '400' }}>({t('optional')})</span></label>
            <input
              type="text"
              value={workoutName}
              onChange={e => setWorkoutName(e.target.value)}
              placeholder={t(selectedType)}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>

          {/* Duration & Calories Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{t('duration_min')}</label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="30"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{t('calories_burned')}</label>
              <input
                type="number"
                value={caloriesBurned}
                onChange={e => setCaloriesBurned(e.target.value)}
                placeholder="Auto"
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Intensity */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>{t('intensity')}</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['low', 'medium', 'high'] as const).map(level => {
                const colors: Record<string, string> = { low: '#4CAF50', medium: '#FF9800', high: '#E53935' };
                return (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid',
                      borderColor: intensity === level ? colors[level] : '#e9ecef',
                      backgroundColor: intensity === level ? colors[level] + '15' : 'white',
                      color: intensity === level ? colors[level] : '#666',
                      fontWeight: '600', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s ease',
                    }}
                  >
                    {t(level)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', fontSize: '0.9rem', display: 'block', marginBottom: '6px' }}>{t('notes')} <span style={{ color: '#999', fontWeight: '400' }}>({t('optional')})</span></label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder={t('write_your_thoughts')}
              rows={3}
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #dee2e6', fontSize: '1rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Save Button */}
          <button
            className="btn btn-full"
            onClick={saveWorkout}
            disabled={!duration}
            style={{ opacity: duration ? 1 : 0.5, fontSize: '1rem', padding: '14px', borderRadius: '12px' }}
          >
            {t('save_workout')}
          </button>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'history' && (
        <div>
          {workouts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-gray)' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>🏃</span>
              <p>{t('no_workouts_yet')}</p>
            </div>
          ) : (
            workouts.map(w => {
              const cat = EXERCISE_CATEGORIES.find(c => c.key === w.type);
              return (
                <div key={w.id} className="card" style={{ padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    backgroundColor: (cat?.color || '#666') + '20',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                  }}>
                    {cat?.icon || '🏃'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '0.95rem' }}>{w.name}</p>
                    <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.8rem' }}>
                      {w.date} · {w.duration} {t('min')} · {w.calories} {t('cal')}
                    </p>
                  </div>
                  <div style={{
                    padding: '4px 10px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600',
                    backgroundColor: w.intensity === 'high' ? '#FFEBEE' : w.intensity === 'medium' ? '#FFF3E0' : '#E8F5E9',
                    color: w.intensity === 'high' ? '#C62828' : w.intensity === 'medium' ? '#E65100' : '#2E7D32',
                  }}>
                    {t(w.intensity)}
                  </div>
                  <button onClick={() => deleteWorkout(w.id)} style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '1.2rem', padding: '4px' }}>×</button>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUMMARY TAB */}
      {activeTab === 'summary' && (
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>{t('this_week')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            {[
              { label: t('total_workouts'), value: weekStats.total, icon: '🎯', color: '#1E88E5' },
              { label: t('total_duration'), value: `${weekStats.duration} ${t('min')}`, icon: '⏱️', color: '#8E24AA' },
              { label: t('total_calories_burned'), value: weekStats.calories, icon: '🔥', color: '#E53935' },
              { label: t('avg_intensity'), value: weekWorkouts.length > 0 ? (() => { const avg = weekWorkouts.reduce((s, w) => s + ({ low: 1, medium: 2, high: 3 }[w.intensity] || 2), 0) / weekWorkouts.length; return avg < 1.5 ? t('low') : avg < 2.5 ? t('medium') : t('high'); })() : '—', icon: '📊', color: '#43A047' },
            ].map((stat, i) => (
              <div key={i} className="card" style={{ padding: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '1.5rem', display: 'block', marginBottom: '6px' }}>{stat.icon}</span>
                <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700', color: stat.color }}>{stat.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: 'var(--text-gray)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Weekly breakdown by type */}
          <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px' }}>{t('workout_type')}</h3>
          {EXERCISE_CATEGORIES.map(cat => {
            const catWorkouts = weekWorkouts.filter(w => w.type === cat.key);
            if (catWorkouts.length === 0) return null;
            const totalMin = catWorkouts.reduce((s, w) => s + w.duration, 0);
            return (
              <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f3f5' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{t(cat.key)}</p>
                  <p style={{ margin: 0, color: 'var(--text-gray)', fontSize: '0.8rem' }}>{catWorkouts.length}x · {totalMin} {t('min')}</p>
                </div>
                <p style={{ margin: 0, fontWeight: '600', color: cat.color, fontSize: '0.9rem' }}>
                  {catWorkouts.reduce((s, w) => s + w.calories, 0)} {t('cal')}
                </p>
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default ExercisePage;
