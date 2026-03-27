import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import BottomNav from './BottomNav';

const SubscriptionPage: React.FC = () => {
  const { t: _t } = useTranslation();
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('');

  const plans = [
    {
      id: 'free', name: 'Free', price: '$0', yearlyPrice: '$0', icon: '🌱',
      features: ['Basic meal logging', 'Water tracking', 'Health dashboard', 'Basic exercise logging'],
      color: '#8D6E63',
    },
    {
      id: 'basic', name: 'Basic Premium', price: '$9.99/mo', yearlyPrice: '$49.99/yr', icon: '⭐', badge: 'POPULAR',
      features: ['Everything in Free', 'Journaling', 'Detailed nutrition', 'Advanced analytics', 'Personalized recommendations', 'Ad-free experience'],
      color: '#D4A017',
    },
    {
      id: 'full', name: 'Full Premium', price: '$14.99/mo', yearlyPrice: '$74.99/yr', icon: '👑', badge: 'BEST VALUE',
      features: ['Everything in Basic', 'Group challenges', 'Custom meal plans', 'AI meal analysis', 'Priority support', 'Exclusive content'],
      color: '#C5961B',
    },
  ];

  return (
    <div className="page animate-in">
      <div className="page-header">
        <button className="page-back" onClick={() => navigate('/settings')}>&#8249;</button>
        <h1 className="page-header-title">Premium</h1>
        <div style={{ width: 32 }} />
      </div>

      {/* Hero */}
      <div className="card card-gold" style={{ padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 8 }}>👑</p>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>Unlock Your Full Potential</h2>
        <p style={{ fontSize: '0.82rem', opacity: 0.85, lineHeight: 1.5 }}>Get personalized insights, advanced tracking, and premium features</p>
        <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 10, marginTop: 10, fontSize: '0.72rem', fontWeight: 700 }}>
          🎁 30-day free trial
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)}>Monthly</button>
        <button className={`tab ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)}>Yearly (Save 58%)</button>
      </div>

      {/* Plan Cards */}
      {plans.map(plan => (
        <div key={plan.id} className={`card ${selectedPlan === plan.id ? '' : ''}`} onClick={() => setSelectedPlan(plan.id)} style={{
          padding: 20, marginBottom: 12, cursor: 'pointer', position: 'relative',
          border: selectedPlan === plan.id ? '2px solid #D4A017' : '1.5px solid rgba(212,160,23,0.08)',
          boxShadow: selectedPlan === plan.id ? '0 4px 20px rgba(212,160,23,0.15)' : undefined,
        }}>
          {plan.badge && (
            <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--gold-gradient)', color: 'white', padding: '3px 12px', borderRadius: '0 0 8px 8px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
              {plan.badge}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: plan.id === 'free' ? 'rgba(141,110,99,0.1)' : 'rgba(212,160,23,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{plan.icon}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#3E2723', marginBottom: 2 }}>{plan.name}</h3>
              <p style={{ fontSize: '1.1rem', fontWeight: 800, color: plan.color, margin: 0 }}>
                {isYearly ? plan.yearlyPrice : plan.price}
              </p>
            </div>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              border: selectedPlan === plan.id ? 'none' : '2px solid #E0D6D0',
              background: selectedPlan === plan.id ? 'var(--gold-gradient)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selectedPlan === plan.id && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {plan.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', color: '#5D4037' }}>
                <span style={{ color: plan.id === 'free' ? '#8D6E63' : '#D4A017', fontSize: '0.7rem' }}>✓</span> {f}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* CTA */}
      <button className="btn btn-gold btn-full btn-lg" style={{ marginTop: 8, marginBottom: 12 }} disabled={!selectedPlan || selectedPlan === 'free'}>
        {selectedPlan === 'free' ? 'Current Plan' : 'Start Free Trial'}
      </button>

      <button className="btn btn-full" style={{ background: 'transparent', color: '#8D6E63', fontSize: '0.82rem' }}>
        Restore Purchases
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#BCAAA4', marginTop: 12, lineHeight: 1.5 }}>
        Cancel anytime. No charge during trial period. Subscription auto-renews unless cancelled 24 hours before the end of the current period.
      </p>

      <BottomNav />
    </div>
  );
};

export default SubscriptionPage;
