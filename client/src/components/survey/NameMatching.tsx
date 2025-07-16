import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { Question } from './Question';

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
    <Question
      questionNumber={0}
      question="Naam gevonden!"
      bgGradient="from-orange-500 to-red-500"
      buttonColor="bg-orange-600 hover:bg-orange-700"
      onNext={handleProceed}
      showPrevious={false}
      showNext={true}
      isValid={selectedName !== '' || proceedWithoutMatch}
    >
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl">
            Je hebt "{enteredName}" ingevuld. Er zijn al antwoorden met vergelijkbare namen.
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-lg font-medium text-white">Kies je naam uit de lijst:</p>
          
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
            <span className="text-lg text-white">Ik wil toch nieuwe antwoorden geven</span>
          </label>
        </div>
        
        {(selectedName || proceedWithoutMatch) && (
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white font-semibold">Jouw keuze:</p>
            <p className="text-white text-lg">
              {selectedName || 'Nieuwe antwoorden geven'}
            </p>
          </div>
        )}
      </div>
    </Question>
  );
}