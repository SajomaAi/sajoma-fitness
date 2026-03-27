import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

type PlanType = 'free' | 'basic' | 'full';
type BillingCycle = 'monthly' | 'yearly';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentPlan] = useState<PlanType>('free');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const plans: Record<PlanType, {
    name: string;
    monthlyPrice: number;
    yearlyPrice: number;
    color: string;
    icon: string;
    badge?: string;
    features: string[];
  }> = {
    free: {
      name: t('free_tier'),
      monthlyPrice: 0,
      yearlyPrice: 0,
      color: '#6c757d',
      icon: '🌱',
      features: [
        t('basic_meal_logging'),
        t('water_tracking'),
        t('health_dashboard'),
        t('basic_exercise_logging'),
      ],
    },
    basic: {
      name: t('basic_premium'),
      monthlyPrice: 9.99,
      yearlyPrice: 49.99,
      color: 'var(--primary-color)',
      icon: '⭐',
      badge: t('most_popular'),
      features: [
        t('journaling'),
        t('detailed_nutrition'),
        t('advanced_analytics'),
        t('personalized_recommendations'),
        t('ad_free'),
      ],
    },
    full: {
      name: t('full_premium'),
      monthlyPrice: 14.99,
      yearlyPrice: 74.99,
      color: '#FF9800',
      icon: '👑',
      badge: t('best_value'),
      features: [
        t('everything_in_basic'),
        t('groups'),
        t('custom_meal_plans'),
        t('ai_meal_analysis'),
        t('priority_support'),
        t('exclusive_content'),
      ],
    },
  };

  const handleUpgrade = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowConfirm(true);
  };

  const getPrice = (plan: { monthlyPrice: number; yearlyPrice: number }) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: { monthlyPrice: number; yearlyPrice: number }) => {
    if (billingCycle === 'yearly' && plan.monthlyPrice > 0) {
      const monthlyCost = plan.monthlyPrice * 12;
      const savings = Math.round(((monthlyCost - plan.yearlyPrice) / monthlyCost) * 100);
      return savings;
    }
    return 0;
  };

  return (
    <div className="container" style={{ padding: '20px', paddingBottom: '80px' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '4px', textAlign: 'center' }}>{t('subscription_plans')}</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-gray)', marginBottom: '20px', fontSize: '0.9rem' }}>
        {t('free_trial_message')}
      </p>

      {/* Billing Toggle */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
        marginBottom: '24px', padding: '6px', backgroundColor: '#f1f3f5', borderRadius: '12px',
        maxWidth: '300px', margin: '0 auto 24px',
      }}>
        <button
          onClick={() => setBillingCycle('monthly')}
          style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
            backgroundColor: billingCycle === 'monthly' ? 'white' : 'transparent',
            color: billingCycle === 'monthly' ? 'var(--primary-color)' : 'var(--text-gray)',
            fontWeight: billingCycle === 'monthly' ? '700' : '500', fontSize: '0.85rem',
            cursor: 'pointer', boxShadow: billingCycle === 'monthly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle('yearly')}
          style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '10px',
            backgroundColor: billingCycle === 'yearly' ? 'white' : 'transparent',
            color: billingCycle === 'yearly' ? 'var(--primary-color)' : 'var(--text-gray)',
            fontWeight: billingCycle === 'yearly' ? '700' : '500', fontSize: '0.85rem',
            cursor: 'pointer', boxShadow: billingCycle === 'yearly' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          Yearly
        </button>
      </div>

      {/* Plan Cards */}
      {(Object.entries(plans) as [PlanType, typeof plans.basic][]).map(([key, plan]) => {
        const isCurrentPlan = currentPlan === key;
        const price = getPrice(plan);
        const savings = getSavings(plan);
        const isFeatured = key === 'basic';

        return (
          <div
            key={key}
            className="card"
            style={{
              padding: '20px',
              marginBottom: '16px',
              border: isFeatured ? '2px solid var(--primary-color)' : '1px solid #e9ecef',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Badge */}
            {'badge' in plan && plan.badge && (
              <div style={{
                position: 'absolute', top: '-12px', right: '16px',
                backgroundColor: key === 'basic' ? 'var(--primary-color)' : '#FF9800',
                color: 'white', padding: '4px 14px', borderRadius: '12px',
                fontSize: '0.7rem', fontWeight: '700', letterSpacing: '0.5px',
              }}>
                {plan.badge}
              </div>
            )}

            {/* Plan Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ fontSize: '1.8rem' }}>{plan.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700' }}>{plan.name}</h3>
                {isCurrentPlan && (
                  <span style={{
                    display: 'inline-block', marginTop: '4px',
                    backgroundColor: 'var(--primary-color)', color: 'white',
                    padding: '2px 10px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: '600',
                  }}>
                    {t('current_plan')}
                  </span>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {price === 0 ? (
                  <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: plan.color }}>$0</p>
                ) : (
                  <>
                    <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800', color: plan.color }}>
                      ${price.toFixed(2)}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-gray)' }}>
                      {billingCycle === 'monthly' ? t('per_month') : t('per_year')}
                    </p>
                    {savings > 0 && (
                      <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#D4A017', fontWeight: '600' }}>
                        Save {savings}%
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Features */}
            <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 16px' }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: plan.color, fontSize: '0.9rem', flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: '0.85rem', color: '#495057' }}>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Action Button */}
            {!isCurrentPlan && key !== 'free' && (
              <button
                onClick={() => handleUpgrade(key)}
                style={{
                  width: '100%', padding: '12px', border: 'none', borderRadius: '12px',
                  backgroundColor: isFeatured ? 'var(--primary-color)' : plan.color,
                  color: 'white', fontSize: '0.95rem', fontWeight: '700',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              >
                {t('start_free_trial')}
              </button>
            )}
          </div>
        );
      })}

      {/* Restore & Cancel */}
      <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '20px' }}>
        <button
          style={{
            background: 'none', border: 'none', color: 'var(--primary-color)',
            fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600', marginBottom: '8px',
          }}
        >
          {t('restore_purchases')}
        </button>
        <p style={{ color: 'var(--text-gray)', fontSize: '0.8rem', margin: 0 }}>{t('cancel_anytime')}</p>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedPlan && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', padding: '28px',
            maxWidth: '360px', width: '100%', textAlign: 'center',
          }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '12px' }}>
              {plans[selectedPlan].icon}
            </span>
            <h2 style={{ margin: '0 0 8px', fontSize: '1.3rem' }}>{plans[selectedPlan].name}</h2>
            <p style={{ color: 'var(--text-gray)', margin: '0 0 20px', fontSize: '0.9rem' }}>
              {t('free_trial_message')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)', margin: '0 0 4px' }}>
              ${getPrice(plans[selectedPlan]).toFixed(2)}
            </p>
            <p style={{ color: 'var(--text-gray)', fontSize: '0.85rem', margin: '0 0 24px' }}>
              {billingCycle === 'monthly' ? t('per_month') : t('per_year')} · {t('cancel_anytime')}
            </p>
            <button
              onClick={() => { setShowConfirm(false); alert('Payment integration coming soon! You would start your 30-day free trial here.'); }}
              style={{
                width: '100%', padding: '14px', border: 'none', borderRadius: '12px',
                backgroundColor: 'var(--primary-color)', color: 'white',
                fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginBottom: '10px',
              }}
            >
              {t('start_free_trial')}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                width: '100%', padding: '12px', border: '1px solid #dee2e6', borderRadius: '12px',
                backgroundColor: 'white', color: 'var(--text-gray)',
                fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              {t('back')}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default SubscriptionPage;
