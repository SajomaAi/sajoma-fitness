import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const plans = [
    {
      id: 'free',
      name: t('free_tier') || 'Free',
      price: '0',
      features: [
        t('basic_meal_logging') || 'Basic meal logging',
        t('water_tracking') || 'Water tracking',
        t('health_dashboard') || 'Health dashboard',
        t('basic_exercise_logging') || 'Basic exercise logging',
      ],
      current: true,
    },
    {
      id: 'basic',
      name: t('basic_premium') || 'Basic Premium',
      price: billingCycle === 'monthly' ? '9.99' : '49.99',
      features: [
        t('journaling') || 'Journaling',
        t('detailed_nutrition') || 'Detailed nutrition',
        t('advanced_analytics') || 'Advanced analytics',
        t('personalized_recommendations') || 'Personalized recommendations',
        t('ad_free') || 'Ad-free experience',
      ],
      popular: true,
    },
    {
      id: 'full',
      name: t('full_premium') || 'Full Premium',
      price: billingCycle === 'monthly' ? '14.99' : '74.99',
      features: [
        t('everything_in_basic') || 'Everything in Basic',
        t('groups_community') || 'Groups & Community',
        t('custom_meal_plans') || 'Custom meal plans',
        t('ai_meal_analysis') || 'AI meal analysis',
        t('priority_support') || 'Priority support',
      ],
    },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>‹</button>
        <h1 className="page-title" style={{ marginBottom: 0 }}>{t('subscription_plans') || 'Subscription'}</h1>
      </div>

      <div className="sf-card sf-card-pink" style={{ padding: 20, textAlign: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3E2723', marginBottom: 8 }}>{t('start_free_trial') || 'Start Your 30-Day Free Trial'}</h2>
        <p style={{ fontSize: '0.85rem', color: '#8D6E63', marginBottom: 0 }}>{t('cancel_anytime') || 'No commitment. Cancel anytime.'}</p>
      </div>

      {/* Billing Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <div style={{ background: '#FFF0F5', padding: 4, borderRadius: 14, display: 'flex', gap: 4 }}>
          <button onClick={() => setBillingCycle('monthly')} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: billingCycle === 'monthly' ? 'white' : 'transparent',
            color: billingCycle === 'monthly' ? '#C5961B' : '#BCAAA4',
            fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
          }}>{t('monthly') || 'Monthly'}</button>
          <button onClick={() => setBillingCycle('yearly')} style={{
            padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: billingCycle === 'yearly' ? 'white' : 'transparent',
            color: billingCycle === 'yearly' ? '#C5961B' : '#BCAAA4',
            fontWeight: 700, fontSize: '0.85rem', transition: 'all 0.2s',
          }}>
            {t('yearly') || 'Yearly'}
            <span style={{ marginLeft: 6, fontSize: '0.65rem', background: '#F8B4C8', color: 'white', padding: '2px 6px', borderRadius: 6 }}>-50%</span>
          </button>
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        {plans.map(plan => (
          <div key={plan.id} className={`sf-card ${plan.popular ? 'sf-card-gold' : ''}`} style={{
            padding: 24, position: 'relative', border: plan.popular ? 'none' : '1px solid rgba(197,150,27,0.1)',
          }}>
            {plan.popular && (
              <div style={{
                position: 'absolute', top: 12, right: 12, background: 'white', color: '#C5961B',
                fontSize: '0.65rem', fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase',
              }}>{t('most_popular') || 'Most Popular'}</div>
            )}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: 4 }}>{plan.name}</h3>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800 }}>${plan.price}</span>
              <span style={{ fontSize: '0.85rem', opacity: 0.7 }}>/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: plan.popular ? 'white' : '#C5961B', fontSize: '0.9rem' }}>✓</span>
                  <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{f}</span>
                </div>
              ))}
            </div>
            <button className={`sf-btn sf-btn-full sf-btn-lg ${plan.popular ? '' : 'sf-btn-gold'}`} style={{
              background: plan.popular ? 'white' : undefined,
              color: plan.popular ? '#C5961B' : undefined,
              fontWeight: 800,
            }}>
              {plan.current ? (t('current_plan') || 'Current Plan') : (t('get_started') || 'Get Started')}
            </button>
          </div>
        ))}
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#BCAAA4', marginBottom: 24 }}>
        {t('subscription_footer_msg') || 'Subscription will automatically renew unless canceled at least 24 hours before the end of the current period.'}
      </p>

      <BottomNav />
    </div>
  );
};

export default SubscriptionPage;
