import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const tabs = [
    { path: '/dashboard', icon: '🏠', label: t('home') || 'Home' },
    { path: '/exercise', icon: '🏋️', label: t('workouts') || 'Workouts' },
    { path: '/settings', icon: '👤', label: t('profile') || 'Profile' },
    { path: '/health-tracker', icon: '🧭', label: t('discover') || 'Discover' },
  ];

  const handleNav = (path: string) => {
    const isLoggedIn = localStorage.getItem('sajoma-loggedIn') === 'true';
    if (path === '/dashboard') {
      navigate(isLoggedIn ? '/dashboard' : '/');
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="bottom-nav" style={{ zIndex: 1000 }}>
      {tabs.map(tab => {
        const isActive = location.pathname === tab.path ||
          (tab.path === '/dashboard' && location.pathname === '/') ||
          (tab.path === '/exercise' && location.pathname.startsWith('/exercise'));
        return (
          <button key={tab.path} className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => handleNav(tab.path)}>
            <div className="nav-icon">{tab.icon}</div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
