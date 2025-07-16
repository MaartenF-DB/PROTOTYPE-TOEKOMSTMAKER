import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';

interface NameVerificationProps {
  originalName: string;
  nameVerification: string;
  onNameVerificationChange: (value: string) => void;
  onContinue: () => void;
}

export function NameVerification({ 
  originalName, 
  nameVerification, 
  onNameVerificationChange, 
  onContinue 
}: NameVerificationProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const text = `Hallo ${originalName}! Kun je je naam nog een keer invullen? Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer, bijvoorbeeld ${originalName} 1.`;
    speak(text);
  }, [speak, originalName]);

  const isValid = nameVerification.trim().length > 0;

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
      <div className="text-center max-w-2xl w-full">
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
          <p className="text-xl mb-6">Kun je je naam nog een keer invullen?</p>
          <p className="text-lg mb-8">Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: {originalName} 1)</p>
          
          <Input
            value={nameVerification}
            onChange={(e) => onNameVerificationChange(e.target.value)}
            placeholder="Typ hier je naam..."
            className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-indigo-300 outline-none"
          />
        </div>
        
        <Button 
          onClick={onContinue}
          disabled={!isValid}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 disabled:cursor-not-allowed px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
        >
          Verder gaan
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Button>
      </div>
    </section>
  );
}