import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const WaterTrackerPage: React.FC = () => {
  const { t } = useTranslation();
  const [glasses, setGlasses] = useState(() => {
    const s = localStorage.getItem('sajoma-water');
    return s ? parseInt(s) : 0;
  });
  const goal = 8;

  const addGlass = () => {
    const newVal = glasses + 1;
    setGlasses(newVal);
    localStorage.setItem('sajoma-water', newVal.toString());
  };

  const reset = () => {
    setGlasses(0);
    localStorage.setItem('sajoma-water', '0');
  };

  const pct = Math.min((glasses / goal) * 100, 100);

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>💧 {t('water_tracking') || 'Hydration'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>{t('water_subtitle') || 'Track your daily water intake'}</p>

      <div className="sf-card" style={{ padding: 32, textAlign: 'center', marginBottom: 24, position: 'relative' }}>
        <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 24px' }}>
          <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="70" stroke="#FFF0F5" strokeWidth="12" fill="none" />
            <circle cx="80" cy="80" r="70" stroke="#C5961B" strokeWidth="12" fill="none"
              strokeDasharray={`${(pct / 100) * 440} 440`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.8s ease' }} />
          </svg>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#3E2723' }}>{glasses}</span>
            <span style={{ fontSize: '0.8rem', color: '#8D6E63', fontWeight: 600 }}>/ {goal} {t('glasses') || 'glasses'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="sf-btn sf-btn-gold sf-btn-lg" onClick={addGlass} style={{ width: 140 }}>
            + {t('add_glass') || 'Add Glass'}
          </button>
          <button className="sf-btn sf-btn-outline sf-btn-lg" onClick={reset} style={{ width: 100 }}>
            {t('reset') || 'Reset'}
          </button>
        </div>
      </div>

      <div className="sf-card sf-card-pink" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 10 }}>{t('hydration_tip') || 'Hydration Tip'}</h3>
        <p style={{ fontSize: '0.88rem', color: '#5D4037', lineHeight: 1.6, margin: 0 }}>
          {t('water_tip_msg') || 'Drinking water before meals can help with digestion and portion control. Aim for at least 8 glasses a day.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="sf-card" style={{
            padding: '12px 0', textAlign: 'center',
            background: i < glasses ? 'linear-gradient(135deg, #F8B4C8, #D4A017)' : 'white',
            borderColor: i < glasses ? 'transparent' : 'rgba(197,150,27,0.1)',
          }}>
            <span style={{ fontSize: '1.2rem', opacity: i < glasses ? 1 : 0.3 }}>💧</span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default WaterTrackerPage;
