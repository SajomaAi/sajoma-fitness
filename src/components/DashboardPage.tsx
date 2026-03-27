import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const steps = 6240;
  const calories = 1280;
  const water = 5;

  useEffect(() => {
    const u = localStorage.getItem('sajoma-user');
    if (u) { try { const d = JSON.parse(u); setUserName(d.name || d.email?.split('@')[0] || ''); } catch { setUserName(''); } }
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('good_morning') || 'Good Morning';
    if (h < 17) return t('good_afternoon') || 'Good Afternoon';
    return t('good_evening') || 'Good Evening';
  };

  const stepsGoal = 10000;
  const stepsPct = Math.min((steps / stepsGoal) * 100, 100);
  const r = 52; const circ = 2 * Math.PI * r; const dash = (stepsPct / 100) * circ;

  return (
    <div className="page animate-in">
      {/* Logo & Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/sajoma-logo.jpg" alt="Sajoma" style={{ width: 44, height: 44, borderRadius: 14, boxShadow: '0 2px 8px rgba(212,160,23,0.2)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#D4A017' }}>Sajoma Fitness</span>
        </div>
        <button onClick={() => navigate('/reminders')} style={{ background: 'white', border: 'none', width: 40, height: 40, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(62,39,35,0.06)', cursor: 'pointer' }}>🔔</button>
      </div>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#3E2723', marginBottom: 18 }}>{t('daily_hub') || 'Daily Hub'}</h1>

      {/* Gold Greeting Card with Progress Ring */}
      <div className="card card-gold" style={{ padding: 22, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width="110" height="110" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle cx="60" cy="60" r={r} fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circ} strokeDashoffset={circ - dash} transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>🏃</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{Math.round(stepsPct)}%</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>{greeting()}, {userName || 'Friend'}!</h2>
            <p style={{ fontSize: '0.78rem', opacity: 0.9, marginBottom: 8 }}>{t('todays_goal') || "Today's Goal:"}</p>
            <p style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stepsGoal.toLocaleString()} {t('steps') || 'steps'}</p>
            <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 6, height: 6, marginTop: 8, overflow: 'hidden' }}>
              <div style={{ width: `${stepsPct}%`, height: '100%', background: 'white', borderRadius: 6, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>{steps.toLocaleString()} steps</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>17,200</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards - Horizontal Scroll */}
      <div className="scroll-row" style={{ marginBottom: 22 }}>
        <div className="feature-card" onClick={() => navigate('/exercise')}>
          <div><div className="feature-card-icon">💪</div><h3>Core Power Workout</h3><p>15 min | All levels</p></div>
          <button className="feature-card-btn" onClick={(e) => { e.stopPropagation(); navigate('/exercise'); }}>✏️ Start Workout</button>
        </div>
        <div className="feature-card" style={{ background: 'linear-gradient(145deg, #F8B4C8 0%, #E8A0B8 40%, #D88CA8 100%)' }}>
          <div><div className="feature-card-icon">🧘</div><h3>Zen Mind Meditation</h3><p>10 min | Relaxing</p></div>
          <button className="feature-card-btn">▶ Play</button>
        </div>
        <div className="feature-card" onClick={() => navigate('/water-tracker')}>
          <div><div className="feature-card-icon">💧</div><h3>{t('hydration_tracker') || 'Hydration Tracker'}</h3><p>{water}/8 glasses</p></div>
          <button className="feature-card-btn" onClick={(e) => { e.stopPropagation(); navigate('/water-tracker'); }}>+ Log Water</button>
        </div>
        <div className="feature-card" style={{ background: 'linear-gradient(145deg, #A8D8A8 0%, #7CB87C 40%, #5C985C 100%)' }} onClick={() => navigate('/meal-logger')}>
          <div><div className="feature-card-icon">🥗</div><h3>{t('meal_logger') || 'Meal Logger'}</h3><p>{calories} / 2000 cal</p></div>
          <button className="feature-card-btn" onClick={(e) => { e.stopPropagation(); navigate('/meal-logger'); }}>+ Log Meal</button>
        </div>
        <div className="feature-card" style={{ background: 'linear-gradient(145deg, #B8A0D8 0%, #9C84C0 40%, #8070A8 100%)' }} onClick={() => navigate('/journal')}>
          <div><div className="feature-card-icon">📝</div><h3>{t('daily_journal') || 'Daily Journal'}</h3><p>Mood & Gratitude</p></div>
          <button className="feature-card-btn" onClick={(e) => { e.stopPropagation(); navigate('/journal'); }}>✏️ Write</button>
        </div>
      </div>

      {/* Quick Stats */}
      <h2 className="section-title">{t('todays_stats') || "Today's Stats"}</h2>
      <div className="stat-grid" style={{ marginBottom: 22 }}>
        <div className="stat-card" onClick={() => navigate('/meal-logger')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'rgba(212,160,23,0.1)' }}>🔥</div>
          <div className="stat-value">{calories}</div>
          <div className="stat-label">{t('calories') || 'Calories'}</div>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min((calories / 2000) * 100, 100)}%` }} /></div>
        </div>
        <div className="stat-card" onClick={() => navigate('/water-tracker')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'rgba(100,180,255,0.1)' }}>💧</div>
          <div className="stat-value">{water}/8</div>
          <div className="stat-label">{t('water') || 'Water'}</div>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${(water / 8) * 100}%` }} /></div>
        </div>
        <div className="stat-card" onClick={() => navigate('/exercise')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'rgba(248,180,200,0.2)' }}>🏃</div>
          <div className="stat-value">{steps.toLocaleString()}</div>
          <div className="stat-label">{t('steps') || 'Steps'}</div>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${stepsPct}%` }} /></div>
        </div>
        <div className="stat-card" onClick={() => navigate('/health-tracker')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon" style={{ background: 'rgba(255,100,100,0.1)' }}>❤️</div>
          <div className="stat-value">72</div>
          <div className="stat-label">{t('heart_rate') || 'Heart Rate'}</div>
          <div className="stat-bar"><div className="stat-bar-fill" style={{ width: '72%' }} /></div>
        </div>
      </div>

      {/* Community Feed Sneak-Peek */}
      <h2 className="section-title">{t('community_feed') || 'Community Feed Sneak-Peek'}</h2>
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 18, marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: '1.6rem', color: '#D4A017', opacity: 0.7 }}>🏃‍♀️ 🧘‍♂️ 💃 🏋️ 🤸</div>
        <button className="btn btn-gold btn-sm" onClick={() => navigate('/health-tracker')}>{t('view_full_feed') || 'View Full Feed'}</button>
      </div>

      {/* Explore More */}
      <h2 className="section-title">{t('explore') || 'Explore'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {[
          { to: '/journal', icon: '📓', label: t('journal') || 'Journal', desc: 'Daily wellness' },
          { to: '/progress-photos', icon: '📸', label: t('progress_photos') || 'Photos', desc: 'Track progress' },
          { to: '/reminders', icon: '🔔', label: t('reminders') || 'Reminders', desc: 'Stay on track' },
          { to: '/subscription', icon: '⭐', label: t('premium') || 'Premium', desc: 'Unlock all' },
        ].map(f => (
          <Link key={f.to} to={f.to} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="card" style={{ padding: 16, marginBottom: 0 }}>
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', margin: '8px 0 2px', color: '#3E2723' }}>{f.label}</p>
              <p style={{ fontSize: '0.75rem', color: '#8D6E63', margin: 0 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
