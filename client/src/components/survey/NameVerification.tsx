import { Input } from '@/components/ui/input';
import { Question } from '@/components/survey/Question';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect } from 'react';
import { Language } from '@/lib/translations';

interface NameVerificationProps {
  originalName: string;
  nameVerification: string;
  onNameVerificationChange: (value: string) => void;
  onContinue: () => void;
  language?: Language;
}

export function NameVerification({ 
  originalName, 
  nameVerification, 
  onNameVerificationChange, 
  onContinue,
  language = 'nl'
}: NameVerificationProps) {
  const { speak } = useSpeech();

  useEffect(() => {
    const text = language === 'en'
      ? `Hello ${originalName}! Can you enter your name again? If there are multiple people with the same name, type your name with a number, for example ${originalName} 1.`
      : `Hallo ${originalName}! Kun je je naam nog een keer invullen? Als er meer mensen zijn met dezelfde naam, typ dan je naam met een nummer, bijvoorbeeld ${originalName} 1.`;
    speak(text, language);
  }, [speak, originalName, language]);

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
        

      </div>
    </Question>
  );
}