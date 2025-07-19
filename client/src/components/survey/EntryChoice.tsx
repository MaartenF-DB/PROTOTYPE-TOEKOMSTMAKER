import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useRef } from 'react';
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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const message = language === 'en' 
      ? "Welcome to Future Makers! What kind of futuremaker are you? Let's find out together! Are you a newcomer or have you just finished the exhibition?"
      : "Welkom bij Toekomstmakers! Wat voor toekomstmaker ben jij? Laten we het samen uitzoeken! Kom je net binnen of ben je net klaar met de tentoonstelling?";
    
    // Play immediately, then set up interval for repeat
    speak(message, language);
    
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up interval to repeat every 10 seconds
    intervalRef.current = setInterval(() => {
      speak(message, language);
    }, 10000);
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Stop any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
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

        {/* Welcome Section - Enhanced Design */}
        <div className="relative mb-6 md:mb-8 max-w-3xl mx-auto">
          {/* Decorative mystical border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-yellow-400 to-purple-400 rounded-3xl blur-sm opacity-75"></div>
          
          {/* Main content card */}
          <div className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-purple-300 border-opacity-50">

            
            {/* Title with enhanced styling */}
            <div className="text-center mb-6 md:mb-8">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-2xl mb-3">
                {t.entryChoice.title}
              </h1>
              <div className="w-16 md:w-20 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full"></div>
            </div>
            
            {/* Enhanced buttons */}
            <div className="space-y-4 md:space-y-5">
              <Button
                onClick={onCheckIn}
                className="group relative w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 active:from-purple-800 active:to-purple-700 text-white text-base md:text-lg lg:text-xl py-5 md:py-6 lg:py-7 px-4 md:px-6 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 border-2 border-purple-400 hover:border-purple-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative font-bold">{t.entryChoice.checkIn}</span>
              </Button>
              
              <Button
                onClick={onCheckOut}
                className="group relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 active:from-yellow-600 active:to-yellow-500 text-purple-900 text-base md:text-lg lg:text-xl py-5 md:py-6 lg:py-7 px-4 md:px-6 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 border-2 border-yellow-300 hover:border-yellow-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative font-bold">{t.entryChoice.checkOut}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mystical guidance text */}
        <div className="text-center">
          <p className="text-yellow-300 text-xs md:text-sm italic">
            {language === 'en' ? "The fortune teller awaits your choice..." : "De waarzegger wacht op jouw keuze..."}
          </p>
        </div>

        {/* Background emojis */}
        <BackgroundEmojis sectionType="entry" />
      </div>
    </section>
  );
}