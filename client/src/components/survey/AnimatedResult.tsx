import { useState, useEffect, useRef } from 'react';
import { TOPICS } from '@/types/survey';

interface AnimatedResultProps {
  finalResult: string;
  onComplete: () => void;
}

// Shuffle function
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function AnimatedResult({ finalResult, onComplete }: AnimatedResultProps) {
  const [currentIcon, setCurrentIcon] = useState('🔮');
  const [currentColor, setCurrentColor] = useState('#6366f1');
  const [timeRemaining, setTimeRemaining] = useState(10);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const startedRef = useRef(false);

  const topicKeys = Object.keys(TOPICS);
  const icons = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].icon);
  const colors = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].hexColor);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    
    console.log('🔮 FORTUNE TELLER ANIMATION STARTED - 10 SECONDS COUNTDOWN');
    
    // Animation loop
    intervalRef.current = setInterval(() => {
      const shuffledIcons = shuffleArray(icons);
      const shuffledColors = shuffleArray(colors);
      setCurrentIcon(shuffledIcons[0]);
      setCurrentColor(shuffledColors[0]);
    }, 100);

    // Countdown timer
    countdownRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1;
        console.log(`⏰ Countdown: ${next} seconds remaining`);
        
        // Complete when reaching 0
        if (next <= 0) {
          console.log('🚀 ANIMATION COMPLETING');
          
          // Clear intervals immediately
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          
          // Call completion callback after a brief delay
          setTimeout(() => {
            console.log('📞 CALLING onComplete()');
            onComplete();
          }, 100);
          
          return 0; // Don't go negative
        }
        
        return next;
      });
    }, 1000);

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up animation timers');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative">
      <div className="text-center max-w-2xl w-full relative z-10">
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-pulse">
            🔮 De waarzegger onthult je persoonlijkheid...
          </h2>
          <div className="text-2xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {timeRemaining} seconden
          </div>
          
          <div className="relative mb-8">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-2xl border-4 border-yellow-400 border-opacity-50"
              style={{ 
                backgroundColor: currentColor,
                transform: 'scale(1.1)',
                boxShadow: `0 0 40px ${currentColor}60, 0 0 20px rgba(255, 215, 0, 0.3)`
              }}
            >
              <span className="text-6xl animate-pulse">{currentIcon}</span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-40 w-40 border-t-2 border-b-2 border-yellow-400 border-opacity-50"></div>
            </div>
          </div>

          <div className="text-sm opacity-75 text-yellow-200">
            Wacht alsjeblieft... De waarzegger werkt zijn magie...
          </div>
        </div>
      </div>
      
      {/* Reduced background stars for less distraction */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        {Array.from({ length: 6 }).map((_, i) => {
          const stars = ['⭐', '✨', '🌟', '💫'];
          const star = stars[i % stars.length];
          return (
            <div
              key={`star-${i}`}
              className="absolute text-yellow-400 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${0.8 + Math.random() * 0.5}rem`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`
              }}
            >
              {star}
            </div>
          );
        })}
      </div>
    </div>
  );
}