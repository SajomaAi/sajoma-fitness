interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

const WaterTrackerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [glasses, setGlasses] = useState(5);
  const goal = 8;
  const pct = Math.min((glasses / goal) * 100, 100);

  const addWater = (amount: number) => setGlasses(prev => Math.max(0, prev + amount));

  return (
    <div className="page animate-in">
      <PageHeader title={t('water_tracker') || 'Water Tracker'} onOpenMenu={onOpenMenu} />

      {/* Main Progress */}
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
            <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{t('of_goal') || 'of'} {goal} {t('glasses') || 'glasses'}</span>
          </div>
        </div>
        <p style={{ fontSize: '1rem', fontWeight: 800 }}>
          {pct >= 100 ? '🎉 ' + (t('goal_reached') || 'Goal reached!') : `${Math.round(pct)}% ` + (t('of_daily_goal') || 'of daily goal')}
        </p>
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { amount: 1, icon: '🥤', label: t('one_glass') || '1 Glass' },
          { amount: 2, icon: '💧', label: t('two_glasses') || '2 Glasses' },
          { amount: -1, icon: '↩️', label: t('undo') || 'Undo' },
          { amount: 0, icon: '🔄', label: t('reset') || 'Reset' },
        ].map(btn => (
          <button key={btn.label} className="card" onClick={() => btn.amount === 0 ? setGlasses(0) : addWater(btn.amount)} style={{ padding: 14, textAlign: 'center', cursor: 'pointer', border: 'none' }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{btn.icon}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#5D4037' }}>{btn.label}</div>
          </button>
        ))}
      </div>

      {/* Visual Glasses */}
      <div className="card" style={{ padding: 18, marginBottom: 20 }}>
        <h3 className="section-title">{t('todays_intake') || "Today's Intake"}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
          {Array.from({ length: Math.max(goal, glasses) }).map((_, i) => (
            <div key={i} style={{
              width: 40, height: 50, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < glasses ? 'rgba(212,160,23,0.15)' : 'rgba(188,170,164,0.08)',
              border: i < glasses ? '2px solid rgba(212,160,23,0.3)' : '2px solid rgba(188,170,164,0.15)',
              fontSize: '1.2rem', transition: 'all 0.3s ease',
            }}>
              {i < glasses ? '💧' : '○'}
            </div>
          ))}
        </div>
      </div>

      {/* Tip */}
      <div className="card card-pink" style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3E2723' }}>{t('hydration_tip') || 'Hydration Tip'}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#5D4037', lineHeight: 1.5, margin: 0 }}>
          {t('hydration_tip_text') || 'Drinking water before meals can help with portion control and improve digestion.'}
        </p>
      </div>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); navigate('/login'); }} />
      <BottomNav />
    </div>
  );
};

export default WaterTrackerPage;
