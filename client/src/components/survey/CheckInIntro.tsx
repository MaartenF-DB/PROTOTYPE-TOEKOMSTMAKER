import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { translations } from '@/lib/translations';

interface CheckInIntroProps {
  onStart: () => void;
  language?: 'nl' | 'en';
}

export function CheckInIntro({ onStart, language = 'nl' }: CheckInIntroProps) {
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    const text = language === 'en' 
      ? "Hey Future Maker! Shall we discover together what kind of future maker you are?"
      : "Hé Toekomstmaker! Zullen we samen uitvinden wat voor toekomstmaker jij bent?";
    speak(text, language);
  }, [speak, language]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-white bg-opacity-20 flex items-center justify-center">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">{t.checkInIntro.title}</h1>
        <p className="text-xl mb-8">{t.checkInIntro.subtitle}</p>
        
        <Button 
          onClick={onStart}
          className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
        >
          {t.checkInIntro.start}
        </Button>
      </div>
    </section>
  );
}
