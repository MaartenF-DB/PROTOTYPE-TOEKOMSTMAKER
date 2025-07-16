import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface CheckInClosingProps {
  onComplete: () => void;
}

export function CheckInClosing({ onComplete }: CheckInClosingProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const text = "Kom je aan het einde van de tentoonstelling terug? Dan krijg je een cadeau en onderzoeken we verder wat voor toekomstmaker jij bent!";
    speak(text);
  }, [speak]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-800 to-black text-white">
      <div className="text-center max-w-2xl">
        <div className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl">
          <img 
            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
            alt="Tarotkaarten op houten tafel" 
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-purple-900 bg-opacity-50 flex items-center justify-center">
            <div className="animate-pulse">
              <svg className="w-24 h-24 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
        
        <h2 className="text-4xl font-bold mb-6">Kom je aan het einde van de tentoonstelling terug?</h2>
        <p className="text-xl mb-8">Dan krijg je een cadeau en onderzoeken we verder wat voor toekomstmaker jij bent!</p>
        

        
        <Button 
          onClick={onComplete}
          className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Klaar!
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </Button>
      </div>
    </section>
  );
}
