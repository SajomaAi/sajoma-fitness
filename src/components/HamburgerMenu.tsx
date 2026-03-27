import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { assetUrl } from '../lib/basePath';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language, changeLanguage } = useTranslation();

  const menuItems = [
    { path: '/dashboard', icon: '🏠', label: t('dashboard') || 'Dashboard' },
    { path: '/meal-logger', icon: '🥗', label: t('meal_logger') || 'Meals' },
    { path: '/exercise', icon: '🏋️‍♀️', label: t('exercise') || 'Exercise' },
    { path: '/meditation', icon: '🧘‍♀️', label: t('meditation') || 'Meditation' },
    { path: '/journal', icon: '📓', label: t('journal') || 'Journal' },
    { path: '/water-tracker', icon: '💧', label: t('water_tracker') || 'Water Tracker' },
    { path: '/progress-photos', icon: '📸', label: t('progress_photos') || 'Progress Photos' },
    { path: '/health-tracker', icon: '📊', label: t('health_tracker') || 'Analytics' },
    { path: '/reminders', icon: '⏰', label: t('reminders') || 'Reminders' },
    { path: '/settings', icon: '⚙️', label: t('settings') || 'Settings' },
    { path: '/subscription', icon: '💎', label: t('subscription') || 'Subscription' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <div 
        className={`menu-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden',
          transition: 'all 0.3s ease'
        }}
      />
      <div 
        className={`menu-content ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed', top: 0, right: 0, width: '280px', height: '100%',
          background: 'var(--bg-light-grey)', zIndex: 1001, padding: '24px',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-out',
          boxShadow: '-5px 0 20px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20, position: 'relative' }}>
          <button
            onClick={onClose}
            style={{ position: 'absolute', top: 0, right: 0, background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text)' }}
          >
            ×
          </button>
          <img
            src={assetUrl('/sajoma-logo.png')}
            alt="Sajoma"
            style={{ width: 120, height: 120, filter: 'drop-shadow(0 4px 14px rgba(212,175,55,0.4))', marginBottom: 8 }}
          />
          <span style={{ fontWeight: 800, color: 'var(--gold-metallic)', fontSize: '1.2rem' }}>Sajoma Fitness</span>
        </div>

        {/* Language Toggle */}
        <div style={{ background: 'white', borderRadius: 16, padding: '14px 16px', marginBottom: 20, boxShadow: 'var(--shadow-sm)', border: '1.5px solid rgba(0,0,0,0.08)' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px 0' }}>
            🌐 {t('language') || 'Language'}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => changeLanguage('en')}
              style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: language === 'en' ? 'var(--gold-gradient)' : 'var(--bg-light)', color: language === 'en' ? 'white' : 'var(--text)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: language === 'en' ? 'var(--shadow-gold)' : 'none' }}
            >
              🇺🇸 English
            </button>
            <button
              onClick={() => changeLanguage('es')}
              style={{ flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', background: language === 'es' ? 'var(--gold-gradient)' : 'var(--bg-light)', color: language === 'es' ? 'white' : 'var(--text)', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: language === 'es' ? 'var(--shadow-gold)' : 'none' }}
            >
              🇲🇽 Español
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {menuItems.map(item => (
            <div 
              key={item.path} 
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => handleNav(item.path)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, padding: '14px 16px',
                borderRadius: 12, marginBottom: 8, cursor: 'pointer',
                background: location.pathname === item.path ? 'var(--gold-gradient)' : 'transparent',
                color: location.pathname === item.path ? 'white' : 'var(--text)',
                fontWeight: location.pathname === item.path ? 700 : 500,
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <button 
            onClick={() => { onLogout(); onClose(); navigate('/login'); }}
            style={{ 
              width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid var(--gold-metallic)',
              background: 'none', color: 'var(--gold-metallic)', fontWeight: 700, cursor: 'pointer',
              fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
            }}
          >
            <span>🚪</span> {t('logout') || 'Logout'}
          </button>
        </div>
      </div>
    </>
  );
};

export default HamburgerMenu;
