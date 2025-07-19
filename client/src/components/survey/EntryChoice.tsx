import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface EntryChoiceProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  language?: 'nl' | 'en';
}

export function EntryChoice({ onCheckIn, onCheckOut, language = 'nl' }: EntryChoiceProps) {
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    const message = "Welkom bij de tentoonstelling! Kom je net binnen of heb je de tentoonstelling al bezocht?";
    speak(message, language);
  }, [speak, language]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-white bg-opacity-20 shadow-2xl mb-6">
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              🚪
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6">{t.entryChoice.title}</h1>
          
          <div className="space-y-4">
            <Button
              onClick={onCheckIn}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <span className="inline-block scale-x-[-1] text-2xl">🚶‍♂️</span>
              <span>{t.entryChoice.checkIn}</span>
            </Button>
            
            <Button
              onClick={onCheckOut}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">🚶‍♂️</span>
              <span>{t.entryChoice.checkOut}</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}