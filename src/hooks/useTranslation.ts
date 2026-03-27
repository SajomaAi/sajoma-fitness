import { useState, useEffect, useCallback } from 'react';
import translations from '../lib/translations.json';

type Language = 'en' | 'es';

interface Translations {
  [key: string]: { [key: string]: string };
}

const loadedTranslations: Translations = translations;

// Custom event name for cross-component language sync
const LANG_CHANGE_EVENT = 'sajoma-language-change';

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sajoma-language') as Language;
    return saved && ['en', 'es'].includes(saved) ? saved : 'en';
  });

  // Listen for language changes from other components
  useEffect(() => {
    const handleLangChange = (e: Event) => {
      const newLang = (e as CustomEvent<Language>).detail;
      setLanguage(newLang);
    };
    window.addEventListener(LANG_CHANGE_EVENT, handleLangChange);
    return () => window.removeEventListener(LANG_CHANGE_EVENT, handleLangChange);
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    localStorage.setItem('sajoma-language', newLang);
    setLanguage(newLang);
    // Broadcast to all other components using this hook
    window.dispatchEvent(new CustomEvent(LANG_CHANGE_EVENT, { detail: newLang }));
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }) => {
    let text = loadedTranslations[language]?.[key];
    if (!text) {
      // Fallback to English
      text = loadedTranslations['en']?.[key] || key;
    }
    if (replacements) {
      for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return text;
  }, [language]);

  return { t, language, changeLanguage };
};
