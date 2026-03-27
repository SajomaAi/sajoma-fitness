import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const PremiumPaywall: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 40, background: 'white' }}>
      <div style={{ textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: '5rem', marginBottom: 32 }}>⭐</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3E2723', marginBottom: 16 }}>{t('premium_feature') || 'Premium Feature'}</h1>
        <p style={{ fontSize: '1rem', color: '#8D6E63', lineHeight: 1.6, marginBottom: 40 }}>
          {t('premium_feature_desc') || 'This feature is only available to our Premium members. Upgrade now to unlock full access.'}
        </p>
        
        <div className="sf-card sf-card-pink" style={{ padding: 20, textAlign: 'left', marginBottom: 32 }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#3E2723', marginBottom: 12 }}>{t('premium_benefits') || 'Premium Benefits:'}</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['AI Meal Analysis', 'Personalized Plans', 'Advanced Analytics', 'Priority Support'].map((b, i) => (
              <li key={i} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: '#C5961B' }}>✓</span> {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
        <button className="sf-btn sf-btn-gold sf-btn-full sf-btn-lg" onClick={() => navigate('/subscription')}>
          {t('upgrade_now') || 'Upgrade Now'}
        </button>
        <button className="sf-btn sf-btn-outline sf-btn-full sf-btn-lg" onClick={() => navigate(-1)}>
          {t('go_back') || 'Go Back'}
        </button>
      </div>
    </div>
  );
};

export default PremiumPaywall;
