import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface NameMatchingProps {
  enteredName: string;
  existingNames: string[];
  onNameMatch: (matchedName: string) => void;
  onProceedAnyway: () => void;
}

export function NameMatching({ enteredName, existingNames, onNameMatch, onProceedAnyway }: NameMatchingProps) {
  const [selectedName, setSelectedName] = useState('');
  const [proceedWithoutMatch, setProceedWithoutMatch] = useState(false);
  const { speak } = useSpeech();

  useEffect(() => {
    const message = `Er zijn meerdere namen gevonden. Kies je naam uit de lijst of ga verder met een nieuwe naam.`;
    speak(message);
  }, [speak]);

  const handleNameSelect = (name: string) => {
    setSelectedName(name);
    setProceedWithoutMatch(false);
  };

  const handleProceed = () => {
    if (selectedName) {
      onNameMatch(selectedName);
    } else if (proceedWithoutMatch) {
      onProceedAnyway();
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-500 to-red-500 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto rounded-full bg-white bg-opacity-20 shadow-2xl mb-6">
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              🔍
            </div>
          </div>
        </div>
        
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6">Naam gevonden!</h2>
          <p className="text-xl mb-6">
            Je hebt "{enteredName}" ingevuld. Er zijn al antwoorden met vergelijkbare namen.
          </p>
          
          <div className="space-y-4 mb-6">
            <p className="text-lg font-medium">Kies je naam uit de lijst:</p>
            
            {existingNames.map((name, index) => (
              <button
                key={index}
                onClick={() => handleNameSelect(name)}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  selectedName === name 
                    ? 'border-white bg-white bg-opacity-30 text-white' 
                    : 'border-white border-opacity-30 bg-white bg-opacity-10 hover:bg-opacity-20 text-white'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          
          <div className="border-t border-white border-opacity-30 pt-6">
            <label className="flex items-center justify-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={proceedWithoutMatch}
                onChange={(e) => {
                  setProceedWithoutMatch(e.target.checked);
                  if (e.target.checked) {
                    setSelectedName('');
                  }
                }}
                className="w-5 h-5 rounded"
              />
              <span className="text-lg">Ik wil toch nieuwe antwoorden geven</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button
            onClick={handleProceed}
            disabled={!selectedName && !proceedWithoutMatch}
            className={`px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg ${
              selectedName || proceedWithoutMatch
                ? 'bg-white text-orange-600 hover:bg-gray-100'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            Verder gaan
          </Button>
        </div>
      </div>
    </section>
  );
}