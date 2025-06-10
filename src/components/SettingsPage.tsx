import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import PremiumPaywall from './PremiumPaywall';

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const { t, language, changeLanguage } = useTranslation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [multilingualEnabled, setMultilingualEnabled] = useState(true); // Now enabled
  const [isLoading, setIsLoading] = useState(false);
  const [showPremiumPaywall, setShowPremiumPaywall] = useState(false);
  
  const handleLogout = () => {
    setIsLoading(true);
    
    // Simulate logout process
    setTimeout(() => {
      onLogout();
      // In a real app, this would navigate to the login page
    }, 1000);
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (newLanguage === 'English') {
      changeLanguage('en');
    } else if (newLanguage === 'Spanish') {
      changeLanguage('es');
    }
    // Other languages can be added here when translations are available
  };

  const handlePremiumUpgrade = () => {
    setShowPremiumPaywall(true);
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      {/* Header */}
      <h1 style={{ fontSize: '1.8rem', marginBottom: '24px', textAlign: 'center' }}>Settings</h1>
      
      {/* Profile Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Profile</h2>
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'var(--primary-color)', 
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginRight: '16px'
            }}>
              S
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Sarah Johnson</p>
              <p style={{ color: 'var(--text-gray)', margin: 0 }}>sarah.johnson@example.com</p>
            </div>
            <button style={{ 
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontSize: '1.2rem'
            }}>
              ✏️
            </button>
          </div>
        </div>
      </div>
      
      {/* App Settings Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>App Settings</h2>
        
        {/* Notifications Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Notifications</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.9rem' }}>Receive reminders and updates</p>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: notifications ? 'var(--primary-color)' : '#ccc',
              borderRadius: '34px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '26px',
                width: '26px',
                left: '4px',
                bottom: '4px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s',
                transform: notifications ? 'translateX(26px)' : 'translateX(0)'
              }}></span>
            </span>
          </label>
        </div>
        
        {/* Dark Mode Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Dark Mode</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.9rem' }}>Use dark theme</p>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={() => setDarkMode(!darkMode)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: darkMode ? 'var(--primary-color)' : '#ccc',
              borderRadius: '34px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '26px',
                width: '26px',
                left: '4px',
                bottom: '4px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s',
                transform: darkMode ? 'translateX(26px)' : 'translateX(0)'
              }}></span>
            </span>
          </label>
        </div>
        
        {/* Premium Upgrade Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>{t('upgrade_to_premium')}</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.9rem' }}>Unlock advanced features and personalized insights</p>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
            <input 
              type="checkbox" 
              checked={false} 
              disabled={true}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'not-allowed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ccc',
              borderRadius: '34px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '26px',
                width: '26px',
                left: '4px',
                bottom: '4px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s',
                transform: 'translateX(0)'
              }}></span>
            </span>
          </label>
        </div>
        
        {/* Language Toggle */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div>
            <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>Multilingual Support</p>
            <p style={{ color: 'var(--text-gray)', margin: 0, fontSize: '0.9rem' }}>Enable language switching</p>
          </div>
          <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
            <input 
              type="checkbox" 
              checked={multilingualEnabled} 
              onChange={() => setMultilingualEnabled(!multilingualEnabled)}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span style={{
              position: 'absolute',
              cursor: 'pointer',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: multilingualEnabled ? 'var(--primary-color)' : '#ccc',
              borderRadius: '34px',
              transition: '0.4s'
            }}>
              <span style={{
                position: 'absolute',
                content: '""',
                height: '26px',
                width: '26px',
                left: '4px',
                bottom: '4px',
                backgroundColor: 'white',
                borderRadius: '50%',
                transition: '0.4s',
                transform: multilingualEnabled ? 'translateX(26px)' : 'translateX(0)'
              }}></span>
            </span>
          </label>
        </div>
        
        {/* Language Selector */}
        {multilingualEnabled && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>Language</p>
            <select 
              value={language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'English'} 
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--gray-color)',
                backgroundColor: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="English">🇺🇸 English</option>
              <option value="Spanish">🇪🇸 Español</option>
              <option value="French">🇫🇷 Français (Coming Soon)</option>
              <option value="German">🇩🇪 Deutsch (Coming Soon)</option>
              <option value="Italian">🇮🇹 Italiano (Coming Soon)</option>
              <option value="Portuguese">🇵🇹 Português (Coming Soon)</option>
              <option value="Chinese">🇨🇳 中文 (Coming Soon)</option>
              <option value="Japanese">🇯🇵 日本語 (Coming Soon)</option>
            </select>
            <p style={{ color: 'var(--text-gray)', margin: '8px 0 0 0', fontSize: '0.8rem' }}>
              {language === 'es' ? 'Idiomas adicionales estarán disponibles en futuras actualizaciones' : 'Additional languages will be available in future updates'}
            </p>
          </div>
        )}
      </div>
      
      {/* Subscription Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Subscription</h2>
        <div className="card" style={{ 
          padding: '16px',
          backgroundColor: 'rgba(85, 107, 47, 0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <p style={{ fontWeight: 'bold', margin: 0 }}>Free Plan</p>
            <span style={{
              backgroundColor: 'var(--primary-color)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.8rem',
              fontWeight: 'bold'
            }}>
              CURRENT
            </span>
          </div>
          
          <p style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>Upgrade to Premium for:</p>
          
          <ul style={{ 
            listStyleType: 'none',
            padding: 0,
            margin: '0 0 16px 0'
          }}>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                color: 'var(--primary-color)',
                marginRight: '8px'
              }}>✓</span>
              Personalized meal suggestions
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                color: 'var(--primary-color)',
                marginRight: '8px'
              }}>✓</span>
              Wearable device integration
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ 
                color: 'var(--primary-color)',
                marginRight: '8px'
              }}>✓</span>
              Expert nutritional guidance
            </li>
            <li style={{ 
              display: 'flex', 
              alignItems: 'center'
            }}>
              <span style={{ 
                color: 'var(--primary-color)',
                marginRight: '8px'
              }}>✓</span>
              Ad-free experience
            </li>
          </ul>
          
          <button 
            className="btn btn-full"
            onClick={handlePremiumUpgrade}
          >
            UPGRADE NOW
          </button>
        </div>
      </div>
      
      {/* About Section */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>About</h2>
        
        <div style={{ 
          padding: '16px 0',
          borderBottom: '1px solid var(--gray-color)'
        }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>Privacy Policy</p>
        </div>
        
        <div style={{ 
          padding: '16px 0',
          borderBottom: '1px solid var(--gray-color)'
        }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>Terms of Service</p>
        </div>
        
        <div style={{ 
          padding: '16px 0',
          borderBottom: '1px solid var(--gray-color)'
        }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>Contact Support</p>
        </div>
        
        <div style={{ 
          padding: '16px 0'
        }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 4px 0' }}>App Version</p>
          <p style={{ color: 'var(--text-gray)', margin: 0 }}>1.0.0</p>
        </div>
      </div>
      
      {/* Logout Button */}
      <button
        className="btn btn-full"
        onClick={handleLogout}
        disabled={isLoading}
        style={{
          backgroundColor: '#D32F2F',
          marginBottom: '32px',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Logging out...' : 'LOG OUT'}
      </button>
      
      {/* Bottom Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around',
        marginTop: '40px',
        padding: '16px 0',
        borderTop: '1px solid var(--gray-color)'
      }}>
        <Link to="/dashboard" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>🏠</span>
          <span style={{ fontSize: '0.8rem' }}>{t('home')}</span>
        </Link>
        <Link to="/meal-logger" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📷</span>
          <span style={{ fontSize: '0.8rem' }}>{t('meals')}</span>
        </Link>
        <Link to="/water-tracker" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>💧</span>
          <span style={{ fontSize: '0.8rem' }}>{t('water_nav')}</span>
        </Link>
        <Link to="/health-tracker" style={{ 
          textDecoration: 'none', 
          color: 'var(--text-gray)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '4px' }}>📊</span>
          <span style={{ fontSize: '0.8rem' }}>{t('health')}</span>
        </Link>
      </div>

      {/* Premium Paywall Modal */}
      <PremiumPaywall
        isOpen={showPremiumPaywall}
        onClose={() => setShowPremiumPaywall(false)}
        feature="premium_features"
      />
    </div>
  );
};

export default SettingsPage;
