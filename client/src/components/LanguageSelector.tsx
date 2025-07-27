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
        className={`w-16 h-16 rounded-full overflow-hidden border-3 transition-all shadow-lg ${
          currentLanguage === 'nl' 
            ? 'border-white scale-110 shadow-xl' 
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
        className={`w-16 h-16 rounded-full overflow-hidden border-3 transition-all shadow-lg ${
          currentLanguage === 'en' 
            ? 'border-white scale-110 shadow-xl' 
            : 'border-gray-300 hover:border-white hover:scale-105'
        }`}
        title="English"
      >
        <svg viewBox="0 0 60 60" className="w-full h-full">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="30" cy="30" r="30"/>
            </clipPath>
          </defs>
          
          <g clipPath="url(#circle-clip)">
            {/* Blue background */}
            <rect width="60" height="60" fill="#012169"/>
            
            {/* White diagonal stripes (St. Andrew's Cross) */}
            <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="6"/>
            
            {/* Red diagonal stripes (St. Patrick's Cross) */}
            <path d="M0,0 L60,60" stroke="#C8102E" strokeWidth="3" strokeDasharray="0,6,6,6" strokeDashoffset="3"/>
            <path d="M60,0 L0,60" stroke="#C8102E" strokeWidth="3" strokeDasharray="0,6,6,6" strokeDashoffset="3"/>
            
            {/* White cross (St. George's Cross background) */}
            <path d="M30,0 V60 M0,30 H60" stroke="#fff" strokeWidth="10"/>
            
            {/* Red cross (St. George's Cross) */}
            <path d="M30,0 V60 M0,30 H60" stroke="#C8102E" strokeWidth="6"/>
          </g>
        </svg>
      </button>
    </div>
  );
}