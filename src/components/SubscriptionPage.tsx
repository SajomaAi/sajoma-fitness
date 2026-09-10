import React, { useMemo, useState } from 'react';
import type { PurchasesPackage } from '@revenuecat/purchases-capacitor';
import { useTranslation } from '../hooks/useTranslation';
import { useSubscription } from '../contexts/SubscriptionContext';
import BottomNav from './BottomNav';
import PageHeader from './PageHeader';

const FREE_FEATURES = [
  'basic_meal_logging',
  'water_tracking',
  'health_dashboard',
  'basic_exercise_logging',
] as const;

const BASIC_FEATURES = [
  'everything_in_free',
  'journaling',
  'detailed_nutrition',
  'advanced_analytics',
  'personalized_recommendations',
  'ad_free_experience',
] as const;

const FULL_FEATURES = [
  'everything_in_basic',
  'group_challenges',
  'custom_meal_plans',
  'ai_meal_analysis',
  'priority_support',
  'exclusive_content',
] as const;

// RevenueCat exposes packageType constants like MONTHLY, ANNUAL. When mapping
// UI labels, the `identifier` on the package is the source of truth ($rc_monthly, $rc_annual, or custom).
const MONTHLY_TYPES = ['$rc_monthly', 'MONTHLY', 'monthly'];
const ANNUAL_TYPES = ['$rc_annual', 'ANNUAL', 'annual', '$rc_yearly', 'yearly'];

function findPackage(
  offering: ReturnType<typeof useSubscription>['offering'],
  tier: 'basic' | 'full',
  period: 'monthly' | 'annual'
): PurchasesPackage | null {
  if (!offering) return null;
  const types = period === 'monthly' ? MONTHLY_TYPES : ANNUAL_TYPES;
  // Prefer exact identifier match: e.g. "basic_monthly", "full_annual"
  const exact = offering.availablePackages.find(
    (p) => p.identifier.toLowerCase().includes(tier) && types.some(t => p.identifier.toLowerCase().includes(t.replace('$rc_', '')))
  );
  if (exact) return exact;
  // Fallback: first package matching the period (use when only one tier is configured)
  return offering.availablePackages.find((p) => types.some(t => p.identifier === t || p.packageType === t)) ?? null;
}

const SubscriptionPage: React.FC<{ onOpenMenu: () => void }> = ({ onOpenMenu }) => {
  const { t } = useTranslation();
  const { tier: currentTier, offering, loading, purchaseAvailable, purchase, restore } = useSubscription();
  const [period, setPeriod] = useState<'monthly' | 'annual'>('annual');
  const [selectedTier, setSelectedTier] = useState<'free' | 'basic' | 'full'>(
    currentTier === 'full_premium' ? 'full' : currentTier === 'basic_premium' ? 'basic' : 'basic'
  );
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const basicPkg = useMemo(() => findPackage(offering, 'basic', period), [offering, period]);
  const fullPkg = useMemo(() => findPackage(offering, 'full', period), [offering, period]);

  const priceString = (pkg: PurchasesPackage | null): string => {
    if (!pkg) return '—';
    return pkg.product.priceString || `${pkg.product.currencyCode ?? ''} ${pkg.product.price}`.trim();
  };

  const plans = [
    {
      id: 'free' as const,
      name: t('free_tier') || 'Free',
      icon: '🌱',
      price: t('price_free') || 'Free',
      features: FREE_FEATURES.map(k => t(k) || k),
      color: '#6C757D',
      pkg: null as PurchasesPackage | null,
    },
    {
      id: 'basic' as const,
      name: t('basic_premium') || 'Basic Premium',
      icon: '⭐',
      badge: t('most_popular') || 'POPULAR',
      price: priceString(basicPkg),
      features: BASIC_FEATURES.map(k => t(k) || k),
      color: '#D4AF37',
      pkg: basicPkg,
    },
    {
      id: 'full' as const,
      name: t('full_premium') || 'Full Premium',
      icon: '👑',
      badge: t('best_value') || 'BEST VALUE',
      price: priceString(fullPkg),
      features: FULL_FEATURES.map(k => t(k) || k),
      color: '#C19A29',
      pkg: fullPkg,
    },
  ];

  const selectedPlan = plans.find(p => p.id === selectedTier)!;
  const isCurrent =
    (selectedTier === 'free' && currentTier === 'free') ||
    (selectedTier === 'basic' && currentTier === 'basic_premium') ||
    (selectedTier === 'full' && currentTier === 'full_premium');

  const handlePurchase = async () => {
    setStatus('');
    if (selectedTier === 'free') return;
    if (!purchaseAvailable) {
      setStatus(t('download_ios_to_purchase') || 'In-app purchases require the iOS app. Download it to subscribe.');
      return;
    }
    if (!selectedPlan.pkg) {
      setStatus(t('no_package_available') || 'Plan not available right now. Try again later.');
      return;
    }
    setBusy(true);
    const res = await purchase(selectedPlan.pkg);
    setBusy(false);
    if (res.cancelled) return;
    if (res.ok) setStatus(t('purchase_success') || 'Purchase complete! Welcome to premium.');
    else setStatus(res.error || 'Purchase failed');
  };

  const handleRestore = async () => {
    setStatus('');
    if (!purchaseAvailable) {
      setStatus(t('download_ios_to_restore') || 'Restore requires the iOS app.');
      return;
    }
    setBusy(true);
    const res = await restore();
    setBusy(false);
    if (res.ok) setStatus(t('restore_success') || 'Purchases restored.');
    else setStatus(res.error || 'Nothing to restore');
  };

  return (
    <div className="page animate-in">
      <PageHeader title={t('subscription') || 'Subscription'} onOpenMenu={onOpenMenu} />

      <div className="card card-gold" style={{ padding: 24, marginBottom: 20, textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 8 }}>👑</p>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 6 }}>{t('premium_experience') || 'Unlock Your Full Potential'}</h2>
        <p style={{ fontSize: '0.82rem', opacity: 0.85, lineHeight: 1.5 }}>{t('premium_desc') || 'Get personalized insights, advanced tracking, and premium features'}</p>
        {currentTier !== 'free' && (
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: 10, marginTop: 10, fontSize: '0.72rem', fontWeight: 700 }}>
            ✅ {t('you_are_on') || "You're on"} {currentTier === 'full_premium' ? (t('full_premium') || 'Full Premium') : (t('basic_premium') || 'Basic Premium')}
          </div>
        )}
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        <button className={`tab ${period === 'monthly' ? 'active' : ''}`} onClick={() => setPeriod('monthly')}>{t('monthly') || 'Monthly'}</button>
        <button className={`tab ${period === 'annual' ? 'active' : ''}`} onClick={() => setPeriod('annual')}>{t('yearly') || 'Yearly'}</button>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: '#6C757D', fontSize: '0.85rem' }}>Loading…</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {plans.map(plan => (
            <div key={plan.id} className="card" onClick={() => setSelectedTier(plan.id)} style={{
              padding: 20, cursor: 'pointer', position: 'relative',
              border: selectedTier === plan.id ? '2px solid #D4AF37' : '1.5px solid rgba(212,175,55,0.08)',
              boxShadow: selectedTier === plan.id ? '0 4px 20px rgba(212,175,55,0.15)' : undefined,
            }}>
              {'badge' in plan && plan.badge && (
                <div style={{ position: 'absolute', top: -1, right: 16, background: 'var(--gold-gradient)', color: 'white', padding: '3px 12px', borderRadius: '0 0 8px 8px', fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.05em' }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: plan.id === 'free' ? 'rgba(108,117,125,0.1)' : 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{plan.icon}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#212529', marginBottom: 2 }}>{plan.name}</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: 800, color: plan.color, margin: 0 }}>{plan.price}</p>
                </div>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%',
                  border: selectedTier === plan.id ? 'none' : '2px solid #CED4DA',
                  background: selectedTier === plan.id ? 'var(--gold-gradient)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {selectedTier === plan.id && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
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
      )}

      {status && (
        <div style={{ background: status.toLowerCase().includes('complete') || status.toLowerCase().includes('restored') ? '#F0F7F0' : '#FFF3E0', border: `1px solid ${status.toLowerCase().includes('complete') ? '#C8E6C9' : '#FFCC80'}`, borderRadius: 12, padding: '10px 14px', marginBottom: 16, fontSize: '0.82rem', color: '#495057' }}>
          {status}
        </div>
      )}

      <button
        className="btn btn-gold btn-full btn-lg"
        style={{ marginTop: 8, marginBottom: 12 }}
        disabled={busy || isCurrent || selectedTier === 'free'}
        onClick={handlePurchase}
      >
        {busy ? '…' : isCurrent ? (t('current_plan') || 'Current Plan') : selectedTier === 'free' ? (t('current_plan') || 'Current Plan') : (t('subscribe') || 'Subscribe')}
      </button>

      <button onClick={handleRestore} disabled={busy} style={{ background: 'none', border: 'none', width: '100%', color: '#6C757D', fontSize: '0.82rem', cursor: 'pointer' }}>
        {t('restore_purchases') || 'Restore Purchases'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '0.68rem', color: '#ADB5BD', marginTop: 12, lineHeight: 1.5, paddingBottom: 40 }}>
        {t('subscription_terms_long') || 'Cancel anytime. No charge during trial period. Subscription auto-renews unless cancelled 24 hours before the end of the current period.'}
      </p>

      <BottomNav />
    </div>
  );
};

export default SubscriptionPage;
