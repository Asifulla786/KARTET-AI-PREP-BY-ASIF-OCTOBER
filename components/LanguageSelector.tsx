import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  disabled?: boolean;
}

const LANGUAGES: { id: Language; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'ur', name: 'اردو' },
  { id: 'kn', name: 'ಕನ್ನಡ' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguage, onSelect, disabled = false }) => {
  return (
    <div className="flex flex-wrap gap-3">
      {LANGUAGES.map(lang => (
        <button
          key={lang.id}
          onClick={() => onSelect(lang.id)}
          disabled={disabled}
          className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5
            ${
              selectedLanguage === lang.id
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg focus:ring-sky-300'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 focus:ring-sky-500'
            }
            ${lang.id === 'ur' ? 'font-nastaleeq text-lg' : 'font-sans'}`
        }
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;