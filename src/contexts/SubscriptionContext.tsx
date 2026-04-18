import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import type { CustomerInfo, PurchasesOffering, PurchasesPackage } from '@revenuecat/purchases-capacitor';
import {
  configurePurchases,
  fetchCustomerInfo,
  getCurrentOffering,
  isNative,
  isPremiumTier,
  linkUser,
  purchasePackage,
  restorePurchases,
  tierFromCustomerInfo,
  type Tier,
} from '../lib/revenueCat';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionContextValue {
  tier: Tier;
  isPremium: boolean;
  customerInfo: CustomerInfo | null;
  offering: PurchasesOffering | null;
  loading: boolean;
  purchaseAvailable: boolean;
  refresh: () => Promise<void>;
  purchase: (pkg: PurchasesPackage) => Promise<{ ok: boolean; cancelled?: boolean; error?: string }>;
  restore: () => Promise<{ ok: boolean; error?: string }>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  const tier = tierFromCustomerInfo(customerInfo);
  const isPremium = isPremiumTier(tier);
  const purchaseAvailable = configured && isNative();

  // Mirror tier to profile so RLS-gated server-side checks can use it.
  const syncTierToProfile = useCallback(async (nextTier: Tier) => {
    if (!user) return;
    await supabase.from('profiles').update({ subscription_tier: nextTier }).eq('id', user.id);
  }, [user]);

  const refresh = useCallback(async () => {
    if (!configured) { setLoading(false); return; }
    const [info, off] = await Promise.all([fetchCustomerInfo(), getCurrentOffering()]);
    setCustomerInfo(info);
    setOffering(off);
    await syncTierToProfile(tierFromCustomerInfo(info));
    setLoading(false);
  }, [configured, syncTierToProfile]);

  // Configure once — when user is known
  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const apiKey = import.meta.env.VITE_REVENUECAT_IOS_KEY;
    (async () => {
      const ok = await configurePurchases(apiKey, user.id);
      setConfigured(ok);
      if (!ok) setLoading(false);
    })();
  }, [user]);

  // Link user when auth state changes after configure
  useEffect(() => {
    if (!configured) return;
    linkUser(user?.id ?? null);
  }, [user, configured]);

  // Load data once configured
  useEffect(() => {
    if (configured) refresh();
  }, [configured, refresh]);

  const purchase = useCallback(async (pkg: PurchasesPackage) => {
    const result = await purchasePackage(pkg);
    if (result.ok) {
      setCustomerInfo(result.customerInfo ?? null);
      await syncTierToProfile(tierFromCustomerInfo(result.customerInfo ?? null));
    }
    return { ok: result.ok, cancelled: result.cancelled, error: result.error };
  }, [syncTierToProfile]);

  const restore = useCallback(async () => {
    const result = await restorePurchases();
    if (result.ok) {
      setCustomerInfo(result.customerInfo ?? null);
      await syncTierToProfile(tierFromCustomerInfo(result.customerInfo ?? null));
    }
    return { ok: result.ok, error: result.error };
  }, [syncTierToProfile]);

  const value: SubscriptionContextValue = {
    tier,
    isPremium,
    customerInfo,
    offering,
    loading,
    purchaseAvailable,
    refresh,
    purchase,
    restore,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error('useSubscription must be used within SubscriptionProvider');
  return ctx;
}
