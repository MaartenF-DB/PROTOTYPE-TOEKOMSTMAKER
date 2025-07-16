import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useState } from 'react';
import { TOPICS } from '@/types/survey';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyAnswers } from '@/types/survey';
import { AnimatedResult } from './AnimatedResult';

interface ResultsProps {
  answers: SurveyAnswers;
  onRestart: () => void;
}

export function Results({ answers, onRestart }: ResultsProps) {
  const { speak } = useSpeech();
  const [showAnimatedResult, setShowAnimatedResult] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];

  useEffect(() => {
    // Automatically export to CSV
    exportToCSV(answers);
  }, [answers]);

  useEffect(() => {
    console.log('Results component mounted, showAnimatedResult:', showAnimatedResult);
  }, [showAnimatedResult]);

  // Show animated result first
  if (showAnimatedResult) {
    console.log('Rendering AnimatedResult component');
    return (
      <AnimatedResult 
        finalResult={answers.mostImportantTopic}
        onComplete={() => {
          console.log('AnimatedResult onComplete called - transitioning to final results');
          setShowAnimatedResult(false);
          setAnimationComplete(true);
          setTimeout(() => {
            console.log('Speaking result after animation complete');
            speak(answers.result);
          }, 500);
        }}
      />
    );
  }

  console.log('Rendering final results section');

  const handleStop = () => {
    // Optionally perform any cleanup here
    onRestart();
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-yellow-400 to-orange-400 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full shadow-2xl transition-all duration-1000 ${
            animationComplete ? topicData?.color || 'bg-gray-500' : 'bg-gray-400 animate-pulse'
          }`}>
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              {topicData?.icon || '❓'}
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
          <h2 className="text-4xl font-bold mb-6">Jij bent een...</h2>
          
          <div className="text-6xl font-bold mb-4">
            {answers.actionChoice === 'uitvinden' ? 'UITVINDER' :
             answers.actionChoice === 'actie' ? 'ACTIEVOERDER' :
             answers.actionChoice === 'veranderen' ? 'VERANDERAAR' : 'TOEKOMSTMAKER'}
          </div>
          <div className="text-3xl mb-6">voor</div>
          <div className="text-5xl font-bold text-yellow-300">{answers.mostImportantTopic}</div>
          

        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleStop}
            className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Stop
          </Button>
        </div>
      </div>
    </section>
  );
}
