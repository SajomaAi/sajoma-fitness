interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';


const RemindersPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reminders, setReminders] = useState({
    breakfast: { on: true, time: '08:00' },
    lunch: { on: true, time: '12:30' },
    dinner: { on: true, time: '18:30' },
    water: { on: true, time: '10:00' },
    workout: { on: false, time: '07:00' },
    morning: { on: true, time: '07:30' },
    smart: { on: false, time: '' },
  });

  const toggle = (key: string) => {
    setReminders(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], on: !prev[key as keyof typeof prev].on } }));
  };

  const updateTime = (key: string, time: string) => {
    setReminders(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof prev], time } }));
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: on ? 'var(--gold-gradient)' : '#E0D6D0', position: 'relative', transition: 'background 0.3s ease',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
    </button>
  );

  const ReminderRow = ({ icon, label, desc, rKey }: { icon: string; label: string; desc: string; rKey: string }) => {
    const r = reminders[rKey as keyof typeof reminders];
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid rgba(212,160,23,0.06)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: r.on ? 'rgba(212,160,23,0.1)' : 'rgba(188,170,164,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#3E2723' }}>{label}</div>
          <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>{desc}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {r.on && r.time && (
            <input type="time" value={r.time} onChange={e => updateTime(rKey, e.target.value)} style={{
              border: 'none', background: 'rgba(212,160,23,0.06)', borderRadius: 8, padding: '4px 8px',
              fontSize: '0.78rem', fontWeight: 600, color: '#D4A017', fontFamily: 'inherit',
            }} />
          )}
          <Toggle on={r.on} onToggle={() => toggle(rKey)} />
        </div>
      </div>
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('sajoma-loggedIn');
    navigate('/login');
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('reminders') || 'Reminders'} onOpenMenu={onOpenMenu} />

      {/* Info Card */}
      <div className="card card-gold" style={{ padding: 18, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: '1.3rem', marginBottom: 6 }}>🔔</p>
        <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{t('stay_on_track') || 'Stay on Track'}</p>
        <p style={{ fontSize: '0.78rem', opacity: 0.85 }}>{t('set_reminders_desc') || 'Set reminders to build healthy habits'}</p>
      </div>

      {/* Meal Reminders */}
      <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
        <h3 className="section-title" style={{ paddingTop: 12 }}>{t('meal_reminders') || 'Meal Reminders'}</h3>
        <ReminderRow icon="🥣" label={t('breakfast') || 'Breakfast'} desc={t('breakfast_desc') || 'Start your day right'} rKey="breakfast" />
        <ReminderRow icon="🥗" label={t('lunch') || 'Lunch'} desc={t('lunch_desc') || 'Midday nutrition'} rKey="lunch" />
        <ReminderRow icon="🍽️" label={t('dinner') || 'Dinner'} desc={t('dinner_desc') || 'Evening meal'} rKey="dinner" />
      </div>

      {/* Wellness Reminders */}
      <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
        <h3 className="section-title" style={{ paddingTop: 12 }}>{t('wellness') || 'Wellness'}</h3>
        <ReminderRow icon="💧" label={t('water') || 'Water'} desc={t('water_desc') || 'Stay hydrated'} rKey="water" />
        <ReminderRow icon="💪" label={t('workout') || 'Workout'} desc={t('workout_desc') || 'Time to move'} rKey="workout" />
        <ReminderRow icon="🌅" label={t('morning_checkin') || 'Morning Check-in'} desc={t('morning_checkin_desc') || 'Daily wellness check'} rKey="morning" />
      </div>

      {/* Smart Reminders */}
      <div className="card" style={{ padding: '4px 18px', marginBottom: 20 }}>
        <h3 className="section-title" style={{ paddingTop: 12 }}>{t('smart_reminders') || 'Smart Reminders'}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🧠</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#3E2723' }}>{t('ai_smart_reminders') || 'AI Smart Reminders'}</div>
            <div style={{ fontSize: '0.72rem', color: '#8D6E63' }}>{t('ai_smart_reminders_desc') || 'Learns your habits and reminds you at the best times'}</div>
          </div>
          <Toggle on={reminders.smart.on} onToggle={() => toggle('smart')} />
        </div>
      </div>

      <button className="btn btn-gold btn-full btn-lg" style={{ marginBottom: 40 }}>{t('save_preferences') || 'Save Preferences'}</button>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />
      <BottomNav />
    </div>
  );
};

export default RemindersPage;
