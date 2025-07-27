import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useRef } from 'react';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';
import backgroundVideoPath from "@assets/Ontwerp zonder titel_1753124622020.mp4";

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
    
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Force audio context activation by creating a user interaction simulation
    const activateAudioAndStartSpeech = () => {
      console.log('🎤 Activating audio context and starting speech');
      
      // Create audio context activation (required for autoplay policies)
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const audioContext = new AudioContext();
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log('✅ Audio context resumed');
          });
        }
      }
      
      // Direct speech synthesis call bypassing the hook initially
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = language === 'en' ? 'en-US' : 'nl-NL';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      utterance.onstart = () => {
        console.log('🎤 Direct speech started successfully');
      };
      
      utterance.onend = () => {
        console.log('🔇 Direct speech ended, starting loop');
        startSpeechLoop();
      };
      
      utterance.onerror = (event) => {
        console.error('❌ Direct speech error:', event);
        // Fallback to hook-based speech
        startSpeechLoop();
      };
      
      // Start direct speech
      speechSynthesis.speak(utterance);
    };
    
    // Function to start the regular speech loop
    const startSpeechLoop = () => {
      console.log('🔄 Starting regular speech loop');
      
      // Set up interval to repeat every 8 seconds using the hook
      intervalRef.current = setInterval(() => {
        console.log('🔄 Repeating homepage audio via hook');
        speak(message, language);
      }, 8000);
    };
    
    // Try immediate audio start, fallback to user interaction detection
    let audioStarted = false;
    
    // Try direct start first
    setTimeout(() => {
      if (!audioStarted) {
        console.log('🎤 Attempting direct audio start');
        try {
          activateAudioAndStartSpeech();
          audioStarted = true;
        } catch (error) {
          console.log('❌ Direct audio failed, waiting for user interaction');
        }
      }
    }, 200);
    
    // Fallback: detect any user interaction and start audio
    const startOnInteraction = () => {
      if (!audioStarted) {
        console.log('👆 User interaction detected, starting audio');
        activateAudioAndStartSpeech();
        audioStarted = true;
        // Remove listeners after first activation
        document.removeEventListener('click', startOnInteraction);
        document.removeEventListener('touchstart', startOnInteraction);
        document.removeEventListener('keydown', startOnInteraction);
      }
    };
    
    // Listen for any user interaction
    document.addEventListener('click', startOnInteraction);
    document.addEventListener('touchstart', startOnInteraction);  
    document.addEventListener('keydown', startOnInteraction);
    
    // Cleanup interval on unmount
    return () => {
      console.log('🛑 Cleaning up homepage audio');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // Remove event listeners
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
      // Stop any ongoing speech when component unmounts
      window.speechSynthesis.cancel();
    };
  }, [speak, language]);

  return (
    <section className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8 text-white relative bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
      {/* Two column layout - Video left, Text right */}
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
        
        {/* Left column - Video */}
        <div className="order-1 lg:order-1">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] object-cover rounded-2xl shadow-2xl"
            style={{ objectPosition: 'center center', transform: 'scale(1.1)' }}
          >
            <source src={backgroundVideoPath} type="video/mp4" />
          </video>
        </div>

        {/* Right column - Text and buttons */}
        <div className="order-2 lg:order-2">
          {/* Main content card - Clean design without decorations, matching video height */}
          <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 rounded-3xl p-6 md:p-8 lg:p-10 shadow-2xl border border-purple-300 border-opacity-50 h-64 sm:h-80 md:h-96 lg:h-[32rem] xl:h-[36rem] flex flex-col justify-center">
            
            {/* Title with enhanced styling */}
            <div className="text-center mb-8 md:mb-10">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 drop-shadow-2xl mb-4 leading-tight">
                {t.entryChoice.title}
              </h1>
              <div className="w-24 md:w-32 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto rounded-full"></div>
            </div>
            
            {/* Enhanced buttons */}
            <div className="space-y-5 md:space-y-6">
              <Button
                onClick={onCheckIn}
                className="group relative w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 active:from-purple-800 active:to-purple-700 text-white text-lg sm:text-xl md:text-2xl lg:text-3xl py-6 sm:py-7 md:py-9 lg:py-11 px-6 md:px-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-purple-400 hover:border-purple-300 overflow-hidden min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative inline-block scale-x-[-1] text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🚶‍♂️</span>
                <span className="relative font-bold leading-tight">{t.entryChoice.checkIn}</span>
              </Button>
              
              <Button
                onClick={onCheckOut}
                className="group relative w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-300 active:from-yellow-600 active:to-yellow-500 text-purple-900 text-lg sm:text-xl md:text-2xl lg:text-3xl py-6 sm:py-7 md:py-9 lg:py-11 px-6 md:px-8 rounded-2xl shadow-2xl transform hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 md:gap-4 border-2 border-yellow-300 hover:border-yellow-200 overflow-hidden min-h-[4rem] sm:min-h-[5rem] md:min-h-[6rem]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 -skew-x-12"></div>
                <span className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl">🚶‍♂️</span>
                <span className="relative font-bold leading-tight">{t.entryChoice.checkOut}</span>
              </Button>
            </div>
          </div>

          {/* Mystical guidance text */}
          <div className="text-center mt-6">
            <p className="text-yellow-300 text-base sm:text-lg md:text-xl italic">
              {language === 'en' ? "The fortune teller awaits your choice..." : "De waarzegger wacht op jouw keuze..."}
            </p>
          </div>
        </div>
      </div>

      {/* Background emojis - kept as requested */}
      <BackgroundEmojis sectionType="entry" />
    </section>
  );
}