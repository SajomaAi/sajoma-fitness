interface PageProps {
  onOpenMenu: () => void;
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { useSubscription } from '../contexts/SubscriptionContext';

// Reusable modal-style paywall. Can be used as a full route (via /premium)
// OR embedded inline with custom heading/body by <PaywallCard />.

export const PaywallCard: React.FC<{ heading?: string; body?: string; onClose?: () => void }> = ({ heading, body, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{
      background: 'white', borderRadius: 24, padding: 32, maxWidth: 360, width: '100%',
      textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>👑</div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#212529', marginBottom: 8 }}>
        {heading ?? (t('unlock_premium') || 'Unlock Premium')}
      </h2>
      <p style={{ fontSize: '0.88rem', color: '#6C757D', lineHeight: 1.5, marginBottom: 24 }}>
        {body ?? (t('premium_locked_desc') || 'This feature is only available to Premium members. Start your 30-day free trial today!')}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' }}>
        {[
          t('ai_meal_analysis') || 'AI Meal Analysis',
          t('personalized_plans') || 'Personalized Plans',
          t('advanced_analytics') || 'Advanced Analytics',
          t('priority_support') || 'Priority Support',
          t('ad_free_experience') || 'Ad-free Experience'
        ].map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem', color: '#495057' }}>
            <span style={{ color: '#D4AF37', fontWeight: 700 }}>✓</span> {f}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/subscription')} className="btn btn-gold btn-full btn-lg" style={{ marginBottom: 10 }}>
        {t('view_plans') || 'View Plans'}
      </button>

      <button
        onClick={onClose ?? (() => navigate(-1))}
        className="btn btn-full"
        style={{ background: 'transparent', color: '#6C757D', fontSize: '0.85rem' }}
      >
        {t('maybe_later') || 'Maybe Later'}
      </button>
    </div>
  );
};

// Conditional gate: render children when premium, paywall otherwise.
export const PremiumGate: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  heading?: string;
  body?: string;
}> = ({ children, fallback, heading, body }) => {
  const { isPremium, loading } = useSubscription();
  if (loading) return <>{children}</>;
  if (isPremium) return <>{children}</>;
  return (
    <>{fallback ?? (
      <div style={{ padding: 16 }}>
        <PaywallCard heading={heading} body={body} />
      </div>
    )}</>
  );
};

// Default page route at /premium — full-screen paywall card.
const PremiumPaywall: React.FC<PageProps> = ({ onOpenMenu: _onOpenMenu }) => {
  return (
    <div style={{
      minHeight: '100vh', background: '#F8F9FA',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      <PaywallCard />
    </div>
  );
};

export default PremiumPaywall;
