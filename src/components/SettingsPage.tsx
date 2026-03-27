import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { t, language, changeLanguage } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => { onLogout(); }, 1000);
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage === 'en') changeLanguage('en');
    else if (newLanguage === 'es') changeLanguage('es');
  };

  const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <label style={{ position: 'relative', display: 'inline-block', width: '52px', height: '28px', flexShrink: 0 }}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled} style={{ opacity: 0, width: 0, height: 0 }} />
      <span style={{
        position: 'absolute', cursor: disabled ? 'not-allowed' : 'pointer', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: checked ? 'var(--primary-color)' : '#ccc',
        borderRadius: '28px', transition: '0.3s',
      }}>
        <span style={{
          position: 'absolute', height: '22px', width: '22px', left: '3px', bottom: '3px',
          backgroundColor: 'white', borderRadius: '50%', transition: '0.3s',
          transform: checked ? 'translateX(24px)' : 'translateX(0)',
        }} />
      </span>
    </label>
  );

  const SettingsLink: React.FC<{ to: string; icon: string; label: string; desc: string }> = ({ to, icon, label, desc }) => (
    <Link to={to} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 0', borderBottom: '1px solid #f1f3f5',
      }}>
        <span style={{ fontSize: '1.3rem' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>{label}</p>
          <p style={{ margin: '2px 0 0', color: 'var(--text-gray)', fontSize: '0.75rem' }}>{desc}</p>
        </div>
        <span style={{ color: '#ccc', fontSize: '1.2rem' }}>›</span>
      </div>
    </Link>
  );

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>{t('settings')}</h1>

      {/* Profile Section */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>{t('profile')}</h2>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #F8B4C8 0%, #D4A017 100%)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.4rem', fontWeight: 'bold', marginRight: '14px', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(212,160,23,0.3)',
            }}>
              S
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: '700', margin: '0 0 2px 0', fontSize: '1rem' }}>Sarah Johnson</p>
              <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.85rem' }}>sarah.johnson@example.com</p>
            </div>
            <button style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '1.2rem' }}>✏️</button>
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      <div style={{ marginBottom: '28px' }}>
        <Link to="/subscription" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card" style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #F8B4C8 0%, #D4A017 50%, #C4900A 100%)',
            color: 'white', cursor: 'pointer',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1.2rem' }}>🌱</span>
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{t('free_tier')}</span>
                  <span style={{
                    backgroundColor: 'rgba(255,255,255,0.25)', padding: '2px 8px',
                    borderRadius: '8px', fontSize: '0.7rem', fontWeight: '600',
                  }}>
                    {t('current_plan')}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.9 }}>{t('upgrade_to_premium')}</p>
              </div>
              <span style={{ fontSize: '1.5rem', opacity: 0.8 }}>›</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Links to New Features */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>Features</h2>
        <div className="card" style={{ padding: '4px 16px' }}>
          <SettingsLink to="/exercise" icon="💪" label={t('exercise_tracking')} desc={t('log_workout')} />
          <SettingsLink to="/barcode-scanner" icon="📱" label={t('barcode_scanner')} desc={t('scan_barcode')} />
          <SettingsLink to="/journal" icon="📓" label={t('journaling')} desc={t('daily_journal')} />
          <SettingsLink to="/progress-photos" icon="📸" label={t('progress_photos')} desc={t('weekly_progress')} />
          <SettingsLink to="/reminders" icon="🔔" label={t('reminders')} desc={t('notification_settings')} />
        </div>
      </div>

      {/* App Settings */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>{t('app_settings')}</h2>

        {/* Notifications */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p style={{ fontWeight: '600', margin: '0 0 2px 0', fontSize: '0.9rem' }}>{t('notifications')}</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.8rem' }}>{t('receive_reminders')}</p>
          </div>
          <ToggleSwitch checked={notifications} onChange={() => setNotifications(!notifications)} />
        </div>

        {/* Dark Mode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <p style={{ fontWeight: '600', margin: '0 0 2px 0', fontSize: '0.9rem' }}>{t('dark_mode')}</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.8rem' }}>{t('use_dark_theme')}</p>
          </div>
          <ToggleSwitch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </div>

        {/* Language Selector */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontWeight: '600', margin: '0 0 8px 0', fontSize: '0.9rem' }}>{t('language')}</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { code: 'en', label: '🇺🇸 English' },
              { code: 'es', label: '🇪🇸 Español' },
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                style={{
                  flex: 1, padding: '12px', borderRadius: '10px',
                  border: '2px solid', borderColor: language === lang.code ? 'var(--primary-color)' : '#e9ecef',
                  backgroundColor: language === lang.code ? 'var(--primary-color)' + '15' : 'white',
                  color: language === lang.code ? 'var(--primary-color)' : '#666',
                  fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '12px' }}>{t('about')}</h2>
        <div className="card" style={{ padding: '4px 16px' }}>
          {[t('privacy_policy'), t('terms_of_service'), t('contact_support')].map((item, i) => (
            <div key={i} style={{ padding: '14px 0', borderBottom: i < 2 ? '1px solid #f1f3f5' : 'none' }}>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '0.9rem' }}>{item}</p>
            </div>
          ))}
          <div style={{ padding: '14px 0', borderTop: '1px solid #f1f3f5' }}>
            <p style={{ fontWeight: '600', margin: '0 0 2px 0', fontSize: '0.9rem' }}>{t('app_version')}</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.8rem' }}>2.0.0</p>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        className="btn btn-full"
        onClick={handleLogout}
        disabled={isLoading}
        style={{
          backgroundColor: '#D32F2F', marginBottom: '32px',
          opacity: isLoading ? 0.7 : 1, borderRadius: '12px', padding: '14px', fontSize: '1rem',
        }}
      >
        {isLoading ? t('logging_out') : t('log_out')}
      </button>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
