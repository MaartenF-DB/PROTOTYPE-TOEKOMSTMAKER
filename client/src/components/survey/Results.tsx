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
  
  // Random motivational messages
  const motivationalMessages = [
    "Jouw ideeën betekenen veel voor de rest van de wereld. Hoe klein ze ook zijn!",
    "Met jouw ideeën kom je er wel! Blijf in jezelf en anderen geloven.",
    "Je bent geweldig! Blijf zo denken en doen. Samen geven we vorm aan de toekomst.",
    "Je doet het geweldig! Je zelfvertrouwen zal je helpen de wereld te veranderen.",
    "Je bent een superster! Je zelfvertrouwen is inspirerend, blijf stralen en wijs de weg!"
  ];
  
  const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  useEffect(() => {
    // Automatically export to CSV
    exportToCSV(answers);
  }, [answers]);

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
          speak(answers.result);
        }}
      />
    );
  }

  console.log('🎯 Rendering final results section - UITSLAG VAN DE VRAGEN');

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
          <div className="text-5xl font-bold text-yellow-300 mb-8">{answers.mostImportantTopic}</div>
          
          <div className="bg-white bg-opacity-30 rounded-xl p-6 mt-6">
            <p className="text-xl font-medium text-white leading-relaxed">
              {randomMessage}
            </p>
          </div>
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
