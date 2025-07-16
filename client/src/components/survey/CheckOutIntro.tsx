import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface CheckOutIntroProps {
  onStart: () => void;
  mostImportantTopic: string;
}

export function CheckOutIntro({ onStart, mostImportantTopic }: CheckOutIntroProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const text = "Welkom terug! Waar zijn we gebleven? Oh ja!! We zijn op de helft. Wat voor toekomstmaker zou je zijn?!? Tik op het scherm!";
    speak(text);
  }, [speak]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-600 to-teal-600 text-white">
      <div className="text-center max-w-2xl">
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
            alt="Interactieve tentoonstellingsruimte met kinderen" 
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-green-900 bg-opacity-50 flex items-center justify-center">
            <div className="animate-bounce">
              <svg className="w-24 h-24 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-6">Welkom terug!</h2>
        <p className="text-xl mb-4">Waar zijn we gebleven? Oh ja!!</p>
        <p className="text-2xl font-bold mb-8">We zijn op de helft. Wat voor toekomstmaker zou je zijn?!?</p>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 mb-8">
          <p className="text-lg font-semibold">Tik op het scherm!</p>
        </div>
        
        <Button 
          onClick={onStart}
          className="bg-teal-500 hover:bg-teal-600 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Verder gaan!
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </section>
  );
}
