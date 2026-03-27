interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

const HealthTrackerPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      <PageHeader title={t('analytics') || 'Analytics'} onOpenMenu={onOpenMenu} />

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${period === 'week' ? 'active' : ''}`} onClick={() => setPeriod('week')}>{t('this_week') || 'This Week'}</button>
        <button className={`tab ${period === 'month' ? 'active' : ''}`} onClick={() => setPeriod('month')}>{t('this_month') || 'This Month'}</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { icon: '🔥', label: t('avg_calories') || 'Avg Calories', value: `${avgCal}`, unit: 'kcal/day', color: '#FF9800' },
          { icon: '👣', label: t('avg_steps') || 'Avg Steps', value: avgSteps.toLocaleString(), unit: 'steps/day', color: '#42A5F5' },
          { icon: '💧', label: t('total_water') || 'Total Water', value: `${totalWater}`, unit: 'glasses', color: '#29B6F6' },
          { icon: '💪', label: t('workouts') || 'Workouts', value: '4', unit: 'this week', color: '#D4AF37' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: s.color, marginTop: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: '#6C757D', fontWeight: 600 }}>{s.unit}</div>
            <div style={{ fontSize: '0.72rem', color: '#495057', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calorie Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="section-title">{t('calorie_intake') || 'Calorie Intake'}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, marginTop: 12 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.58rem', color: '#6C757D', fontWeight: 600 }}>{d.cal}</span>
              <div style={{
                width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                height: `${(d.cal / maxCal) * 80}px`,
                background: d.cal > 2000 ? 'linear-gradient(to top, #FF9800, #FFB74D)' : 'var(--gold-gradient)',
              }} />
              <span style={{ fontSize: '0.62rem', color: '#6C757D', fontWeight: 600 }}>{d.day}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(212,175,55,0.05)', borderRadius: 10 }}>
          <span style={{ fontSize: '0.75rem', color: '#495057' }}>{t('daily_average') || 'Daily Average'}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>{avgCal} kcal</span>
        </div>
      </div>

      {/* Steps Chart */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 className="section-title">{t('steps') || 'Steps'}</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 12 }}>
          {weekData.map((d, i) => {
            const maxSteps = Math.max(...weekData.map(x => x.steps));
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: 6, transition: 'height 0.4s ease',
                  height: `${(d.steps / maxSteps) * 70}px`,
                  background: d.steps >= 10000 ? 'linear-gradient(to top, #66BB6A, #A5D6A7)' : 'linear-gradient(to top, #D4AF37, #E9ECEF)',
                }} />
                <span style={{ fontSize: '0.58rem', color: '#6C757D' }}>{d.day}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, padding: '8px 12px', background: 'rgba(212,175,55,0.1)', borderRadius: 10 }}>
          <span style={{ fontSize: '0.75rem', color: '#495057' }}>{t('daily_average') || 'Daily Average'}</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D4AF37' }}>{avgSteps.toLocaleString()} steps</span>
        </div>
      </div>

      {/* Insight */}
      <div className="card card-pink" style={{ padding: 16, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <span style={{ fontSize: '1.1rem' }}>📊</span>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#212529' }}>{t('weekly_insight') || 'Weekly Insight'}</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#495057', lineHeight: 1.5, margin: 0 }}>
          {t('weekly_insight_text') || 'You were most active on Saturday with 11,200 steps! Try to maintain that momentum during weekdays too.'}
        </p>
      </div>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={() => { localStorage.removeItem('sajoma-loggedIn'); navigate('/login'); }} />
      <BottomNav />
    </div>
  );
};

export default HealthTrackerPage;
