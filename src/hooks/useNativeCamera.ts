/**
 * Custom hook for native camera integration via Capacitor.
 * Falls back to web file input when running in browser.
 */

import { useState, useCallback } from 'react';
import { takePhoto, pickFromGallery, isNativePlatform, hapticMedium, hapticSuccess } from '../lib/capacitor';

interface UseNativeCameraResult {
  capturedImage: string | null;
  isCapturing: boolean;
  error: string | null;
  handleNativeCapture: () => Promise<boolean>;
  handleNativeGallery: () => Promise<boolean>;
  setCapturedImage: (image: string | null) => void;
  isNative: boolean;
}

/**
 * Hook that provides native camera and gallery access on iOS,
 * with graceful fallback to web file input.
 */
export const useNativeCamera = (): UseNativeCameraResult => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNative = isNativePlatform();

  const handleNativeCapture = useCallback(async (): Promise<boolean> => {
    if (!isNative) return false; // Signal to use web fallback

    setIsCapturing(true);
    setError(null);
    await hapticMedium();

    try {
      const photo = await takePhoto();
      if (photo && photo.dataUrl) {
        setCapturedImage(photo.dataUrl);
        await hapticSuccess();
        setIsCapturing(false);
        return true;
      }
      setIsCapturing(false);
      return false;
    } catch (err) {
      setError('Failed to capture photo. Please try again.');
      setIsCapturing(false);
      return false;
    }
  }, [isNative]);

  const handleNativeGallery = useCallback(async (): Promise<boolean> => {
    if (!isNative) return false; // Signal to use web fallback

    setIsCapturing(true);
    setError(null);
    await hapticMedium();

    try {
      const photo = await pickFromGallery();
      if (photo && photo.dataUrl) {
        setCapturedImage(photo.dataUrl);
        await hapticSuccess();
        setIsCapturing(false);
        return true;
      }
      setIsCapturing(false);
      return false;
    } catch (err) {
      setError('Failed to pick photo. Please try again.');
      setIsCapturing(false);
      return false;
    }
  }, [isNative]);

  return {
    capturedImage,
    isCapturing,
    error,
    handleNativeCapture,
    handleNativeGallery,
    setCapturedImage,
    isNative,
  };
};
