import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface CheckInIntroProps {
  onStart: () => void;
}

export function CheckInIntro({ onStart }: CheckInIntroProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const text = "Welkom mijn vriend! Zullen we samen uitvinden wat voor toekomstmaker jij bent? Tik op het scherm om te beginnen!";
    speak(text);
  }, [speak]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="text-center max-w-2xl">
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
            alt="Waarzegster met kristallen bol" 
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white bg-opacity-20 rounded-full p-6 hover:bg-opacity-30 transition-all">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-6">Welkom mijn vriend!</h1>
        <p className="text-xl mb-8">Zullen we samen uitvinden wat voor toekomstmaker jij bent?</p>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-8">
          <p className="text-lg font-semibold">Tik op het scherm om te beginnen!</p>
        </div>
        
        <Button 
          onClick={onStart}
          className="bg-white text-purple-600 px-8 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
        >
          Beginnen
        </Button>
      </div>
    </section>
  );
}
