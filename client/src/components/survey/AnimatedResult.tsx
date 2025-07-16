import { useState, useEffect } from 'react';
import { TOPICS } from '@/types/survey';

interface AnimatedResultProps {
  finalResult: string;
  onComplete: () => void;
}

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
  const [isAnimating, setIsAnimating] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(10);

  const topicKeys = Object.keys(TOPICS);
  const icons = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].icon);
  const colors = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].hexColor);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    console.log('AnimatedResult started - 10 seconds countdown');

    // Animation interval
    interval = setInterval(() => {
      const shuffledIcons = shuffleArray(icons);
      const shuffledColors = shuffleArray(colors);
      setCurrentIcon(shuffledIcons[0]);
      setCurrentColor(shuffledColors[0]);
    }, 100);

    // Countdown timer
    countdownInterval = setInterval(() => {
      setTimeRemaining(prev => {
        const next = prev - 1;
        console.log(`Time remaining: ${next} seconds`);
        return next;
      });
    }, 1000);

    // Complete after 10 seconds
    timeout = setTimeout(() => {
      console.log('AnimatedResult completing after 10 seconds - calling onComplete');
      setIsAnimating(false);
      clearInterval(interval);
      clearInterval(countdownInterval);
      onComplete();
    }, 10000);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      clearTimeout(timeout);
    };
  }, [finalResult, icons, colors, onComplete]);

  const handleSkip = () => {
    console.log('Animation skipped by user');
    setIsAnimating(false);
    onComplete();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8">🔮 De waarzegger onthult je persoonlijkheid...</h2>
          <div className="text-sm opacity-75 mb-4">({timeRemaining} seconden)</div>
          
          <div className="relative mb-8">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-2xl border-4 border-white border-opacity-30"
              style={{ 
                backgroundColor: currentColor,
                transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                boxShadow: isAnimating ? `0 0 40px ${currentColor}60` : `0 0 20px ${currentColor}40`
              }}
            >
              <span className="text-6xl animate-pulse">{currentIcon}</span>
            </div>
            
            {isAnimating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-40 w-40 border-t-2 border-b-2 border-white border-opacity-30"></div>
              </div>
            )}
          </div>

          <button
            onClick={handleSkip}
            className="text-sm opacity-75 hover:opacity-100 underline transition-opacity"
          >
            Klik om over te slaan
          </button>
        </div>
      </div>
    </div>
  );
}