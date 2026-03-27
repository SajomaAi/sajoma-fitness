import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { isNativePlatform } from '../lib/capacitor';
import BottomNav from './BottomNav';

interface ReminderConfig {
  id: string;
  label: string;
  icon: string;
  enabled: boolean;
  time: string;
  description: string;
}

const RemindersPage: React.FC = () => {
  const { t } = useTranslation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [smartReminders, setSmartReminders] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const defaultReminders: ReminderConfig[] = [
    { id: 'breakfast', label: t('breakfast_reminder'), icon: '🍳', enabled: true, time: '07:30', description: 'Time for a healthy breakfast!' },
    { id: 'lunch', label: t('lunch_reminder'), icon: '🥗', enabled: true, time: '12:00', description: 'Lunch time! Log your meal.' },
    { id: 'dinner', label: t('dinner_reminder'), icon: '🍽️', enabled: true, time: '18:30', description: 'Dinner reminder. Eat mindfully!' },
    { id: 'snack', label: t('snack_reminder'), icon: '🍎', enabled: false, time: '15:00', description: 'Healthy snack time!' },
    { id: 'water', label: t('water_reminder'), icon: '💧', enabled: true, time: '09:00', description: t('every_2_hours') },
    { id: 'workout', label: t('workout_reminder'), icon: '💪', enabled: true, time: '17:00', description: 'Time to move your body!' },
    { id: 'morning_checkin', label: t('morning_wellness_checkin'), icon: '🌅', enabled: true, time: '08:00', description: 'Start your day with a wellness check-in' },
  ];

  const [reminders, setReminders] = useState<ReminderConfig[]>(defaultReminders);

  useEffect(() => {
    const saved = localStorage.getItem('sajoma-reminders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setReminders(parsed);
      } catch { /* use defaults */ }
    }
    const smart = localStorage.getItem('sajoma-smart-reminders');
    if (smart !== null) setSmartReminders(smart === 'true');

    // Check notification permission
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  const requestPermission = async () => {
    if (isNativePlatform()) {
      // On native, Capacitor handles this
      setPermissionGranted(true);
      return;
    }
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermissionGranted(result === 'granted');
    }
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const updateTime = (id: string, time: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, time } : r));
  };

  const saveSettings = () => {
    localStorage.setItem('sajoma-reminders', JSON.stringify(reminders));
    localStorage.setItem('sajoma-smart-reminders', String(smartReminders));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: checked ? 'var(--primary-color)' : '#ccc',
        borderRadius: '28px', transition: '0.3s',
      }}>
        <span style={{
          position: 'absolute', height: '22px', width: '22px', left: '3px', bottom: '3px',
          backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
          transform: checked ? 'translateX(24px)' : 'translateX(0)',
        }} />
      </span>
    </label>
  );

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px', textAlign: 'center' }}>{t('reminders')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginBottom: '24px', fontSize: '0.9rem' }}>
        {t('stay_updated_with_notifications')}
      </p>

      {/* Success Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: '#4CAF50', color: 'white', padding: '12px 24px',
          borderRadius: '12px', zIndex: 1000, fontWeight: '600', fontSize: '0.9rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          ✓ {t('settings_saved')}
        </div>
      )}

      {/* Permission Banner */}
      {!permissionGranted && (
        <div className="card" style={{
          padding: '16px', marginBottom: '20px',
          background: 'linear-gradient(135deg, #FFF3E0 0%, #fff8f0 100%)',
          border: '1px solid #FFE0B2',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🔔</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{t('push_notifications')}</p>
              <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-gray)' }}>
                Enable notifications to receive reminders
              </p>
            </div>
            <button
              onClick={requestPermission}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: 'none',
                backgroundColor: '#FF9800', color: 'white', fontSize: '0.8rem',
                fontWeight: '600', cursor: 'pointer',
              }}
            >
              Enable
            </button>
          </div>
        </div>
      )}

      {/* Meal Reminders */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🍽️ {t('meal_reminders')}
        </h2>
        {reminders.filter(r => ['breakfast', 'lunch', 'dinner', 'snack'].includes(r.id)).map(reminder => (
          <div key={reminder.id} className="card" style={{
            padding: '14px 16px', marginBottom: '8px',
            opacity: reminder.enabled ? 1 : 0.6, transition: 'opacity 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.3rem' }}>{reminder.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{reminder.label}</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>{reminder.description}</p>
              </div>
              <input
                type="time"
                value={reminder.time}
                onChange={e => updateTime(reminder.id, e.target.value)}
                style={{
                  padding: '6px 8px', borderRadius: '8px', border: '1px solid #dee2e6',
                  fontSize: '0.85rem', width: '100px', marginRight: '8px',
                }}
              />
              <ToggleSwitch checked={reminder.enabled} onChange={() => toggleReminder(reminder.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Water & Workout Reminders */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          💧 {t('water_reminders')} & {t('workout_reminder')}
        </h2>
        {reminders.filter(r => ['water', 'workout'].includes(r.id)).map(reminder => (
          <div key={reminder.id} className="card" style={{
            padding: '14px 16px', marginBottom: '8px',
            opacity: reminder.enabled ? 1 : 0.6, transition: 'opacity 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.3rem' }}>{reminder.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{reminder.label}</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>{reminder.description}</p>
              </div>
              <input
                type="time"
                value={reminder.time}
                onChange={e => updateTime(reminder.id, e.target.value)}
                style={{
                  padding: '6px 8px', borderRadius: '8px', border: '1px solid #dee2e6',
                  fontSize: '0.85rem', width: '100px', marginRight: '8px',
                }}
              />
              <ToggleSwitch checked={reminder.enabled} onChange={() => toggleReminder(reminder.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Morning Check-in */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🌅 {t('morning_checkin')}
        </h2>
        {reminders.filter(r => r.id === 'morning_checkin').map(reminder => (
          <div key={reminder.id} className="card" style={{
            padding: '14px 16px', marginBottom: '8px',
            background: 'linear-gradient(135deg, #E8F5E8 0%, #f0f7f0 100%)',
            border: '1px solid #c8e6c9',
            opacity: reminder.enabled ? 1 : 0.6,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.3rem' }}>{reminder.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{reminder.label}</p>
                <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>{reminder.description}</p>
              </div>
              <input
                type="time"
                value={reminder.time}
                onChange={e => updateTime(reminder.id, e.target.value)}
                style={{
                  padding: '6px 8px', borderRadius: '8px', border: '1px solid #dee2e6',
                  fontSize: '0.85rem', width: '100px', marginRight: '8px',
                }}
              />
              <ToggleSwitch checked={reminder.enabled} onChange={() => toggleReminder(reminder.id)} />
            </div>
          </div>
        ))}
      </div>

      {/* Smart Reminders */}
      <div style={{ marginBottom: '24px' }}>
        <div className="card" style={{
          padding: '16px',
          background: 'linear-gradient(135deg, #EDE7F6 0%, #f5f0ff 100%)',
          border: '1px solid #D1C4E9',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🧠</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '700', fontSize: '0.95rem' }}>{t('smart_reminders')}</p>
              <p style={{ margin: '4px 0 0', color: 'var(--text-gray)', fontSize: '0.8rem' }}>
                {t('smart_reminders_desc')}
              </p>
            </div>
            <ToggleSwitch checked={smartReminders} onChange={() => setSmartReminders(!smartReminders)} />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button className="btn btn-full" onClick={saveSettings} style={{ fontSize: '1rem', padding: '14px', borderRadius: '12px', marginBottom: '20px' }}>
        {t('save_settings')}
      </button>

      <BottomNav />
    </div>
  );
};

export default RemindersPage;
