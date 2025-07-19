import { Button } from '@/components/ui/button';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { MysticalCard } from '@/components/fortune/FortuneTellerCharacter';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';

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
    <section className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative">
      <div className="text-center max-w-2xl w-full relative z-10">
        {/* Mystical portal entrance */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 shadow-2xl mb-6">
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              🔮
            </div>
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <span className="text-yellow-400 text-2xl">✨</span>
            <span className="text-purple-300 text-xl">🌟</span>
            <span className="text-pink-300 text-lg">💫</span>
          </div>
        </div>
        
        <MysticalCard className="mb-8">
          <h1 className="text-4xl font-bold mb-6 fortune-text-glow">{t.entryChoice.title}</h1>
          
          <div className="space-y-4">
            <Button
              onClick={onCheckIn}
              className="w-full fortune-bg-secondary hover:fortune-bg-mystical text-white text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-yellow-400/30 hover:border-yellow-400/60"
            >
              <span className="inline-block scale-x-[-1] text-2xl">🚶‍♂️</span>
              <span>{t.entryChoice.checkIn}</span>
            </Button>
            
            <Button
              onClick={onCheckOut}
              className="w-full fortune-bg-accent hover:bg-yellow-600 text-purple-900 text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-purple-400/30 hover:border-purple-400/60"
            >
              <span className="text-2xl">🚶‍♂️</span>
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