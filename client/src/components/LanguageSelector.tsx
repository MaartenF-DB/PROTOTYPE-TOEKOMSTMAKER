import { useState } from 'react';

interface LanguageSelectorProps {
  onLanguageChange: (language: 'nl' | 'en') => void;
  currentLanguage: 'nl' | 'en';
}

export function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  return (
    <div className="fixed bottom-4 right-4 flex space-x-2 z-50">
      <button
        onClick={() => onLanguageChange('nl')}
        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
          currentLanguage === 'nl' 
            ? 'border-white shadow-lg scale-110' 
            : 'border-gray-300 hover:border-white hover:scale-105'
        }`}
        title="Nederlands"
      >
        <div className="w-full h-full flex flex-col">
          <div className="w-full h-1/3 bg-red-600"></div>
          <div className="w-full h-1/3 bg-white"></div>
          <div className="w-full h-1/3 bg-blue-600"></div>
        </div>
      </button>
      
      <button
        onClick={() => onLanguageChange('en')}
        className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
          currentLanguage === 'en' 
            ? 'border-white shadow-lg scale-110' 
            : 'border-gray-300 hover:border-white hover:scale-105'
        }`}
        title="English"
      >
        <svg viewBox="0 0 60 30" className="w-full h-full">
          <defs>
            <clipPath id="flag">
              <rect width="60" height="30"/>
            </clipPath>
          </defs>
          
          {/* Blue background */}
          <rect width="60" height="30" fill="#012169"/>
          
          {/* White diagonal stripes (St. Andrew's Cross) */}
          <g clipPath="url(#flag)">
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
          </g>
          
          {/* Red diagonal stripes (St. Patrick's Cross) */}
          <g clipPath="url(#flag)">
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="2"/>
          </g>
          
          {/* White cross (St. George's Cross background) */}
          <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
          
          {/* Red cross (St. George's Cross) */}
          <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
        </svg>
      </button>
    </div>
  );
}