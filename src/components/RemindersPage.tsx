interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import {
  requestNotificationPermission,
  scheduleReminder,
  cancelReminder,
  seedDefaultReminders,
  type ReminderKind,
  type ReminderRow,
} from '../lib/reminders';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

const ROWS: Array<{ kind: ReminderKind; icon: string; labelKey: string; descKey: string; defaultLabel: string; defaultDesc: string }> = [
  { kind: 'meal_breakfast',  icon: '🥣', labelKey: 'breakfast', descKey: 'breakfast_desc', defaultLabel: 'Breakfast', defaultDesc: 'Start your day right' },
  { kind: 'meal_lunch',      icon: '🥗', labelKey: 'lunch', descKey: 'lunch_desc', defaultLabel: 'Lunch', defaultDesc: 'Midday nutrition' },
  { kind: 'meal_dinner',     icon: '🍽️', labelKey: 'dinner', descKey: 'dinner_desc', defaultLabel: 'Dinner', defaultDesc: 'Evening meal' },
  { kind: 'water',           icon: '💧', labelKey: 'water', descKey: 'water_desc', defaultLabel: 'Water', defaultDesc: 'Stay hydrated' },
  { kind: 'workout',         icon: '💪', labelKey: 'workout', descKey: 'workout_desc', defaultLabel: 'Workout', defaultDesc: 'Time to move' },
  { kind: 'morning_checkin', icon: '🌅', labelKey: 'morning_checkin', descKey: 'morning_checkin_desc', defaultLabel: 'Morning Check-in', defaultDesc: 'Daily wellness check' },
];

const RemindersPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const [rows, setRows] = useState<ReminderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      const seeded = await seedDefaultReminders(user.id);
      setRows(seeded);
      setLoading(false);
      // Nudge permission once at first render if any are enabled
      if (seeded.some(r => r.enabled)) await requestNotificationPermission();
    })();
  }, [user]);

  const byKind = useMemo(() => {
    const m = new Map<ReminderKind, ReminderRow>();
    for (const r of rows) m.set(r.kind, r);
    return m;
  }, [rows]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const updateRow = async (row: ReminderRow, patch: Partial<ReminderRow>) => {
    const next = { ...row, ...patch };
    setRows(prev => prev.map(r => (r.id === row.id ? next : r)));
    const { error } = await supabase
      .from('reminders')
      .update({
        enabled: next.enabled,
        time_of_day: next.time_of_day,
        days_of_week: next.days_of_week,
        custom_message: next.custom_message,
      })
      .eq('id', row.id);
    if (error) { showToast(error.message); return; }

    if (next.enabled) {
      const granted = await requestNotificationPermission();
      if (!granted) showToast(t('notifications_denied') || 'Notifications denied — enable in Settings to receive alerts');
      await scheduleReminder(next, language === 'es' ? 'es' : 'en');
    } else {
      await cancelReminder(row.id);
    }
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: on ? 'var(--gold-gradient)' : '#CED4DA', position: 'relative', transition: 'background 0.3s ease',
    }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
    </button>
  );

  const Row = ({ def }: { def: typeof ROWS[number] }) => {
    const row = byKind.get(def.kind);
    if (!row) return null;
    const timeValue = (row.time_of_day ?? '08:00').slice(0, 5);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: '1px solid rgba(212,175,55,0.06)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: row.enabled ? 'rgba(212,175,55,0.1)' : 'rgba(173,181,189,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>{def.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#212529' }}>{t(def.labelKey) || def.defaultLabel}</div>
          <div style={{ fontSize: '0.72rem', color: '#6C757D' }}>{t(def.descKey) || def.defaultDesc}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {row.enabled && (
            <input
              type="time"
              value={timeValue}
              onChange={e => updateRow(row, { time_of_day: e.target.value + ':00' })}
              style={{
                border: 'none', background: 'rgba(212,175,55,0.06)', borderRadius: 8, padding: '4px 8px',
                fontSize: '0.78rem', fontWeight: 600, color: '#D4AF37', fontFamily: 'inherit',
              }}
            />
          )}
          <Toggle on={row.enabled} onToggle={() => updateRow(row, { enabled: !row.enabled })} />
        </div>
      </div>
    );
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('reminders') || 'Reminders'} onOpenMenu={onOpenMenu} />

      <div className="card card-gold" style={{ padding: 18, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: '1.3rem', marginBottom: 6 }}>🔔</p>
        <p style={{ fontSize: '0.88rem', fontWeight: 700 }}>{t('stay_on_track') || 'Stay on Track'}</p>
        <p style={{ fontSize: '0.78rem', opacity: 0.85 }}>{t('set_reminders_desc') || 'Set reminders to build healthy habits'}</p>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
      ) : (
        <>
          <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
            <h3 className="section-title" style={{ paddingTop: 12 }}>{t('meal_reminders') || 'Meal Reminders'}</h3>
            <Row def={ROWS[0]} />
            <Row def={ROWS[1]} />
            <Row def={ROWS[2]} />
          </div>

          <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
            <h3 className="section-title" style={{ paddingTop: 12 }}>{t('wellness') || 'Wellness'}</h3>
            <Row def={ROWS[3]} />
            <Row def={ROWS[4]} />
            <Row def={ROWS[5]} />
          </div>
        </>
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

export default RemindersPage;
