import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language, translations } from '../lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: typeof translations.en;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => {
      const newLanguage = prev === 'en' ? 'ta' : 'en';
      // Store language preference in localStorage
      localStorage.setItem('language', newLanguage);
      console.log('Language toggled from', prev, 'to', newLanguage);
      return newLanguage;
    });
  };

  // Load language preference from localStorage on mount
  React.useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    console.log('Loading saved language from localStorage:', savedLanguage);
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ta')) {
      setLanguage(savedLanguage);
      console.log('Set language to:', savedLanguage);
    }
  }, []);

  const t = translations[language];
  
  // Debug: Log translations being loaded
  console.log('LanguageContext - language:', language);
  console.log('LanguageContext - translations[language]:', translations[language]);
  console.log('LanguageContext - t.orders:', t?.orders);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
