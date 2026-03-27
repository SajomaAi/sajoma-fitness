import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const items = [
    { to: '/dashboard', icon: '🏠', label: t('home') },
    { to: '/meal-logger', icon: '🍽️', label: t('meals') },
    { to: '/exercise', icon: '💪', label: t('exercise') },
    { to: '/journal', icon: '📓', label: t('journal') },
    { to: '/settings', icon: '⚙️', label: t('settings') },
  ];

  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const isActive = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to} className={`bottom-nav-item ${isActive ? 'active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
