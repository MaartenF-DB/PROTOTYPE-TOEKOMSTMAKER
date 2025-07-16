import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface EntryChoiceProps {
  onCheckIn: () => void;
  onCheckOut: () => void;
}

export function EntryChoice({ onCheckIn, onCheckOut }: EntryChoiceProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const message = "Welkom bij de tentoonstelling! Kom je net binnen of heb je de tentoonstelling al bezocht?";
    speak(message);
  }, [speak]);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-white bg-opacity-20 shadow-2xl mb-6">
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              🚪
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h1 className="text-4xl font-bold mb-6">Welkom bij de tentoonstelling!</h1>
          <p className="text-xl mb-8">
            Om je de beste ervaring te geven, willen we graag weten:
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={onCheckIn}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚶‍♂️ Ik kom net binnen
              <div className="text-sm opacity-80 mt-1">Check-in voor de tentoonstelling</div>
            </Button>
            
            <Button
              onClick={onCheckOut}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xl py-6 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🚶‍♀️ Ik heb de tentoonstelling al bezocht
              <div className="text-sm opacity-80 mt-1">Check-out na de tentoonstelling</div>
            </Button>
          </div>
        </div>
        
        <div className="text-sm opacity-75">
          Kies de optie die het beste bij jou past
        </div>
      </div>
    </section>
  );
}