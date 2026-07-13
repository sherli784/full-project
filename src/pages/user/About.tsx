import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

export const About = () => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t.about.title}</h1>
        <p className="text-xl text-gray-500">{t.about.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&q=80&w=800" 
            alt="Our Store" 
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.about.ourStory}</h2>
          <p className="text-gray-600 leading-relaxed">
            {t.about.story1}
          </p>
          <p className="text-gray-600 leading-relaxed">
            {t.about.story2}
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">{t.about.whyChooseUs}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-bold mb-2">{t.about.premiumQuality}</h3>
            <p className="text-sm text-gray-500">{t.about.premiumQualityDesc}</p>
          </div>
          <div>
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-bold mb-2">{t.about.fastDelivery}</h3>
            <p className="text-sm text-gray-500">{t.about.fastDeliveryDesc}</p>
          </div>
          <div>
            <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="font-bold mb-2">{t.about.securePayments}</h3>
            <p className="text-sm text-gray-500">{t.about.securePaymentsDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
