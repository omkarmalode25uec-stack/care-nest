import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function LanguageSelector({ variant = 'desktop' }) {
  const { language, setLanguage, languages } = useTranslation();

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              language === l.code
                ? 'bg-white text-orange-600 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {l.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:border-gray-300 transition-colors">
        <Globe className="w-3.5 h-3.5 text-orange-600 shrink-0" />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-transparent border-none outline-none text-xs font-bold text-gray-800 cursor-pointer pr-1"
          aria-label="Select Language"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.native} ({l.label})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
