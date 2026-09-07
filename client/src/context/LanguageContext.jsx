import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

export const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('kumbhstay_lang') || 'en';
  });

  const setLanguage = (lang) => {
    if (['en', 'hi', 'mr'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('kumbhstay_lang', lang);
    }
  };

  const t = (key, fallback = '') => {
    const langDict = translations[language] || translations.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English if translation key is missing
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    languages: [
      { code: 'en', label: 'English', native: 'English' },
      { code: 'hi', label: 'Hindi', native: 'हिंदी' },
      { code: 'mr', label: 'Marathi', native: 'मराठी' },
    ],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
