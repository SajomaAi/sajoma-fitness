import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const HealthTrackerPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  const weekData = [
    { day: 'Mon', cal: 1800, steps: 8200, water: 7 },
    { day: 'Tue', cal: 2100, steps: 6500, water: 6 },
    { day: 'Wed', cal: 1950, steps: 9100, water: 8 },
    { day: 'Thu', cal: 1750, steps: 7800, water: 7 },
    { day: 'Fri', cal: 2200, steps: 5400, water: 5 },
    { day: 'Sat', cal: 2400, steps: 11200, water: 8 },
    { day: 'Sun', cal: 1900, steps: 4200, water: 6 },
  ];

  const maxCal = Math.max(...weekData.map(d => d.cal));
  const avgCal = Math.round(weekData.reduce((s, d) => s + d.cal, 0) / 7);
  const avgSteps = Math.round(weekData.reduce((s, d) => s + d.steps, 0) / 7);
  const totalWater = weekData.reduce((s, d) => s + d.water, 0);

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => navigate('/settings')}>&#8249;</button>
        <h1 className="page-header-title">{t('analytics') || 'Analytics'}</h1>
        <div style={{ width: 32 }} />
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>This Week</button>
        <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>This Month</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { icon: '🔥', label: 'Avg Calories', value: `${avgCal}`, unit: 'kcal/day', color: '#FF9800' },
          { icon: '👣', label: 'Avg Steps', value: avgSteps.toLocaleString(), unit: 'steps/day', color: '#42A5F5' },
          { icon: '💧', label: 'Total Water', value: `${totalWater}`, unit: 'glasses', color: '#29B6F6' },
          { icon: '💪', label: 'Workouts', value: '4', unit: 'this week', color: '#D4A017' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#8D6E63', fontWeight: 600 }}>{s.unit}</div>
            <div style={{ fontSize: '0.72rem', color: '#5D4037', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calorie Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="section-title">Calorie Intake</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 12 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.58rem', color: '#8D6E63', fontWeight: 600 }}>{d.cal}</span>
              <div style={{
                width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                height: `${(d.cal / maxCal) * 80}px`,
                background: d.cal > 2000 ? 'linear-gradient(to top, #FF9800, #FFB74D)' : 'var(--gold-gradient)',
              }} />
              <span style={{ fontSize: '0.62rem', color: '#8D6E63', fontWeight: 600 }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(212,160,23,0.05)', borderRadius: 10 }}>
          <span style={{ fontSize: '0.75rem', color: '#5D4037' }}>Daily Average</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A017' }}>{avgCal} kcal</span>
        </div>
      </div>

      {/* Steps Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="section-title">Steps</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 12 }}>
          {weekData.map((d, i) => {
            const maxSteps = Math.max(...weekData.map(x => x.steps));
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                  height: `${(d.steps / maxSteps) * 70}px`,
                  background: d.steps >= 10000 ? 'linear-gradient(to top, #66BB6A, #A5D6A7)' : 'linear-gradient(to top, #F8B4C8, #FFD6E0)',
                }} />
                <span style={{ fontSize: '0.58rem', color: '#8D6E63' }}>{d.day}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(248,180,200,0.1)', borderRadius: 10 }}>
          <span style={{ fontSize: '0.75rem', color: '#5D4037' }}>Daily Average</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4A017' }}>{avgSteps.toLocaleString()} steps</span>
        </div>
      </div>

      {/* Insight */}
      <div className="card card-pink" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>📊</span>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#3E2723' }}>Weekly Insight</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#5D4037', lineHeight: 1.5, margin: 0 }}>
          You were most active on Saturday with 11,200 steps! Try to maintain that momentum during weekdays too.
        </p>
      </div>

      <BottomNav />
    </div>
  );
};

export default HealthTrackerPage;
