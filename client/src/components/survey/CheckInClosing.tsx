import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { translations } from '@/lib/translations';

interface CheckInClosingProps {
  onComplete: () => void;
  language?: 'nl' | 'en';
}

export function CheckInClosing({ onComplete, language = 'nl' }: CheckInClosingProps) {
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    const text = language === 'en' 
      ? "Are you coming back at the end of the exhibition? Then we'll explore further what kind of future maker you are!"
      : "Kom je aan het einde van de tentoonstelling terug? Dan onderzoeken we verder wat voor toekomstmaker jij bent!";
    speak(text, language);
  }, [speak, language]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-800 to-black text-white">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="animate-pulse">
            <svg className="w-24 h-24 text-yellow-400 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-6">{t.checkInClosing.title}</h2>
        <p className="text-xl mb-8">{t.checkInClosing.subtitle}</p>
        

        
        <Button 
          onClick={onComplete}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
{t.checkInClosing.button}
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </Button>
      </div>
    </section>
  );
}
