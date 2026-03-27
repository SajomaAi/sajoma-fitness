interface SettingsPageProps {
  onOpenMenu: () => void;
  onLogout?: () => void;
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';


const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout, onOpenMenu }) => {
  const { t, language, changeLanguage } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const userName = (() => {
    try { const u = localStorage.getItem('sajoma-user'); return u ? JSON.parse(u).name : 'User'; } catch { return 'User'; }
  })();
  const userEmail = (() => {
    try { const u = localStorage.getItem('sajoma-user'); return u ? JSON.parse(u).email : ''; } catch { return ''; }
  })();

  const handleLogout = () => {
    localStorage.removeItem('sajoma-token');
    localStorage.removeItem('sajoma-user');
    localStorage.removeItem('sajoma-loggedIn');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{
      width: 48, height: 28, borderRadius: 14, border: 'none', cursor: 'pointer',
      background: on ? 'var(--gold-gradient)' : '#CED4DA',
      position: 'relative', transition: 'background 0.3s ease',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: on ? 23 : 3,
        transition: 'left 0.3s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }} />
    </button>
  );

  const SettingRow = ({ icon, label, onClick, right, danger }: { icon: string; label: string; onClick?: () => void; right?: React.ReactNode; danger?: boolean }) => (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0',
      borderBottom: '1px solid rgba(212,175,55,0.06)', cursor: onClick ? 'pointer' : 'default',
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: danger ? 'rgba(229,57,53,0.08)' : 'rgba(212,175,55,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>{icon}</div>
      <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600, color: danger ? '#E53935' : '#212529' }}>{label}</span>
      {right || (onClick && <span style={{ color: '#ADB5BD', fontSize: '1rem' }}>&#8250;</span>)}
    </div>
  );

  return (
    <div className="page animate-in">
      <PageHeader title={t('settings') || 'Settings'} onOpenMenu={onOpenMenu} />

      {/* Profile Card */}
      <div className="card card-gold" style={{ padding: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 800, border: '2px solid rgba(255,255,255,0.4)' }}>
          {userName.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 2 }}>{userName}</h2>
          <p style={{ fontSize: '0.78rem', opacity: 0.8 }}>{userEmail}</p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: 8, marginTop: 4, fontSize: '0.68rem', fontWeight: 600 }}>
            ⭐ {t('free_plan') || 'Free Plan'}
          </div>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="card" style={{ padding: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }} onClick={() => navigate('/subscription')}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: 'var(--gold-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: 'var(--shadow-gold)' }}>👑</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#212529' }}>{t('upgrade_premium') || 'Upgrade to Premium'}</div>
          <div style={{ fontSize: '0.75rem', color: '#6C757D' }}>{t('unlock_all_features') || 'Unlock all features'} &middot; 30-day free trial</div>
        </div>
        <span style={{ color: '#D4AF37', fontWeight: 700 }}>&#8250;</span>
      </div>

      {/* Settings Groups */}
      <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon="🌐" label={t('language') || 'Language'} right={
          <div className="tabs" style={{ width: 'auto', marginBottom: 0 }}>
            <button className={`tab ${language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')} style={{ padding: '6px 14px', fontSize: '0.72rem' }}>EN</button>
            <button className={`tab ${language === 'es' ? 'active' : ''}`} onClick={() => changeLanguage('es')} style={{ padding: '6px 14px', fontSize: '0.72rem' }}>ES</button>
          </div>
        } />
        <SettingRow icon="🔔" label={t('notifications') || 'Notifications'} right={<Toggle on={notifications} onToggle={() => setNotifications(!notifications)} />} />
        <SettingRow icon="🌙" label={t('dark_mode') || 'Dark Mode'} right={<Toggle on={darkMode} onToggle={() => setDarkMode(!darkMode)} />} />
      </div>

      <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon="🎯" label={t('goals') || 'Goals & Targets'} onClick={() => {}} />
        <SettingRow icon="📊" label={t('health_data') || 'Health Data'} onClick={() => navigate('/health-tracker')} />
        <SettingRow icon="🔔" label={t('reminders') || 'Reminders'} onClick={() => navigate('/reminders')} />
        <SettingRow icon="📸" label={t('progress_photos') || 'Progress Photos'} onClick={() => navigate('/progress-photos')} />
      </div>

      <div className="card" style={{ padding: '4px 18px', marginBottom: 16 }}>
        <SettingRow icon="❓" label={t('help_support') || 'Help & Support'} onClick={() => {}} />
        <SettingRow icon="📋" label={t('terms_of_service') || 'Terms of Service'} onClick={() => {}} />
        <SettingRow icon="🔒" label={t('privacy_policy') || 'Privacy Policy'} onClick={() => {}} />
      </div>

      <div className="card" style={{ padding: '4px 18px', marginBottom: 20 }}>
        <SettingRow icon="🚪" label={t('log_out') || 'Log Out'} onClick={handleLogout} danger />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#ADB5BD', marginBottom: 20 }}>Sajoma Fitness v1.0.0</p>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />
      <BottomNav />
    </div>
  );
};

export default SettingsPage;
