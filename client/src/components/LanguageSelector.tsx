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
        <div className="w-full h-full relative bg-blue-800">
          <div className="absolute inset-0 bg-blue-800"></div>
          <div className="absolute top-0 left-0 w-full h-1/6 bg-white"></div>
          <div className="absolute top-1/6 left-0 w-full h-1/6 bg-red-600"></div>
          <div className="absolute top-2/6 left-0 w-full h-1/6 bg-white"></div>
          <div className="absolute top-3/6 left-0 w-full h-1/6 bg-red-600"></div>
          <div className="absolute top-4/6 left-0 w-full h-1/6 bg-white"></div>
          <div className="absolute top-5/6 left-0 w-full h-1/6 bg-red-600"></div>
          <div className="absolute top-0 left-0 w-2/5 h-2/5 bg-blue-800"></div>
          <div className="absolute top-1/12 left-1/12 w-1/6 h-1/6 bg-white text-xs flex items-center justify-center">★</div>
        </div>
      </button>
    </div>
  );
}