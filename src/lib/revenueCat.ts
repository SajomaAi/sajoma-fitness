// Thin wrapper around @revenuecat/purchases-capacitor.
// On web the plugin throws because there's no native bridge — we catch and no-op.
// Purchases are iOS-only in this app; web users see a "Download iOS app" state.

import { Capacitor } from '@capacitor/core';
import {
  Purchases,
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from '@revenuecat/purchases-capacitor';

// Entitlement identifiers you configure in RevenueCat dashboard.
// Map to app logic (isPremium = any of these active).
export const ENTITLEMENTS = {
  basic: 'basic_premium',
  full: 'full_premium',
} as const;

export type Tier = 'free' | 'basic_premium' | 'full_premium';

export const isNative = () => Capacitor.isNativePlatform();

let configured = false;
let configuring: Promise<boolean> | null = null;

export async function configurePurchases(apiKey: string | undefined, appUserID?: string | null): Promise<boolean> {
  if (!isNative()) return false;
  if (!apiKey) return false;
  if (configured) {
    if (appUserID) {
      try { await Purchases.logIn({ appUserID }); } catch { /* non-fatal */ }
    }
    return true;
  }
  if (configuring) return configuring;

  configuring = (async () => {
    try {
      await Purchases.setLogLevel({ level: LOG_LEVEL.WARN });
      await Purchases.configure({ apiKey, appUserID: appUserID ?? undefined });
      configured = true;
      return true;
    } catch {
      configured = false;
      return false;
    } finally {
      configuring = null;
    }
  })();

  return configuring;
}

export async function linkUser(appUserID: string | null): Promise<void> {
  if (!isNative() || !configured) return;
  try {
    if (appUserID) await Purchases.logIn({ appUserID });
    else await Purchases.logOut();
  } catch { /* non-fatal */ }
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!isNative() || !configured) return null;
  try {
    const res = await Purchases.getOfferings();
    return res.current ?? null;
  } catch {
    return null;
  }
}

export async function purchasePackage(pkg: PurchasesPackage): Promise<{ ok: boolean; cancelled?: boolean; error?: string; customerInfo?: CustomerInfo }> {
  if (!isNative() || !configured) return { ok: false, error: 'Purchases not available on this platform' };
  try {
    const result = await Purchases.purchasePackage({ aPackage: pkg });
    return { ok: true, customerInfo: result.customerInfo };
  } catch (e) {
    const err = e as { code?: string; message?: string; userCancelled?: boolean };
    if (err.userCancelled) return { ok: false, cancelled: true };
    return { ok: false, error: err.message ?? 'Purchase failed' };
  }
}

export async function restorePurchases(): Promise<{ ok: boolean; customerInfo?: CustomerInfo; error?: string }> {
  if (!isNative() || !configured) return { ok: false, error: 'Restore not available on this platform' };
  try {
    const result = await Purchases.restorePurchases();
    return { ok: true, customerInfo: result.customerInfo };
  } catch (e) {
    return { ok: false, error: (e as Error).message ?? 'Restore failed' };
  }
}

export async function fetchCustomerInfo(): Promise<CustomerInfo | null> {
  if (!isNative() || !configured) return null;
  try {
    const res = await Purchases.getCustomerInfo();
    return res.customerInfo;
  } catch {
    return null;
  }
}

export function tierFromCustomerInfo(info: CustomerInfo | null): Tier {
  if (!info) return 'free';
  const active = info.entitlements?.active ?? {};
  if (active[ENTITLEMENTS.full]) return 'full_premium';
  if (active[ENTITLEMENTS.basic]) return 'basic_premium';
  return 'free';
}

export function isPremiumTier(tier: Tier): boolean {
  return tier === 'basic_premium' || tier === 'full_premium';
}
