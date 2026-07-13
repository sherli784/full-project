import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Help = () => {
  const { t } = useLanguage();
  
  const faqs = [
    {
      question: t.help.faqs.trackOrderQuestion,
      answer: t.help.faqs.trackOrderAnswer
    },
    {
      question: t.help.faqs.paymentMethodsQuestion,
      answer: t.help.faqs.paymentMethodsAnswer
    },
    {
      question: t.help.faqs.returnPolicyQuestion,
      answer: t.help.faqs.returnPolicyAnswer
    },
    {
      question: t.help.faqs.internationalShippingQuestion,
      answer: t.help.faqs.internationalShippingAnswer
    },
    {
      question: t.help.faqs.contactSupportQuestion,
      answer: t.help.faqs.contactSupportAnswer
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.help.title}</h1>
        <p className="text-gray-500">{t.help.subtitle}</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 rounded-xl p-8 text-center">
        <h3 className="font-bold text-indigo-900 mb-2">{t.help.stillNeedHelp}</h3>
        <p className="text-indigo-700 mb-6">{t.help.supportTeam}</p>
        <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors">
          {t.help.contactSupport}
        </button>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
      <button 
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-gray-600 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};
