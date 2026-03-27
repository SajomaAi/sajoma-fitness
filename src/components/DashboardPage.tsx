import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const userName = localStorage.getItem('userName') || 'Sarah';
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting(t('good_morning') || 'Good morning');
    else if (h < 17) setGreeting(t('good_afternoon') || 'Good afternoon');
    else setGreeting(t('good_evening') || 'Good evening');
  }, [t]);

  const stats = {
    calories: { current: 850, goal: 2000, icon: '🔥', label: t('calories') || 'Calories' },
    water: { current: 4, goal: 8, icon: '💧', label: t('water') || 'Water', unit: 'glasses' },
    steps: { current: 4250, goal: 10000, icon: '👟', label: t('steps') || 'Steps' },
    sleep: { current: 7.5, goal: 8, icon: '😴', label: t('sleep') || 'Sleep', unit: 'hrs' },
  };

  const recentMeals = [
    { type: 'Breakfast', time: '8:30 AM', cal: 420, emoji: '🥣' },
    { type: 'Lunch', time: '12:45 PM', cal: 430, emoji: '🥗' },
  ];

  const quickActions = [
    { to: '/meal-logger', icon: '📷', label: t('log_meal') || 'Log Meal', color: '#FFF0F5' },
    { to: '/water-tracker', icon: '💧', label: t('add_water') || 'Water', color: '#F0F8FF' },
    { to: '/exercise', icon: '💪', label: t('exercise') || 'Exercise', color: '#FFF8E1' },
    { to: '/barcode-scanner', icon: '📱', label: t('scan') || 'Scan', color: '#F3E5F5' },
  ];

  const wellnessTips = [
    "Start your day with 16oz of water to kickstart metabolism.",
    "Include protein in every meal for stable blood sugar.",
    "Take a 10-minute walk after meals for better digestion.",
    "Practice deep breathing for 5 minutes to reduce stress.",
    "Aim for 7-9 hours of quality sleep tonight.",
    "Choose whole foods over processed for lasting energy.",
    "Avoid eating past 8PM to support hormone balance.",
  ];
  const tip = wellnessTips[new Date().getDay()];

  const ProgressRing = ({ value, goal, size = 56, color = '#C5961B' }: { value: number; goal: number; size?: number; color?: string }) => {
    const pct = Math.min((value / goal) * 100, 100);
    const r = (size - 6) / 2;
    const circ = r * 2 * Math.PI;
    const dash = `${(pct / 100) * circ} ${circ}`;
    return (
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#FFD6E0" strokeWidth={5} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={5} fill="none"
          strokeDasharray={dash} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      </svg>
    );
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">{greeting},</h1>
          <h1 className="page-title" style={{ color: '#C5961B' }}>{userName} ✨</h1>
          <p className="page-subtitle" style={{ marginTop: 4 }}>
            {t('maintain_healthy') || 'Maintain a healthy lifestyle'}
          </p>
        </div>
        <Link to="/settings" style={{
          width: 44, height: 44, borderRadius: 14,
          background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(62,39,35,0.06)', border: '1px solid rgba(197,150,27,0.1)',
          textDecoration: 'none', fontSize: '1.2rem',
        }}>🔔</Link>
      </div>

      {/* Main Stats Grid */}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        {Object.entries(stats).map(([key, s]) => {
          const pct = Math.round((s.current / s.goal) * 100);
          return (
            <div key={key} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="stat-icon" style={{
                  background: key === 'calories' ? '#FFF0F5' : key === 'water' ? '#E3F2FD' : key === 'steps' ? '#FFF8E1' : '#F3E5F5',
                }}>{s.icon}</div>
                <ProgressRing value={s.current} goal={s.goal} size={40}
                  color={key === 'calories' ? '#C5961B' : key === 'water' ? '#42A5F5' : key === 'steps' ? '#FF9800' : '#AB47BC'} />
              </div>
              <div className="stat-value">
                {key === 'sleep' ? s.current + 'h' : s.current.toLocaleString()}
              </div>
              <div className="stat-label">{s.label} · {pct}%</div>
              <div className="stat-progress">
                <div className="stat-progress-bar" style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
        {quickActions.map(a => (
          <Link key={a.to} to={a.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sf-card" style={{ padding: '14px 8px', textAlign: 'center' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: a.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px', fontSize: '1.3rem',
              }}>{a.icon}</div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#5D4037' }}>{a.label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Meals */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>{t('recent_meals') || 'Recent Meals'}</h2>
          <Link to="/meal-logger" style={{ fontSize: '0.8rem', color: '#C5961B', fontWeight: 600, textDecoration: 'none' }}>
            {t('see_all') || 'See all'}
          </Link>
        </div>
        {recentMeals.map((meal, i) => (
          <div key={i} className="sf-card" style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', marginBottom: 8,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, background: '#FFF0F5',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
            }}>{meal.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>{meal.type}</p>
              <p style={{ color: '#8D6E63', fontSize: '0.8rem', margin: 0 }}>{meal.time}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: '0.95rem', margin: 0, color: '#C5961B' }}>{meal.cal}</p>
              <p style={{ color: '#BCAAA4', fontSize: '0.7rem', margin: 0 }}>kcal</p>
            </div>
          </div>
        ))}
      </div>

      {/* Wellness Tip */}
      <div className="sf-card sf-card-pink" style={{ padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: '1.3rem' }}>🌟</span>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3E2723', margin: 0 }}>
            {t('wellness_tip_of_the_day') || 'Wellness Tip'}
          </h3>
        </div>
        <p style={{ fontSize: '0.88rem', color: '#5D4037', lineHeight: 1.6, margin: 0 }}>{tip}</p>
      </div>

      {/* More Features */}
      <div style={{ marginBottom: 20 }}>
        <h2 className="section-title">{t('explore') || 'Explore'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            { to: '/journal', icon: '📓', label: t('journal') || 'Journal', desc: t('daily_journal') || 'Daily wellness' },
            { to: '/progress-photos', icon: '📸', label: t('progress_photos') || 'Photos', desc: t('weekly_progress') || 'Track progress' },
            { to: '/reminders', icon: '🔔', label: t('reminders') || 'Reminders', desc: t('notification_settings') || 'Stay on track' },
            { to: '/subscription', icon: '⭐', label: t('premium') || 'Premium', desc: t('upgrade_to_premium') || 'Unlock all' },
          ].map(f => (
            <Link key={f.to} to={f.to} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="sf-card" style={{ padding: 16 }}>
                <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '8px 0 2px', color: '#3E2723' }}>{f.label}</p>
                <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{f.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
