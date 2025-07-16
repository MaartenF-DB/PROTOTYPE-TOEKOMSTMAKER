import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useState } from 'react';
import { TOPICS } from '@/types/survey';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyAnswers } from '@/types/survey';

interface ResultsProps {
  answers: SurveyAnswers;
  onRestart: () => void;
}

export function Results({ answers, onRestart }: ResultsProps) {
  const { speak } = useSpeech();
  const [animationComplete, setAnimationComplete] = useState(false);

  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];

  useEffect(() => {
    speak(answers.result);
    
    // Start color animation
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [speak, answers.result]);

  const handleExportCSV = () => {
    exportToCSV(answers);
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
          
          <div className="mt-8 rounded-xl overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Kinderen werken aan creatieve projecten" 
              className="w-full h-auto"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            onClick={handleExportCSV}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exporteer naar CSV
          </Button>
          <Button 
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Opnieuw beginnen
          </Button>
        </div>
      </div>
    </section>
  );
}
