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
  const isPlayingRef = useRef(false);

  useEffect(() => {
    const message = language === 'en' 
      ? "What kind of future maker are you?"
      : "Wat voor toekomstmaker ben jij?";
    
    const playMessage = () => {
      if (isPlayingRef.current) return; // Prevent overlapping
      
      // Stop any existing speech
      window.speechSynthesis.cancel();
      
      isPlayingRef.current = true;
      
      // Wait a bit then speak
      setTimeout(() => {
        speak(message, language);
        
        // Reset playing flag after estimated speech duration (3-4 seconds)
        setTimeout(() => {
          isPlayingRef.current = false;
        }, 4000);
      }, 200);
    };
    
    // Play immediately
    playMessage();
    
    // Set up interval to repeat with proper 10 second gaps
    intervalRef.current = setInterval(() => {
      playMessage();
    }, 15000); // 15 seconds total (4 sec speech + 10 sec pause + 1 sec buffer)
    
    // Cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPlayingRef.current = false;
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
            {/* Mystical sparkles decoration */}
            <div className="absolute top-4 left-4">
              <span className="text-yellow-300 text-lg animate-pulse">✨</span>
            </div>
            <div className="absolute top-6 right-6">
              <span className="text-blue-300 text-xl animate-pulse">🌟</span>
            </div>
            <div className="absolute bottom-4 left-6">
              <span className="text-orange-300 text-base animate-pulse">💫</span>
            </div>
            
            {/* Title with enhanced styling */}
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-2xl mb-4">
                {t.entryChoice.title}
              </h1>
              <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full"></div>
            </div>
            
            {/* Enhanced buttons */}
            <div className="space-y-5 md:space-y-6">
              <Button
                onClick={onCheckIn}
                className="group relative w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 active:from-purple-800 active:to-purple-700 text-white text-lg md:text-xl lg:text-2xl py-7 md:py-9 lg:py-11 px-6 md:px-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-purple-400 hover:border-purple-300 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative inline-block scale-x-[-1] text-2xl md:text-3xl lg:text-4xl">🚶‍♂️</span>
                <span className="relative font-bold">{t.entryChoice.checkIn}</span>
              </Button>
              
              <Button
                onClick={onCheckOut}
                className="group relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 active:from-yellow-600 active:to-yellow-500 text-purple-900 text-lg md:text-xl lg:text-2xl py-7 md:py-9 lg:py-11 px-6 md:px-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-yellow-300 hover:border-yellow-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative text-2xl md:text-3xl lg:text-4xl">🚶‍♂️</span>
                <span className="relative font-bold">{t.entryChoice.checkOut}</span>
              </Button>
            </div>
          </div>
        </div>

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