import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { MysticalCard } from '@/components/fortune/FortuneTellerCharacter';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';
import backgroundVideoPath from "@assets/HNI_afstuderen_(5)_1752931557943.mp4";

interface EntryChoiceProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
  language?: 'nl' | 'en';
}

export function EntryChoice({ onCheckIn, onCheckOut, language = 'nl' }: EntryChoiceProps) {
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    const message = language === 'en' 
      ? "Welcome to the exhibition! Are you just entering or have you already visited the exhibition?"
      : "Welkom bij de tentoonstelling! Kom je net binnen of heb je de tentoonstelling al bezocht?";
    speak(message, language);
  }, [speak, language]);

  return (
    <section className="min-h-screen flex flex-col items-center p-6 text-white relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <div className="text-center max-w-4xl w-full">
        {/* Video positioned above the welcome section */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl mt-4">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-72 md:h-96 lg:h-[32rem] object-cover"
          >
            <source src={backgroundVideoPath} type="video/mp4" />
          </video>
        </div>

        {/* Welcome Section */}
        <MysticalCard className="mb-8 bg-black bg-opacity-70 backdrop-blur-sm border border-white border-opacity-30 max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">{t.entryChoice.title}</h1>
          
          <div className="space-y-6">
            <Button
              onClick={onCheckIn}
              className="w-full bg-purple-700 bg-opacity-90 hover:bg-purple-600 text-white text-xl py-8 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-purple-400 hover:border-purple-300"
            >
              <span className="inline-block scale-x-[-1] text-3xl">🚶‍♂️</span>
              <span className="font-bold">{t.entryChoice.checkIn}</span>
            </Button>
            
            <Button
              onClick={onCheckOut}
              className="w-full bg-yellow-500 bg-opacity-95 hover:bg-yellow-400 text-purple-900 text-xl py-8 px-8 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-yellow-300 hover:border-yellow-200"
            >
              <span className="text-3xl">🚶‍♂️</span>
              <span className="font-bold">{t.entryChoice.checkOut}</span>
            </Button>
          </div>
        </MysticalCard>

        {/* Mystical guidance text */}
        <div className="text-center">
          <p className="text-yellow-300 text-sm italic">
            {language === 'en' ? "The fortune teller awaits your choice..." : "De waarzegger wacht op jouw keuze..."}
          </p>
        </div>

        {/* Background emojis */}
        <BackgroundEmojis sectionType="entry" />
      </div>
    </section>
  );
}