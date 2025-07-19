import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useState } from 'react';
import { TOPICS } from '@/types/survey';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyAnswers } from '@/types/survey';
import { AnimatedResult } from './AnimatedResult';
import { translations, Language } from '@/lib/translations';
import { MysticalCard } from '@/components/fortune/FortuneTellerCharacter';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';

interface ResultsProps {
  answers: SurveyAnswers;
  onRestart: () => void;
  language?: Language;
}

// Utility function to get topic name in correct language
const getTopicName = (topicKey: string, language: Language) => {
  const topic = TOPICS[topicKey as keyof typeof TOPICS];
  return language === 'en' ? topic?.nameEn : topic?.name || topicKey;
};

export function Results({ answers, onRestart, language = 'nl' }: ResultsProps) {
  const { speak } = useSpeech();
  const [showAnimatedResult, setShowAnimatedResult] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];
  
  // Confidence-based motivational messages
  const getMotivationalMessage = (confidenceLevel: number | null) => {
    const t = translations[language];
    if (!confidenceLevel) return t.results.motivationalMessages[1];
    
    return t.results.motivationalMessages[confidenceLevel] || t.results.motivationalMessages[1];
  };
  
  const motivationalMessage = getMotivationalMessage(answers.confidenceAfter);
  
  // Safety check for topicData
  if (!topicData) {
    console.error('No topic data found for:', answers.mostImportantTopic);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Oeps! Er ging iets mis.</h1>
          <Button onClick={onRestart} className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold">
            Opnieuw beginnen
          </Button>
        </div>
      </div>
    );
  }

  // Remove automatic CSV export - CSV can be downloaded from dashboard instead

  useEffect(() => {
    console.log('Results component mounted, showAnimatedResult:', showAnimatedResult);
  }, [showAnimatedResult]);

  // Show animated result first
  if (showAnimatedResult) {
    console.log('🎬 Rendering AnimatedResult component');
    return (
      <AnimatedResult 
        finalResult={answers.mostImportantTopic}
        onComplete={() => {
          console.log('✅ ANIMATION COMPLETE - SHOWING FINAL RESULTS NOW');
          setShowAnimatedResult(false);
          setAnimationComplete(true);
          
          // Speak the results in the correct language
          const resultText = language === 'en' ? 
            `You are a ${answers.actionChoice === 'uitvinden' ? 'inventor' :
                        answers.actionChoice === 'actie' ? 'activist' :
                        answers.actionChoice === 'veranderen' ? 'changemaker' : 'future maker'} for ${getTopicName(answers.mostImportantTopic, language)}` :
            `Jij bent een ${answers.actionChoice === 'uitvinden' ? 'uitvinder' :
                           answers.actionChoice === 'actie' ? 'actievoerder' :
                           answers.actionChoice === 'veranderen' ? 'veranderaar' : 'toekomstmaker'} voor ${getTopicName(answers.mostImportantTopic, language)}`;
          
          console.log('🎤 Speaking result:', resultText);
          speak(resultText, language);
          
          // Also speak the motivational message after a brief pause
          setTimeout(() => {
            console.log('🎤 Speaking motivational message:', motivationalMessage);
            speak(motivationalMessage, language);
          }, 4000);
        }}
      />
    );
  }

  console.log('🎯 Rendering final results section - UITSLAG VAN DE VRAGEN');

  const handleStop = () => {
    // Optionally perform any cleanup here
    onRestart();
  };

  // Create topic-specific gradient based on hex color
  const getTopicGradient = (hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      const darkerRgb = {
        r: Math.max(0, rgb.r - 30),
        g: Math.max(0, rgb.g - 30),
        b: Math.max(0, rgb.b - 30)
      };
      return `linear-gradient(135deg, ${hexColor} 0%, rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}) 100%)`;
    }
    return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="text-center max-w-2xl w-full relative z-10">
        {/* Mystical crystal ball with result */}
        <div className="mb-6">
          <div 
            className="w-32 h-32 mx-auto rounded-full shadow-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${topicData.hexColor}, ${topicData.hexColor}dd, #1e1b4b)`,
              border: `3px solid ${topicData.hexColor}80`
            }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              {topicData?.icon || '🔮'}
            </div>
          </div>
        </div>
        
        {/* Results card directly under the crystal ball */}
        <MysticalCard className="mb-8">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {language === 'en' ? 'Jij bent een...' : 'Jij bent een...'}
          </h2>
          
          <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            {language === 'en' ? 
              (answers.actionChoice === 'uitvinden' ? 'INVENTOR' :
               answers.actionChoice === 'actie' ? 'ACTIVIST' :
               answers.actionChoice === 'veranderen' ? 'CHANGEMAKER' : 'FUTURE MAKER')
              :
              (answers.actionChoice === 'uitvinden' ? 'UITVINDER' :
               answers.actionChoice === 'actie' ? 'ACTIEVOERDER' :
               answers.actionChoice === 'veranderen' ? 'VERANDERAAR' : 'TOEKOMSTMAKER')
            }
          </div>
          <div className="text-2xl mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {language === 'en' ? 'voor' : 'voor'}
          </div>
          <div 
            className="text-4xl font-bold mb-6 drop-shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${topicData.hexColor}, ${topicData.hexColor}dd)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {getTopicName(answers.mostImportantTopic, language)}
          </div>
          
          <div className="fortune-bg-secondary rounded-xl p-6 mt-6 border-2 border-yellow-400/30">
            <p className="text-lg font-medium text-white leading-relaxed">
              {motivationalMessage}
            </p>
          </div>
        </MysticalCard>

        {/* Mystical farewell */}
        <div className="text-center mb-6">
          <p className="text-yellow-300 text-sm italic">
            {language === 'en' ? "The fortune teller's vision is complete..." : "De visie van de waarzegger is compleet..."}
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleStop}
            className="fortune-bg-accent hover:bg-yellow-600 text-purple-900 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg border-2 border-purple-400/30 hover:border-purple-400/60"
          >
            <span className="mr-2">🔮</span>
            {language === 'en' ? 'New Reading' : 'Nieuwe Lezing'}
          </Button>
        </div>

      </div>
      
      {/* Reduced background emojis for less distraction */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => {
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
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {star}
            </div>
          );
        })}
      </div>
    </section>
  );
}
