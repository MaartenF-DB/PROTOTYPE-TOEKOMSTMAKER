import { useState, useEffect } from 'react';

interface FortuneTellerCharacterProps {
  language?: 'nl' | 'en';
  size?: 'small' | 'normal' | 'large';
  mood?: 'welcoming' | 'mystical' | 'wise' | 'encouraging';
  showAnimation?: boolean;
}

export function FortuneTellerCharacter({ 
  language = 'nl', 
  size = 'normal',
  mood = 'mystical',
  showAnimation = true 
}: FortuneTellerCharacterProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const sizeClasses = {
    small: 'w-24 h-24',
    normal: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const messages = {
    welcoming: {
      nl: "Welkom, kind van het licht...",
      en: "Welcome, child of light..."
    },
    mystical: {
      nl: "De kristallen bollen fluisteren geheimen...",
      en: "The crystal balls whisper secrets..."
    },
    wise: {
      nl: "De sterren hebben me over jou verteld...",
      en: "The stars have told me about you..."
    },
    encouraging: {
      nl: "Jouw toekomst straalt helder...",
      en: "Your future shines bright..."
    }
  };

  return (
    <div className={`relative flex flex-col items-center ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Fortune Teller Figure */}
      <div className={`${sizeClasses[size]} relative mb-4`}>
        {/* Main character circle with mystical glow */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-400 via-indigo-500 to-purple-600 shadow-2xl border-4 border-yellow-400">
          {/* Face/Avatar area */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-purple-300/50 to-purple-500/50 flex items-center justify-center">
            <span className="text-4xl">🔮</span>
          </div>
          
          {/* Mystical aura rings */}
          <div className="absolute inset-0 rounded-full border-2 border-yellow-300/30"></div>
          <div className="absolute -inset-2 rounded-full border border-purple-300/20"></div>
        </div>

        {/* Floating mystical elements around character */}
        {showAnimation && (
          <>
            <div className="absolute -top-2 -right-2 text-yellow-400 text-xl">✨</div>
            <div className="absolute -bottom-2 -left-2 text-purple-300 text-lg">🌟</div>
            <div className="absolute top-1/2 -left-4 text-pink-300 text-sm">💫</div>
            <div className="absolute top-1/2 -right-4 text-blue-300 text-sm">⭐</div>
          </>
        )}
      </div>

      {/* Crystal Ball */}
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 shadow-xl">
          <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-white/40 to-transparent"></div>
          <div className="absolute top-3 left-3 w-3 h-3 bg-white/60 rounded-full blur-sm"></div>
        </div>
      </div>

      {/* Fortune Teller's mystical accessories */}
      <div className="flex space-x-2 mb-3">
        <span className="text-yellow-400 text-sm">🕯️</span>
        <span className="text-purple-400 text-sm">🧿</span>
        <span className="text-pink-400 text-sm">🌙</span>
      </div>

      {/* Mystical message */}
      <div className="text-center max-w-xs">
        <p className="text-yellow-300 text-sm font-medium italic">
          {messages[mood][language]}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mt-2"></div>
      </div>

      {/* Ambient glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 to-transparent blur-xl -z-10"></div>
    </div>
  );
}

// Mystical decorative elements that can be used throughout the app
export function MysticalBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 rounded-lg animate-pulse"></div>
      <div className="relative bg-black/20 backdrop-blur-sm border border-purple-400/30 rounded-lg p-6">
        {children}
      </div>
      {/* Corner decorations */}
      <div className="absolute -top-1 -left-1 text-yellow-400 text-xs">✦</div>
      <div className="absolute -top-1 -right-1 text-yellow-400 text-xs">✦</div>
      <div className="absolute -bottom-1 -left-1 text-yellow-400 text-xs">✦</div>
      <div className="absolute -bottom-1 -right-1 text-yellow-400 text-xs">✦</div>
    </div>
  );
}

export function MysticalCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Mystical background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-900/80"></div>
      
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 text-xs opacity-60 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          >
            ✦
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 border border-purple-400/30 rounded-lg backdrop-blur-sm">
        {children}
      </div>

      {/* Mystical glow border */}
      <div className="absolute inset-0 rounded-lg border border-yellow-400/20 animate-pulse"></div>
    </div>
  );
}