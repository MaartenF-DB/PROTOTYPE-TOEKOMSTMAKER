import { useState } from 'react';

interface LanguageSelectorProps {
  onLanguageChange: (language: 'nl' | 'en') => void;
  currentLanguage: 'nl' | 'en';
}

export function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-4 z-50">
      <button
        onClick={() => onLanguageChange('nl')}
        className={`language-button border-4 transition-all shadow-xl ${
          currentLanguage === 'nl' 
            ? 'border-white scale-110 shadow-2xl' 
            : 'border-gray-300 hover:border-white hover:scale-105'
        }`}
        title="Nederlands"
      >
        <div className="w-full h-full flex flex-col rounded-full overflow-hidden">
          <div className="w-full flex-1 bg-red-600"></div>
          <div className="w-full flex-1 bg-white"></div>
          <div className="w-full flex-1 bg-blue-600"></div>
        </div>
      </button>
      
      <button
        onClick={() => onLanguageChange('en')}
        className={`language-button border-4 transition-all shadow-xl ${
          currentLanguage === 'en' 
            ? 'border-white scale-110 shadow-2xl' 
            : 'border-gray-300 hover:border-white hover:scale-105'
        }`}
        title="English"
      >
        <div className="w-full h-full rounded-full overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full" style={{ display: 'block' }}>
            <defs>
              <clipPath id="circle-flag">
                <circle cx="50" cy="50" r="50"/>
              </clipPath>
            </defs>
            
            <g clipPath="url(#circle-flag)">
              {/* Blue background */}
              <rect width="100" height="100" fill="#012169"/>
              
              {/* White diagonal stripes (St. Andrew's Cross) */}
              <path d="M0,0 L100,100 M100,0 L0,100" stroke="#fff" strokeWidth="8"/>
              
              {/* Red diagonal stripes (St. Patrick's Cross) */}
              <path d="M0,0 L100,100" stroke="#C8102E" strokeWidth="4"/>
              <path d="M100,0 L0,100" stroke="#C8102E" strokeWidth="4"/>
              
              {/* White cross (St. George's Cross background) */}
              <path d="M50,0 V100 M0,50 H100" stroke="#fff" strokeWidth="16"/>
              
              {/* Red cross (St. George's Cross) */}
              <path d="M50,0 V100 M0,50 H100" stroke="#C8102E" strokeWidth="10"/>
            </g>
          </svg>
        </div>
      </button>
    </div>
  );
}