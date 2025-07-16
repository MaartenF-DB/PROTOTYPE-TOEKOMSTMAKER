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
  const [showFinal, setShowFinal] = useState(false);

  const topicKeys = Object.keys(TOPICS);
  const icons = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].icon);
  const colors = topicKeys.map(key => TOPICS[key as keyof typeof TOPICS].hexColor);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;

    if (isAnimating) {
      interval = setInterval(() => {
        const shuffledIcons = shuffleArray(icons);
        const shuffledColors = shuffleArray(colors);
        setCurrentIcon(shuffledIcons[0]);
        setCurrentColor(shuffledColors[0]);
      }, 100);

      // Stop animation after 10 seconds and show final result
      timeout = setTimeout(() => {
        setIsAnimating(false);
        clearInterval(interval);
        
        // Show final result
        const finalTopic = TOPICS[finalResult as keyof typeof TOPICS];
        if (finalTopic) {
          setCurrentIcon(finalTopic.icon);
          setCurrentColor(finalTopic.hexColor);
        }
        
        // Show the final result text after a brief delay
        setTimeout(() => {
          setShowFinal(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
        }, 500);
      }, 10000);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isAnimating, finalResult, icons, colors, onComplete]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-8">🔮 De waarzegger onthult je persoonlijkheid...</h2>
          
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

          {showFinal && (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold mb-4">Je persoonlijkheid is:</h3>
              <p 
                className="text-4xl font-bold mb-6 p-4 rounded-xl border-2 border-white border-opacity-30"
                style={{ color: currentColor }}
              >
                {finalResult}
              </p>
              <p className="text-lg opacity-90">
                {TOPICS[finalResult as keyof typeof TOPICS]?.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}