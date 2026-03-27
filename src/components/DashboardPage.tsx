interface PageProps {
  onOpenMenu: () => void;
}
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

const DashboardPage: React.FC<PageProps> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Sarah');
  const [greeting, setGreeting] = useState('Good Morning');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('good_morning') || 'Good Morning');
    else if (hour < 18) setGreeting(t('good_afternoon') || 'Good Afternoon');
    else setGreeting(t('good_evening') || 'Good Evening');

    const storedUser = localStorage.getItem('sajoma-user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.name) setUserName(user.name);
      } catch (e) { console.error(e); }
    }
  }, [t]);

  const handleLogout = () => {
    localStorage.removeItem('sajoma-loggedIn');
    navigate('/login');
  };

  const features = [
    { id: 'workout', title: t('core_power_workout') || 'Core Power Workout', desc: '15 min • ' + (t('all_levels') || 'All Levels'), icon: '🔥', btn: t('start_workout') || 'Start Workout', path: '/exercise' },
    { id: 'meditation', title: t('zen_mind_meditation') || 'Zen Mind Meditation', desc: '10 min • ' + (t('relaxing') || 'Relaxing'), icon: '🧘', btn: t('play') || 'Play', path: '/meditation' },
    { id: 'water', title: t('hydration_tracker') || 'Hydration Tracker', desc: '4/8 glasses', icon: '💧', btn: t('add_food') || 'Add', path: '/water-tracker' },
  ];

  const stats = [
    { label: t('burned') || 'Burned', value: '450', unit: 'kcal', icon: '🔥', color: '#F0F1F3' },
    { label: t('consumed') || 'Consumed', value: '1,240', unit: 'kcal', icon: '🍎', color: '#E3F2FD' },
    { label: t('steps') || 'Steps', value: '8,420', unit: 'Steps', icon: '👟', color: '#F1F8E9' },
    { label: t('heart_rate') || 'Heart Rate', value: '72', unit: 'bpm', icon: '❤️', color: '#F0F1F3' },
  ];

  return (
    <div className="page animate-in">
      <PageHeader onOpenMenu={onOpenMenu} />
      
      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 20, color: 'var(--text)' }}>{t('daily_hub') || 'Daily Hub'}</h2>

      {/* Greeting Card with Progress Ring */}
      <div className="card card-gold" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '24px 20px', marginBottom: 24 }}>
        <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
            <circle cx="40" cy="40" r="34" fill="none" stroke="white" strokeWidth="6" strokeDasharray="213.6" strokeDashoffset="64" strokeLinecap="round" transform="rotate(-90 40 40)" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>🏃</div>
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>{greeting}, {userName}!</h3>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, marginBottom: 8 }}>{t('todays_goal') || "Today's Goal"}:</p>
          <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>10,000 {t('steps') || 'steps'}</div>
          <div style={{ fontSize: '0.65rem', opacity: 0.8, marginTop: 2 }}>10,000 / 17,200</div>
        </div>
      </div>

      {/* Feature Cards (Horizontal Scroll) */}
      <div className="scroll-row" style={{ marginBottom: 24 }}>
        {features.map(f => (
          <div key={f.id} className="feature-card" onClick={() => navigate(f.path)} style={{ cursor: 'pointer' }}>
            <div className="feature-card-icon">{f.icon}</div>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <button className="feature-card-btn">{f.btn}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Grid */}
      <h3 className="section-title">{t('statistics') || 'Statistics'}</h3>
      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card" onClick={() => navigate('/analytics')}>
            <div className="stat-icon" style={{ background: s.color }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Community Feed Sneak-Peek */}
      <h3 className="section-title">{t('community_feed') || 'Community Feed'}</h3>
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>👤</div>
          ))}
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--gold-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, border: '2px solid white', boxShadow: 'var(--shadow-sm)' }}>+12</div>
        </div>
        <button className="btn btn-gold btn-full" onClick={() => navigate('/premium')}>{t('view_full_feed') || 'View Full Feed'}</button>
      </div>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />
      <BottomNav />
    </div>
  );
};

export default DashboardPage;
