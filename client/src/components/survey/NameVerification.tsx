import { Input } from '@/components/ui/input';
import { Question } from '@/components/survey/Question';
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
    <Question
      questionNumber={0}
      question="Kun je je naam nog een keer invullen?"
      bgGradient="from-indigo-600 to-purple-600"
      buttonColor="bg-indigo-600 hover:bg-indigo-700"
      onNext={onContinue}
      showPrevious={false}
      showNext={true}
      isValid={isValid}
    >
      <div className="space-y-4">
        <p className="text-lg text-white opacity-90 mb-6">
          Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer (bijvoorbeeld: {originalName} 1)
        </p>
        
        <Input
          value={nameVerification}
          onChange={(e) => onNameVerificationChange(e.target.value)}
          placeholder="Typ hier je naam..."
          className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-indigo-300 outline-none"
        />
        
        {nameVerification.length > 0 && (
          <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-white font-semibold">Jouw antwoord:</p>
            <p className="text-white text-lg">{nameVerification}</p>
          </div>
        )}
      </div>
    </Question>
  );
}