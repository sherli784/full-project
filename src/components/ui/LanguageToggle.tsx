import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
      title={language === 'en' ? 'Switch to Tamil' : 'Switch to English'}
    >
      <Globe className="w-4 h-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-700">
        {language === 'en' ? 'EN' : 'TA'}
      </span>
    </button>
  );
};
