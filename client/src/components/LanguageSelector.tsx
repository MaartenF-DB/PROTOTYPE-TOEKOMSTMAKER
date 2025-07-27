import { useState } from 'react';

interface LanguageSelectorProps {
  onLanguageChange: (language: 'nl' | 'en') => void;
  currentLanguage: 'nl' | 'en';
}

export function LanguageSelector({ onLanguageChange, currentLanguage }: LanguageSelectorProps) {
  return (
    <div className="fixed bottom-12 right-12 flex space-x-2 z-50 language-selector">
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
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <defs>
            <clipPath id="circle">
              <circle cx="24" cy="24" r="24"/>
            </clipPath>
          </defs>
          
          <g clipPath="url(#circle)">
            {/* Blue background */}
            <rect width="48" height="48" fill="#012169"/>
            
            {/* White diagonal stripes (St. Andrew's Cross) */}
            <path d="M0,0 L48,48 M48,0 L0,48" stroke="#fff" strokeWidth="5"/>
            
            {/* Red diagonal stripes (St. Patrick's Cross) */}
            <path d="M0,0 L48,48 M48,0 L0,48" stroke="#C8102E" strokeWidth="2"/>
            
            {/* White cross (St. George's Cross background) */}
            <path d="M24,0 V48 M0,24 H48" stroke="#fff" strokeWidth="8"/>
            
            {/* Red cross (St. George's Cross) */}
            <path d="M24,0 V48 M0,24 H48" stroke="#C8102E" strokeWidth="5"/>
          </g>
        </svg>
      </button>
    </div>
  );
}