interface PageProps {
  onOpenMenu: () => void;
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';

const PremiumPaywall: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', background: '#FFF0F5',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: 32, maxWidth: 360, width: '100%',
        textAlign: 'center', boxShadow: '0 20px 60px rgba(62,39,35,0.08)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>👑</div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#3E2723', marginBottom: 8 }}>{t('unlock_premium') || 'Unlock Premium'}</h2>
        <p style={{ fontSize: '0.88rem', color: '#8D6E63', lineHeight: 1.5, marginBottom: 24 }}>
          {t('premium_locked_desc') || 'This feature is only available to Premium members. Start your 30-day free trial today!'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' }}>
          {[
            t('ai_meal_analysis') || 'AI Meal Analysis',
            t('personalized_plans') || 'Personalized Plans',
            t('advanced_analytics') || 'Advanced Analytics',
            t('priority_support') || 'Priority Support',
            t('ad_free_experience') || 'Ad-free Experience'
          ].map(f => (
            <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#5D4037' }}>
              <span style={{ color: '#D4A017', fontWeight: 700 }}>✓</span> {f}
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/subscription')} className="btn btn-gold btn-full btn-lg" style={{ marginBottom: 10 }}>
          {t('start_free_trial') || 'Start Free Trial'}
        </button>

        <button onClick={() => navigate(-1)} className="btn btn-full" style={{ background: 'transparent', color: '#8D6E63', fontSize: '0.85rem' }}>
          {t('maybe_later') || 'Maybe Later'}
        </button>
      </div>
    </div>
  );
};

export default PremiumPaywall;
