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
