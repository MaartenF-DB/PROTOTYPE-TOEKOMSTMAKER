import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FortuneTellerThemeProps {
  language?: 'nl' | 'en';
  children: React.ReactNode;
}

// Fortune Teller mystical elements - stars and dots background
const MysticalParticles = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {/* Animated stars background */}
    {Array.from({ length: 12 }).map((_, i) => {
      const stars = ['⭐', '✨', '🌟', '💫'];
      const star = stars[i % stars.length];
      return (
        <div
          key={`star-${i}`}
          className="absolute text-yellow-400 opacity-60 animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${0.8 + Math.random() * 1}rem`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        >
          {star}
        </div>
      );
    })}
    
    {/* Small dots */}
    {Array.from({ length: 20 }).map((_, i) => (
      <div
        key={`dot-${i}`}
        className="absolute w-1 h-1 bg-yellow-300 rounded-full opacity-40 animate-pulse"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 4}s`,
          animationDuration: `${3 + Math.random() * 3}s`
        }}
      />
    ))}
  </div>
);

const CrystalBall = ({ size = 'normal' }: { size?: 'small' | 'normal' | 'large' }) => {
  const sizeClasses = {
    small: 'w-16 h-16',
    normal: 'w-24 h-24', 
    large: 'w-32 h-32'
  };

  return (
    <div className={`${sizeClasses[size]} relative mx-auto mb-6`}>
      <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 shadow-2xl animate-pulse">
        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-white/30 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/50 rounded-full blur-sm"></div>
      </div>
    </div>
  );
};

export function FortuneTellerTheme({ language = 'nl', children }: FortuneTellerThemeProps) {
  const [showMysticalEffect, setShowMysticalEffect] = useState(false);

  useEffect(() => {
    // Add mystical atmosphere on mount
    setShowMysticalEffect(true);
    
    // Apply fortune teller CSS variables
    document.documentElement.style.setProperty('--fortune-primary', '#4c1d95'); // Deep purple
    document.documentElement.style.setProperty('--fortune-secondary', '#7c3aed'); // Royal purple  
    document.documentElement.style.setProperty('--fortune-accent', '#fbbf24'); // Mystical gold
    document.documentElement.style.setProperty('--fortune-mystical', '#8b5cf6'); // Magical purple
    document.documentElement.style.setProperty('--fortune-dark', '#1e1b4b'); // Dark mystical
    
    return () => {
      setShowMysticalEffect(false);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Mystical Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {/* Animated constellation background */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stars" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="1" fill="white" opacity="0.8">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
                </circle>
                <circle cx="50" cy="40" r="1.5" fill="gold" opacity="0.6">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur="4s" repeatCount="indefinite"/>
                </circle>
                <circle cx="150" cy="30" r="1" fill="white" opacity="0.7">
                  <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
                </circle>
                <circle cx="120" cy="80" r="1" fill="lightblue" opacity="0.5">
                  <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3.5s" repeatCount="indefinite"/>
                </circle>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars)"/>
          </svg>
        </div>
      </div>

      {/* Mystical Particles */}
      {showMysticalEffect && <MysticalParticles />}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Fortune Teller Ambiance Elements */}
      <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-5">
        {/* Mystical mist/fog effect */}
        <div className="h-32 bg-gradient-to-t from-purple-900/30 to-transparent backdrop-blur-sm"></div>
      </div>
    </div>
  );
}