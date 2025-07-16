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
          {/* Blue background */}
          <rect width="60" height="30" fill="#012169"/>
          
          {/* White diagonals */}
          <g stroke="#fff" strokeWidth="6">
            <path d="m0,0 60,30 m0,-30 L0,30"/>
          </g>
          <g stroke="#fff" strokeWidth="4">
            <path d="m0,0 60,30 m0,-30 L0,30"/>
          </g>
          
          {/* Red diagonals */}
          <g stroke="#C8102E" strokeWidth="2">
            <path d="m0,0 60,30 m0,-30 L0,30"/>
          </g>
          
          {/* White cross */}
          <g stroke="#fff" strokeWidth="10">
            <path d="m30,0 v30 m-30,-15 h60"/>
          </g>
          <g stroke="#fff" strokeWidth="6">
            <path d="m30,0 v30 m-30,-15 h60"/>
          </g>
          
          {/* Red cross */}
          <g stroke="#C8102E" strokeWidth="4">
            <path d="m30,0 v30 m-30,-15 h60"/>
          </g>
        </svg>
      </button>
    </div>
  );
}