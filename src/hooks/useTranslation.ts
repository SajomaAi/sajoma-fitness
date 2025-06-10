import { useState, useEffect } from 'react';
import translations from '../lib/translations.json';

type Language = 'en' | 'es'; // Extended to include Spanish

interface Translations {
  [key: string]: { [key: string]: string };
}

const loadedTranslations: Translations = translations;

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('oleva-language') as Language;
    return savedLanguage && ['en', 'es'].includes(savedLanguage) ? savedLanguage : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('oleva-language', language);
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }) => {
    let text = loadedTranslations[language][key];
    if (!text) {
      console.warn(`Translation key '${key}' not found for language '${language}'`);
      // Fallback to English if translation is missing
      text = loadedTranslations['en'][key] || key;
    }

    if (replacements) {
      for (const placeholder in replacements) {
        text = text.replace(`{${placeholder}}`, String(replacements[placeholder]));
      }
    }
    return text;
  };

  const changeLanguage = (newLang: Language) => {
    setLanguage(newLang);
  };

  return { t, language, changeLanguage };
};

