'use client';

import { Globe } from 'lucide-react';
import { Language, LANGUAGE_NAMES } from '@marketing-autopilot/shared';
import { useLanguage } from './LanguageContext';

const SUPPORTED_UI_LANGUAGES: Language[] = [
  'LITHUANIAN',
  'ENGLISH',
  'LATVIAN',
  'ESTONIAN',
  'RUSSIAN',
  'POLISH',
  'GERMAN',
  'FRENCH',
  'SPANISH',
  'ITALIAN',
  'PORTUGUESE',
  'DUTCH',
  'SWEDISH',
  'NORWEGIAN',
  'DANISH',
  'FINNISH',
  'CZECH',
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface/50 hover:bg-surface border border-white/10 transition-colors">
        <Globe className="w-4 h-4" />
        <span className="text-sm">{LANGUAGE_NAMES[language]}</span>
      </button>

      <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 max-h-[400px] overflow-y-auto">
        <div className="p-2">
          {SUPPORTED_UI_LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                language === lang
                  ? 'bg-primary text-white'
                  : 'hover:bg-white/5 text-foreground'
              }`}
            >
              {LANGUAGE_NAMES[lang]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
