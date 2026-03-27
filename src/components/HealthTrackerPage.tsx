import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const HealthTrackerPage: React.FC = () => {
  const { t } = useTranslation();
  const [weight, setWeight] = useState('145');
  const [mood, setMood] = useState(4);
  const [energy, setEnergy] = useState(3);

  const metrics = [
    { label: t('weight') || 'Weight', value: weight + ' lbs', icon: '⚖️', color: '#FFF8E1' },
    { label: t('mood') || 'Mood', value: ['😢','😟','😐','😊','🤩'][mood-1], icon: '🧠', color: '#FFF0F5' },
    { label: t('energy') || 'Energy', value: energy + '/5', icon: '⚡', color: '#E3F2FD' },
    { label: t('sleep') || 'Sleep', value: '7.5 hrs', icon: '😴', color: '#F3E5F5' },
  ];

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>📊 {t('health_tracker') || 'Health'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>{t('health_subtitle') || 'Monitor your vital metrics'}</p>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: m.color }}>{m.icon}</div>
            <div className="stat-value">{m.value}</div>
            <div className="stat-label">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="sf-card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 className="section-title">{t('log_today_metrics') || 'Log Today\'s Metrics'}</h3>
        
        <div style={{ marginBottom: 16 }}>
          <label className="sf-label">{t('current_weight') || 'Current Weight (lbs)'}</label>
          <input className="sf-input" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label className="sf-label">{t('how_is_mood') || 'How is your mood?'}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setMood(i)} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: mood === i ? 'linear-gradient(135deg, #D4A017, #C5961B)' : '#FFF0F5',
                fontSize: '1.2rem', transition: 'all 0.2s', transform: mood === i ? 'scale(1.1)' : 'scale(1)',
              }}>{['😢','😟','😐','😊','🤩'][i-1]}</button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label className="sf-label">{t('energy_level') || 'Energy Level'}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} onClick={() => setEnergy(i)} style={{
                flex: 1, padding: '12px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: energy >= i ? 'linear-gradient(135deg, #F8B4C8, #D4A017)' : '#FFF0F5',
                color: energy >= i ? 'white' : '#BCAAA4', fontWeight: 700,
              }}>{i}</button>
            ))}
          </div>
        </div>

        <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg">
          {t('save_metrics') || 'Save Metrics'}
        </button>
      </div>

      <div className="sf-card sf-card-pink" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 10 }}>{t('health_insight') || 'Health Insight'}</h3>
        <p style={{ fontSize: '0.88rem', color: '#5D4037', lineHeight: 1.6, margin: 0 }}>
          {t('health_insight_msg') || 'Your energy levels seem to correlate with your sleep quality. Try to maintain a consistent sleep schedule this week.'}
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default HealthTrackerPage;
