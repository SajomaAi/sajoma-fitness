import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';
import HamburgerMenu from './HamburgerMenu';

const SubscriptionPage: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('basic');

  const plans = [
    {
      id: 'free', 
      name: t('free_tier') || 'Free', 
      price: '$0', 
      yearlyPrice: '$0', 
      icon: '🌱',
      features: [t('basic_meal_logging'), t('water_tracking'), t('health_dashboard'), t('basic_exercise_logging')],
      color: '#6C757D',
    },
    {
      id: 'basic', 
      name: t('basic_premium') || 'Basic Premium', 
      price: '$9.99/mo', 
      yearlyPrice: '$49.99/yr', 
      icon: '⭐', 
      badge: t('most_popular') || 'POPULAR',
      features: [t('everything_in_free'), t('journaling'), t('detailed_nutrition'), t('advanced_analytics'), t('personalized_recommendations'), t('ad_free_experience')],
      color: '#D4AF37',
    },
    {
      id: 'full', 
      name: t('full_premium') || 'Full Premium', 
      price: '$14.99/mo', 
      yearlyPrice: '$74.99/yr', 
      icon: '👑', 
      badge: t('best_value') || 'BEST VALUE',
      features: [t('everything_in_basic'), t('group_challenges'), t('custom_meal_plans'), t('ai_meal_analysis'), t('priority_support'), t('exclusive_content')],
      color: '#C19A29',
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sajoma-loggedIn');
    navigate('/login');
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('subscription') || 'Subscription'} onOpenMenu={onOpenMenu} />

      <div className="card card-gold" style={{ padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 8 }}>👑</p>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>{t('premium_experience') || 'Unlock Your Full Potential'}</h2>
        <p style={{ fontSize: '0.82rem', opacity: 0.85, lineHeight: 1.5 }}>{t('premium_desc') || 'Get personalized insights, advanced tracking, and premium features'}</p>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 10, marginTop: 10, fontSize: '0.72rem', fontWeight: 700 }}>
          🎁 {t('free_trial_30') || '30-day free trial'}
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)}>{t('monthly') || 'Monthly'}</button>
        <button className={`tab ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)}>{t('yearly') || 'Yearly'} ({t('save_58') || 'Save 58%'})</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
        {plans.map(plan => (
          <div key={plan.id} className={`card ${selectedPlan === plan.id ? '' : ''}`} onClick={() => setSelectedPlan(plan.id)} style={{
            padding: 20, cursor: 'pointer', position: 'relative',
            border: selectedPlan === plan.id ? '2px solid #D4AF37' : '1.5px solid rgba(212,175,55,0.08)',
            boxShadow: selectedPlan === plan.id ? '0 4px 20px rgba(212,175,55,0.15)' : undefined,
          }}>
            {plan.badge && (
              <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--gold-gradient)', color: 'white', padding: '3px 12px', borderRadius: '0 0 8px 8px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                {plan.badge}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: plan.id === 'free' ? 'rgba(108,117,125,0.1)' : 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{plan.icon}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#212529', marginBottom: 2 }}>{plan.name}</h3>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: plan.color, margin: 0 }}>
                  {isYearly ? plan.yearlyPrice : plan.price}
                </p>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: selectedPlan === plan.id ? 'none' : '2px solid #CED4DA',
                background: selectedPlan === plan.id ? 'var(--gold-gradient)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selectedPlan === plan.id && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#495057' }}>
                  <span style={{ color: plan.id === 'free' ? '#6C757D' : '#D4AF37', fontSize: '0.7rem' }}>✓</span> {f}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-gold btn-full btn-lg" style={{ marginTop: 8, marginBottom: 12 }} disabled={!selectedPlan || selectedPlan === 'free'}>
        {selectedPlan === 'free' ? (t('current_plan') || 'Current Plan') : (t('start_free_trial') || 'Start Free Trial')}
      </button>

      <button style={{ background: 'none', border: 'none', width: '100%', color: '#6C757D', fontSize: '0.82rem', cursor: 'pointer' }}>
        {t('restore_purchases') || 'Restore Purchases'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#ADB5BD', marginTop: 12, lineHeight: 1.5, paddingBottom: 40 }}>
        {t('subscription_terms_long') || 'Cancel anytime. No charge during trial period. Subscription auto-renews unless cancelled 24 hours before the end of the current period.'}
      </p>

      <HamburgerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onLogout={handleLogout} />
      <BottomNav />
    </div>
  );
};

export default SubscriptionPage;
