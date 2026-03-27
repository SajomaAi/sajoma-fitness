/**
 * Capacitor Native Bridge Utilities
 * 
 * This module provides platform-aware wrappers around Capacitor plugins
 * for camera access, push notifications, haptics, and other native features.
 * Falls back gracefully to web APIs when running in a browser.
 */

import { Capacitor } from '@capacitor/core';

// ============================================================
// Platform Detection
// ============================================================

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): string => {
  return Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
};

// ============================================================
// Camera Utilities
// ============================================================

export interface CameraPhoto {
  dataUrl: string;
  format: string;
}

/**
 * Take a photo using the native camera (iOS) or file input fallback (web).
 */
export const takePhoto = async (): Promise<CameraPhoto | null> => {
  if (isNativePlatform()) {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        correctOrientation: true,
        width: 1024,
        height: 1024,
      });
      return {
        dataUrl: image.dataUrl || '',
        format: image.format,
      };
    } catch (error) {
      console.error('Camera error:', error);
      return null;
    }
  }
  // Web fallback - return null and let the component handle file input
  return null;
};

/**
 * Pick a photo from the gallery using native picker (iOS) or file input fallback (web).
 */
export const pickFromGallery = async (): Promise<CameraPhoto | null> => {
  if (isNativePlatform()) {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        correctOrientation: true,
        width: 1024,
        height: 1024,
      });
      return {
        dataUrl: image.dataUrl || '',
        format: image.format,
      };
    } catch (error) {
      console.error('Gallery error:', error);
      return null;
    }
  }
  // Web fallback - return null and let the component handle file input
  return null;
};

// ============================================================
// Push Notifications
// ============================================================

/**
 * Register for push notifications on native platforms.
 */
export const registerPushNotifications = async (): Promise<void> => {
  if (!isNativePlatform()) return;

  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    // Request permission
    const permResult = await PushNotifications.requestPermissions();
    if (permResult.receive === 'granted') {
      // Register with Apple / Google
      await PushNotifications.register();
    }

    // Listen for registration success
    PushNotifications.addListener('registration', (token) => {
      console.log('Push registration success, token:', token.value);
      // Store token for backend use
      localStorage.setItem('pushToken', token.value);
    });

    // Listen for registration errors
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push registration error:', error);
    });

    // Listen for incoming notifications while app is in foreground
    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Push notification received:', notification);
    });

    // Listen for notification tap actions
    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Push notification action performed:', action);
    });
  } catch (error) {
    console.error('Push notification setup error:', error);
  }
};

// ============================================================
// Haptics
// ============================================================

/**
 * Trigger a light haptic feedback.
 */
export const hapticLight = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch (error) {
    // Silently fail on web
  }
};

/**
 * Trigger a medium haptic feedback.
 */
export const hapticMedium = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch (error) {
    // Silently fail on web
  }
};

/**
 * Trigger a success notification haptic.
 */
export const hapticSuccess = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { Haptics, NotificationType } = await import('@capacitor/haptics');
    await Haptics.notification({ type: NotificationType.Success });
  } catch (error) {
    // Silently fail on web
  }
};

// ============================================================
// Status Bar
// ============================================================

/**
 * Configure the iOS status bar appearance.
 */
export const configureStatusBar = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar');
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setOverlaysWebView({ overlay: false });
  } catch (error) {
    console.error('Status bar config error:', error);
  }
};

// ============================================================
// Keyboard
// ============================================================

/**
 * Set up keyboard listeners for iOS to handle viewport adjustments.
 */
export const setupKeyboardListeners = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { Keyboard } = await import('@capacitor/keyboard');

    Keyboard.addListener('keyboardWillShow', (info) => {
      document.body.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
      document.body.classList.add('keyboard-visible');
    });

    Keyboard.addListener('keyboardWillHide', () => {
      document.body.style.setProperty('--keyboard-height', '0px');
      document.body.classList.remove('keyboard-visible');
    });
  } catch (error) {
    console.error('Keyboard setup error:', error);
  }
};

// ============================================================
// App Lifecycle
// ============================================================

/**
 * Set up app lifecycle listeners (resume, pause, back button).
 */
export const setupAppListeners = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { App } = await import('@capacitor/app');

    App.addListener('appStateChange', ({ isActive }) => {
      console.log('App state changed. Is active?', isActive);
    });

    App.addListener('appUrlOpen', (data) => {
      console.log('App opened with URL:', data.url);
      // Handle deep links here
    });

    // Handle hardware back button on Android (no-op on iOS but safe to register)
    App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      }
    });
  } catch (error) {
    console.error('App lifecycle setup error:', error);
  }
};

// ============================================================
// Share
// ============================================================

/**
 * Share content using the native share sheet.
 */
export const shareContent = async (title: string, text: string, url?: string): Promise<void> => {
  if (isNativePlatform()) {
    try {
      const { Share } = await import('@capacitor/share');
      await Share.share({ title, text, url, dialogTitle: 'Share via' });
    } catch (error) {
      console.error('Share error:', error);
    }
  } else if (navigator.share) {
    // Web Share API fallback
    try {
      await navigator.share({ title, text, url });
    } catch (error) {
      console.error('Web share error:', error);
    }
  }
};

// ============================================================
// Splash Screen
// ============================================================

/**
 * Hide the native splash screen.
 */
export const hideSplashScreen = async (): Promise<void> => {
  if (!isNativePlatform()) return;
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 300 });
  } catch (error) {
    console.error('Splash screen error:', error);
  }
};

// ============================================================
// Initialize All Native Features
// ============================================================

/**
 * Initialize all Capacitor native features. Call this once at app startup.
 */
export const initializeNativeFeatures = async (): Promise<void> => {
  if (!isNativePlatform()) {
    console.log('Running on web platform - native features disabled');
    return;
  }

  console.log(`Running on ${getPlatform()} platform - initializing native features`);

  await configureStatusBar();
  await setupKeyboardListeners();
  await setupAppListeners();
  await registerPushNotifications();

  // Hide splash screen after a short delay to ensure the app is rendered
  setTimeout(() => {
    hideSplashScreen();
  }, 500);
};
