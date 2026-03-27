import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
          background: 'var(--bg-pink)', zIndex: 1001, padding: '24px',
          display: 'flex', flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-out',
          boxShadow: '-5px 0 20px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src="/sajoma-icon.png" alt="Sajoma" style={{ width: 36, height: 36, borderRadius: 10 }} />
            <span style={{ fontWeight: 800, color: 'var(--primary-gold)', fontSize: '1.1rem' }}>Sajoma Fitness</span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-dark)' }}
          >
            ×
          </button>
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
                color: location.pathname === item.path ? 'white' : 'var(--text-dark)',
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
              width: '100%', padding: '14px', borderRadius: 12, border: '1.5px solid var(--primary-gold)',
              background: 'none', color: 'var(--primary-gold)', fontWeight: 700, cursor: 'pointer',
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
