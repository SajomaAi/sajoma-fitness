import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const RemindersPage: React.FC = () => {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState({
    breakfast: { enabled: true, time: '08:00' },
    lunch: { enabled: true, time: '13:00' },
    dinner: { enabled: true, time: '19:00' },
    water: { enabled: true, interval: '2' },
    workout: { enabled: false, time: '17:30' },
    wellness: { enabled: true, time: '09:00' },
  });

  const toggle = (key: keyof typeof reminders) => {
    setReminders({ ...reminders, [key]: { ...reminders[key], enabled: !reminders[key].enabled } });
  };

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>🔔 {t('reminders') || 'Reminders'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>{t('reminders_subtitle') || 'Stay on track with your wellness goals'}</p>

      <div className="sf-card sf-card-pink" style={{ padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', margin: 0 }}>{t('smart_reminders') || 'Smart Reminders'}</h3>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#5D4037', lineHeight: 1.6, marginBottom: 16 }}>
          {t('smart_reminders_desc') || 'Our AI learns your habits and sends reminders when you are most likely to forget.'}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('enable_smart_reminders') || 'Enable Smart Reminders'}</span>
          <label className="sf-toggle">
            <input type="checkbox" defaultChecked />
            <span className="sf-toggle-track"></span>
            <span className="sf-toggle-thumb"></span>
          </label>
        </div>
      </div>

      <h2 className="section-title">{t('meal_reminders') || 'Meal Reminders'}</h2>
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        {['breakfast', 'lunch', 'dinner'].map((meal, i) => (
          <div key={meal} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px',
            borderBottom: i === 2 ? 'none' : '1px solid rgba(197,150,27,0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: '1.2rem' }}>{meal === 'breakfast' ? '🥣' : meal === 'lunch' ? '🥗' : '🍽️'}</span>
              <div>
                <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0, textTransform: 'capitalize' }}>{t(meal) || meal}</p>
                <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{(reminders[meal as keyof typeof reminders] as any).time}</p>
              </div>
            </div>
            <label className="sf-toggle">
              <input type="checkbox" checked={reminders[meal as keyof typeof reminders].enabled} onChange={() => toggle(meal as keyof typeof reminders)} />
              <span className="sf-toggle-track"></span>
              <span className="sf-toggle-thumb"></span>
            </label>
          </div>
        ))}
      </div>

      <h2 className="section-title">{t('other_reminders') || 'Other Reminders'}</h2>
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(197,150,27,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.2rem' }}>💧</span>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>{t('water_reminder') || 'Water Intake'}</p>
              <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>Every {reminders.water.interval} hours</p>
            </div>
          </div>
          <label className="sf-toggle">
            <input type="checkbox" checked={reminders.water.enabled} onChange={() => toggle('water')} />
            <span className="sf-toggle-track"></span>
            <span className="sf-toggle-thumb"></span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(197,150,27,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.2rem' }}>💪</span>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>{t('workout_reminder') || 'Workout'}</p>
              <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{reminders.workout.time}</p>
            </div>
          </div>
          <label className="sf-toggle">
            <input type="checkbox" checked={reminders.workout.enabled} onChange={() => toggle('workout')} />
            <span className="sf-toggle-track"></span>
            <span className="sf-toggle-thumb"></span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.2rem' }}>✨</span>
            <div>
              <p style={{ fontSize: '0.92rem', fontWeight: 600, margin: 0 }}>{t('wellness_checkin') || 'Wellness Check-in'}</p>
              <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{reminders.wellness.time}</p>
            </div>
          </div>
          <label className="sf-toggle">
            <input type="checkbox" checked={reminders.wellness.enabled} onChange={() => toggle('wellness')} />
            <span className="sf-toggle-track"></span>
            <span className="sf-toggle-thumb"></span>
          </label>
        </div>
      </div>

      <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg">
        {t('save_reminder_settings') || 'Save Settings'}
      </button>

      <BottomNav />
    </div>
  );
};

export default RemindersPage;
