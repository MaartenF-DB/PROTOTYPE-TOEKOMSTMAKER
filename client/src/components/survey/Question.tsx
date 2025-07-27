import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useState } from 'react';
import { translations } from '@/lib/translations';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';

interface QuestionProps {
  questionNumber: number;
  question: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrevious?: () => void;
  onComplete?: () => void;
  showPrevious?: boolean;
  showNext?: boolean;
  showComplete?: boolean;
  bgGradient?: string;
  buttonColor?: string;
  isValid?: boolean;
  style?: React.CSSProperties;
  language?: 'nl' | 'en';
}

export function Question({
  questionNumber,
  question,
  children,
  onNext,
  onPrevious,
  onComplete,
  showPrevious = true,
  showNext = true,
  showComplete = false,
  bgGradient = "from-blue-500 to-teal-500",
  buttonColor = "bg-blue-600 hover:bg-blue-700",
  isValid = true,
  style,
  language = 'nl'
}: QuestionProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    if (question) {
      speak(question, language);
    }
  }, [speak, question, language]);

  const handleNext = () => {
    if (!isValid) {
      const message = language === 'en' ? "Please fill in your answer first!" : "Vul eerst je antwoord in!";
      speak(message, language);
      return;
    }
    // Go to next question without audio confirmation
    if (onNext) {
      onNext();
    }
  };

  const handleComplete = () => {
    if (!isValid) {
      const message = language === 'en' ? "Please fill in your answer first!" : "Vul eerst je antwoord in!";
      speak(message, language);
      return;
    }
    // Complete without audio confirmation
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <section 
      className={`min-h-screen flex flex-col items-center justify-center p-6 text-white relative ${style ? '' : `bg-gradient-to-br ${bgGradient}`}`}
      style={style}
    >
      <div className="text-center max-w-2xl w-full relative z-10">
        <div className="bg-white bg-opacity-20 rounded-2xl p-4 md:p-6 lg:p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">{question}</h2>
          {children}
        </div>
        
        <div className="flex justify-center gap-4">
          {showPrevious && onPrevious && (
            <Button 
              onClick={onPrevious}
              className="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {translations[language].buttons.previous}
            </Button>
          )}
          
          {showNext && onNext && (
            <Button 
              onClick={handleNext}
              className={`${buttonColor} px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg`}
            >
              {translations[language].buttons.next}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
          )}
          
          {showComplete && onComplete && (
            <Button 
              onClick={handleComplete}
              className={`${buttonColor} px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg`}
            >
              {translations[language].buttons.finish}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </Button>
          )}
        </div>
      </div>

      {/* Background emojis for questions */}
      <BackgroundEmojis sectionType="questions" />
    </section>
  );
}
