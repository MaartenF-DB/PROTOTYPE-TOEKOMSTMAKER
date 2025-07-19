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
    <section className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 text-white relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      <div className="text-center w-full max-w-5xl">
        {/* Video positioned above the welcome section - iPad optimized */}
        <div className="mb-6 md:mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[28rem] object-cover"
          >
            <source src={backgroundVideoPath} type="video/mp4" />
          </video>
        </div>

        {/* Welcome Section - iPad optimized */}
        <MysticalCard className="mb-6 md:mb-8 bg-black bg-opacity-70 backdrop-blur-sm border border-white border-opacity-30 max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 text-white drop-shadow-lg">{t.entryChoice.title}</h1>
          
          <div className="space-y-4 md:space-y-6">
            <Button
              onClick={onCheckIn}
              className="w-full bg-purple-700 bg-opacity-90 hover:bg-purple-600 active:bg-purple-800 text-white text-lg md:text-xl lg:text-2xl py-6 md:py-8 lg:py-10 px-6 md:px-8 rounded-xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-purple-400 hover:border-purple-300"
            >
              <span className="inline-block scale-x-[-1] text-2xl md:text-3xl lg:text-4xl">🚶‍♂️</span>
              <span className="font-bold">{t.entryChoice.checkIn}</span>
            </Button>
            
            <Button
              onClick={onCheckOut}
              className="w-full bg-yellow-500 bg-opacity-95 hover:bg-yellow-400 active:bg-yellow-600 text-purple-900 text-lg md:text-xl lg:text-2xl py-6 md:py-8 lg:py-10 px-6 md:px-8 rounded-xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-yellow-300 hover:border-yellow-200"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl">🚶‍♂️</span>
              <span className="font-bold">{t.entryChoice.checkOut}</span>
            </Button>
          </div>
        </MysticalCard>

        {/* Mystical guidance text */}
        <div className="text-center">
          <p className="text-yellow-300 text-sm md:text-base italic">
            {language === 'en' ? "The fortune teller awaits your choice..." : "De waarzegger wacht op jouw keuze..."}
          </p>
        </div>

        {/* Background emojis */}
        <BackgroundEmojis sectionType="entry" />
      </div>
    </section>
  );
}