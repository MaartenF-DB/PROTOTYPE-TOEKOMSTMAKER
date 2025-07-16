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
        <div className="w-full h-full relative bg-blue-800 overflow-hidden">
          {/* Blue background */}
          <div className="absolute inset-0 bg-blue-800"></div>
          
          {/* White diagonal stripes (thicker) */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-1 bg-white top-1/2 transform -translate-y-0.5 rotate-45 origin-center"></div>
            <div className="absolute w-full h-1 bg-white top-1/2 transform -translate-y-0.5 -rotate-45 origin-center"></div>
          </div>
          
          {/* Red diagonal stripes (thinner) */}
          <div className="absolute inset-0">
            <div className="absolute w-full h-0.5 bg-red-600 top-1/2 transform -translate-y-0.25 rotate-45 origin-center"></div>
            <div className="absolute w-full h-0.5 bg-red-600 top-1/2 transform -translate-y-0.25 -rotate-45 origin-center"></div>
          </div>
          
          {/* White cross (background) */}
          <div className="absolute w-full h-1.5 bg-white top-1/2 transform -translate-y-0.75"></div>
          <div className="absolute h-full w-1.5 bg-white left-1/2 transform -translate-x-0.75"></div>
          
          {/* Red cross (foreground) */}
          <div className="absolute w-full h-1 bg-red-600 top-1/2 transform -translate-y-0.5"></div>
          <div className="absolute h-full w-1 bg-red-600 left-1/2 transform -translate-x-0.5"></div>
        </div>
      </button>
    </div>
  );
}