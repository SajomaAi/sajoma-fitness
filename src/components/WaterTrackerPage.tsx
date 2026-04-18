interface PageProps {
  onOpenMenu: () => void;
}
import React, { useEffect, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

const GLASS_ML = 250;

interface WaterLog {
  id: string;
  amount_ml: number;
  logged_at: string;
}

const WaterTrackerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [logs, setLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);

  const goalMl = profile?.daily_water_goal_ml ?? 2000;
  const goalGlasses = Math.round(goalMl / GLASS_ML);
  const totalMl = logs.reduce((s, l) => s + l.amount_ml, 0);
  const glasses = Math.round(totalMl / GLASS_ML);
  const pct = Math.min((totalMl / goalMl) * 100, 100);

  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('water_logs')
        .select('id, amount_ml, logged_at')
        .gte('logged_at', startOfToday())
        .order('logged_at', { ascending: false });
      setLogs((data as WaterLog[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const addGlasses = async (count: number) => {
    if (working || count <= 0) return;
    setWorking(true);
    const inserts = Array.from({ length: count }, () => ({ amount_ml: GLASS_ML }));
    const { data, error } = await supabase.from('water_logs').insert(inserts).select('id, amount_ml, logged_at');
    setWorking(false);
    if (!error && data) setLogs(prev => [...(data as WaterLog[]), ...prev]);
  };

  const undoLast = async () => {
    if (working || logs.length === 0) return;
    setWorking(true);
    const last = logs[0];
    const { error } = await supabase.from('water_logs').delete().eq('id', last.id);
    setWorking(false);
    if (!error) setLogs(logs.slice(1));
  };

  const resetToday = async () => {
    if (working || logs.length === 0) return;
    setWorking(true);
    const ids = logs.map(l => l.id);
    const { error } = await supabase.from('water_logs').delete().in('id', ids);
    setWorking(false);
    if (!error) setLogs([]);
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('water_tracker') || 'Water Tracker'} onOpenMenu={onOpenMenu} />

      <div className="card card-gold" style={{ padding: 30, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
            <circle cx="70" cy="70" r="60" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 377} 377`} transform="rotate(-90 70 70)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '1.5rem' }}>💧</span>
            <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>{glasses}</span>
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('of_goal') || 'of'} {goalGlasses} {t('glasses') || 'glasses'}</span>
          </div>
        </div>
        <p style={{ fontSize: '1rem', fontWeight: 800 }}>
          {pct >= 100 ? '🎉 ' + (t('goal_reached') || 'Goal reached!') : `${Math.round(pct)}% ` + (t('of_daily_goal') || 'of daily goal')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        <button className="card" onClick={() => addGlasses(1)} disabled={working} style={{ padding: 14, textAlign: 'center', cursor: working ? 'wait' : 'pointer', border: 'none' }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>🥤</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#495057' }}>{t('one_glass') || '1 Glass'}</div>
        </button>
        <button className="card" onClick={() => addGlasses(2)} disabled={working} style={{ padding: 14, textAlign: 'center', cursor: working ? 'wait' : 'pointer', border: 'none' }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>💧</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#495057' }}>{t('two_glasses') || '2 Glasses'}</div>
        </button>
        <button className="card" onClick={undoLast} disabled={working || logs.length === 0} style={{ padding: 14, textAlign: 'center', cursor: working ? 'wait' : 'pointer', border: 'none', opacity: logs.length === 0 ? 0.4 : 1 }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>↩️</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#495057' }}>{t('undo') || 'Undo'}</div>
        </button>
        <button className="card" onClick={resetToday} disabled={working || logs.length === 0} style={{ padding: 14, textAlign: 'center', cursor: working ? 'wait' : 'pointer', border: 'none', opacity: logs.length === 0 ? 0.4 : 1 }}>
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>🔄</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#495057' }}>{t('reset') || 'Reset'}</div>
        </button>
      </div>

      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <h3 className="section-title">{t('todays_intake') || "Today's Intake"}</h3>
        {loading ? (
          <div style={{ padding: 16, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
            {Array.from({ length: Math.max(goalGlasses, glasses) }).map((_, i) => (
              <div key={i} style={{
                width: 40, height: 50, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i < glasses ? 'rgba(212,175,55,0.15)' : 'rgba(173,181,189,0.08)',
                border: i < glasses ? '2px solid rgba(212,175,55,0.3)' : '2px solid rgba(173,181,189,0.15)',
                fontSize: '1.2rem', transition: 'all 0.3s ease',
              }}>
                {i < glasses ? '💧' : '○'}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card card-pink" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#212529' }}>{t('hydration_tip') || 'Hydration Tip'}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#495057', lineHeight: 1.5, margin: 0 }}>
          {t('hydration_tip_text') || 'Drinking water before meals can help with portion control and improve digestion.'}
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default WaterTrackerPage;
