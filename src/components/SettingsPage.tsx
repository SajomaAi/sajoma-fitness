import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface SettingsPageProps { onLogout: () => void; }

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { t, changeLanguage: setLanguage, language } = useTranslation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Sarah';
  const [notifications, setNotifications] = useState(true);

  const handleLanguageToggle = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
  };

  const menuItems = [
    { icon: '👤', label: t('profile_settings') || 'Profile Settings', to: '#' },
    { icon: '🔔', label: t('notifications') || 'Notifications', to: '/reminders' },
    { icon: '⭐', label: t('subscription') || 'Subscription', to: '/subscription' },
    { icon: '🔒', label: t('privacy_security') || 'Privacy & Security', to: '#' },
    { icon: '❓', label: t('help_support') || 'Help & Support', to: '#' },
  ];

  return (
    <div className="page">
      <h1 className="page-title" style={{ marginBottom: 4 }}>⚙️ {t('settings') || 'Settings'}</h1>
      <p className="page-subtitle" style={{ marginBottom: 24 }}>{t('settings_subtitle') || 'Manage your account and preferences'}</p>

      {/* Profile Card */}
      <div className="sf-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, marginBottom: 20 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: 'linear-gradient(135deg, #F8B4C8, #D4A017)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', color: 'white', fontWeight: 800,
        }}>{userName[0]}</div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3E2723', margin: 0 }}>{userName}</h3>
          <p style={{ fontSize: '0.8rem', color: '#8D6E63', margin: 0 }}>{t('premium_member') || 'Premium Member'}</p>
        </div>
        <button className="sf-btn sf-btn-outline sf-btn-sm" style={{ padding: '8px 12px' }}>{t('edit') || 'Edit'}</button>
      </div>

      {/* Premium Banner */}
      <div className="sf-card sf-card-gold" style={{ padding: 20, marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 4 }}>{t('upgrade_to_premium') || 'Upgrade to Premium'}</h3>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginBottom: 12, maxWidth: '80%' }}>
            {t('premium_banner_desc') || 'Unlock advanced analytics, personalized meal plans, and more.'}
          </p>
          <button className="sf-btn sf-btn-sm" style={{ background: 'white', color: '#C5961B', fontWeight: 700 }} onClick={() => navigate('/subscription')}>
            {t('learn_more') || 'Learn More'}
          </button>
        </div>
        <span style={{ position: 'absolute', right: -10, bottom: -10, fontSize: '5rem', opacity: 0.2 }}>⭐</span>
      </div>

      {/* Settings List */}
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
        {menuItems.map((item, i) => (
          <div key={i} onClick={() => item.to !== '#' && navigate(item.to)} style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            borderBottom: i === menuItems.length - 1 ? 'none' : '1px solid rgba(197,150,27,0.08)',
            cursor: 'pointer',
          }}>
            <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: '0.92rem', fontWeight: 500 }}>{item.label}</span>
            <span style={{ color: '#BCAAA4' }}>›</span>
          </div>
        ))}
      </div>

      {/* Preferences */}
      <h2 className="section-title">{t('preferences') || 'Preferences'}</h2>
      <div className="sf-card" style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(197,150,27,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.2rem' }}>🌐</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{t('language') || 'Language'}</span>
          </div>
          <button className="sf-btn sf-btn-outline sf-btn-sm" onClick={handleLanguageToggle}>
            {language === 'en' ? 'English' : 'Español'}
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '1.2rem' }}>🔔</span>
            <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{t('push_notifications') || 'Push Notifications'}</span>
          </div>
          <label className="sf-toggle">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
            <span className="sf-toggle-track"></span>
            <span className="sf-toggle-thumb"></span>
          </label>
        </div>
      </div>

      {/* Logout */}
      <button className="sf-btn sf-btn-outline sf-btn-full sf-btn-lg" onClick={onLogout} style={{ color: '#D32F2F', borderColor: '#FFCDD2', background: '#FFF5F5' }}>
        {t('logout') || 'Log Out'}
      </button>

      <p style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: '#BCAAA4' }}>
        Sajoma Fitness v1.2.0
      </p>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
