import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Palette, X } from 'lucide-react';

type Theme = 'light' | 'dark' | 'blue' | 'purple' | 'green';

interface ThemeOption {
  value: Theme;
  name: string;
  icon: React.ReactNode;
  description: string;
  preview: {
    bg: string;
    text: string;
    border: string;
  };
}

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      name: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: 'Clean and bright interface',
      preview: {
        bg: 'bg-white',
        text: 'text-gray-900',
        border: 'border-gray-200'
      }
    },
    {
      value: 'dark',
      name: 'Dark',
      icon: <Moon className="w-4 h-4" />,
      description: 'Easy on the eyes in low light',
      preview: {
        bg: 'bg-gray-900',
        text: 'text-white',
        border: 'border-gray-700'
      }
    },
    {
      value: 'blue',
      name: 'Blue',
      icon: <Palette className="w-4 h-4 text-blue-600" />,
      description: 'Calming blue tones',
      preview: {
        bg: 'bg-blue-100',
        text: 'text-blue-900',
        border: 'border-blue-300'
      }
    },
    {
      value: 'purple',
      name: 'Purple',
      icon: <Palette className="w-4 h-4 text-purple-600" />,
      description: 'Elegant purple theme',
      preview: {
        bg: 'bg-purple-100',
        text: 'text-purple-900',
        border: 'border-purple-300'
      }
    },
    {
      value: 'green',
      name: 'Green',
      icon: <Palette className="w-4 h-4 text-green-600" />,
      description: 'Fresh green colors',
      preview: {
        bg: 'bg-green-100',
        text: 'text-green-900',
        border: 'border-green-300'
      }
    }
  ];

  const currentTheme = themeOptions.find(option => option.value === theme);

  return (
    <div className="relative">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200 flex items-center gap-2"
        aria-label={`Theme selector (Current: ${currentTheme?.name} Theme)`}
        title={`Current: ${currentTheme?.name} Theme`}
      >
        {currentTheme?.icon}
        <span className="text-sm font-medium hidden sm:inline">{currentTheme?.name}</span>
      </button>

      {/* Theme Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-12 z-50 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Choose Theme</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Select your preferred color theme
              </p>
            </div>

            {/* Theme Options */}
            <div className="p-2">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 mb-2 last:mb-0 ${
                    theme === option.value
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Theme Icon */}
                    <div className={`p-2 rounded-lg ${option.preview.bg} ${option.preview.border}`}>
                      {option.icon}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {option.name} Theme
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>

                    {/* Selected Indicator */}
                    {theme === option.value && (
                      <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>

                  {/* Preview */}
                  <div className="mt-3 flex gap-2">
                    <div className={`flex-1 h-8 rounded ${option.preview.bg} ${option.preview.border} ${option.preview.text} flex items-center justify-center text-xs font-medium`}>
                      Preview
                    </div>
                    <div className={`w-8 h-8 rounded ${option.preview.bg} ${option.preview.border} flex items-center justify-center`}>
                      <div className={`w-4 h-4 rounded ${option.preview.text === 'text-white' ? 'bg-white' : 'bg-gray-900'}`} />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                Your theme preference is saved automatically
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
