import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { translations } from '@/lib/translations';

interface CheckOutIntroProps {
  onStart: () => void;
  mostImportantTopic: string;
  language?: 'nl' | 'en';
}

export function CheckOutIntro({ onStart, mostImportantTopic, language = 'nl' }: CheckOutIntroProps) {
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    const text = language === 'en' 
      ? "Are you coming back at the end of the exhibition? Then we'll explore further what kind of future maker you are!"
      : "Kom je aan het einde van de tentoonstelling terug? Dan onderzoeken we verder wat voor toekomstmaker jij bent!";
    
    // Initial speech
    speak(text, language);
    
    // Set up 15-second loop
    const speechLoop = setInterval(() => {
      speak(text, language);
    }, 15000); // 15 seconds
    
    // Cleanup interval on unmount
    return () => {
      clearInterval(speechLoop);
    };
  }, [speak, language]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-600 to-teal-600 text-white">
      <div className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-6">{t.checkInClosing.title}</h2>
        <p className="text-2xl font-bold mb-8">{t.checkOutIntro.subtitle}</p>
        

        
        <Button 
          onClick={onStart}
          className="bg-teal-500 hover:bg-teal-600 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
{t.checkOutIntro.start}
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </section>
  );
}
