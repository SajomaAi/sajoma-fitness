import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: t('home') },
    { path: '/meal-logger', icon: '📷', label: t('meals') },
    { path: '/exercise', icon: '💪', label: t('exercise') },
    { path: '/water-tracker', icon: '💧', label: t('water_nav') },
    { path: '/journal', icon: '📓', label: t('journal') },
  ];

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      borderTop: '1px solid var(--gray-color)',
      backgroundColor: 'white',
      position: 'sticky',
      bottom: 0,
      zIndex: 100,
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              textDecoration: 'none',
              color: isActive ? 'var(--primary-color)' : 'var(--text-gray)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              transition: 'color 0.2s ease',
            }}
          >
            <span style={{ fontSize: '1.4rem', marginBottom: '2px' }}>{item.icon}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? '700' : '500' }}>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
