import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';

interface CheckoutNameInputProps {
  existingResponses: any[];
  onNameConfirm: (name: string, isNewUser: boolean) => void;
  language?: Language;
}

export function CheckoutNameInput({ existingResponses, onNameConfirm, language = 'nl' }: CheckoutNameInputProps) {
  const [enteredName, setEnteredName] = useState<string>('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedExistingName, setSelectedExistingName] = useState<string>('');
  const [willProceedAsNew, setWillProceedAsNew] = useState(false);
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    speak(t.checkOutName?.name || "What is your name?");
  }, [speak, t.checkOutName]);

  const handleNameSubmit = () => {
    if (!enteredName.trim()) return;
    
    // Check if this exact name exists and has complete check-in data
    const exactMatch = existingResponses.find(response => 
      response.name.toLowerCase() === enteredName.toLowerCase() &&
      response.age && response.age.trim() !== '' && 
      response.visitingWith && response.visitingWith.trim() !== ''
    );
    
    if (exactMatch) {
      // Exact match with complete check-in data - use their previous data
      speak("Ik heb je naam gevonden! Je hebt al eerder de check-in vragen beantwoord.");
      onNameConfirm(exactMatch.name, false); // false = not a new user
    } else {
      // Check for similar names with complete check-in data
      const similarResponses = existingResponses.filter(response => 
        response.age && response.age.trim() !== '' && 
        response.visitingWith && response.visitingWith.trim() !== '' && (
          response.name.toLowerCase().includes(enteredName.toLowerCase()) || 
          enteredName.toLowerCase().includes(response.name.toLowerCase())
        )
      );
      
      if (similarResponses.length > 0) {
        setShowOptions(true);
        speak("Ik vond vergelijkbare namen in de lijst! Kies je naam of ga verder als nieuwe bezoeker.");
      } else {
        // Name not found or doesn't have complete check-in data, proceed as new user
        onNameConfirm(enteredName, true);
      }
    }
  };

  const handleSelectExistingName = (name: string) => {
    setSelectedExistingName(name);
    setWillProceedAsNew(false);
  };

  const handleProceedAsNew = () => {
    setWillProceedAsNew(true);
    setSelectedExistingName('');
  };

  const handleFinalConfirm = () => {
    if (selectedExistingName) {
      onNameConfirm(selectedExistingName, false); // false = existing user
    } else if (willProceedAsNew) {
      onNameConfirm(enteredName, true); // true = new user
    }
  };

  if (showOptions) {
    const exactMatch = existingResponses.find(response => 
      response.name.toLowerCase() === enteredName.toLowerCase() &&
      response.age && response.age.trim() !== '' && 
      response.visitingWith && response.visitingWith.trim() !== ''
    );
    
    const similarResponses = existingResponses.filter(response => 
      response.age && response.age.trim() !== '' && 
      response.visitingWith && response.visitingWith.trim() !== '' && (
        response.name.toLowerCase().includes(enteredName.toLowerCase()) || 
        enteredName.toLowerCase().includes(response.name.toLowerCase())
      )
    );

    const matchingNames = exactMatch ? [exactMatch.name] : similarResponses.map(r => r.name);

    return (
      <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white">
        <div className="text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-8">
            {exactMatch ? "Welkom terug!" : "Vergelijkbare namen gevonden"}
          </h2>
          
          <div className="mb-6">
            <p className="text-xl mb-4">
              {exactMatch 
                ? `Perfect! Je hebt al eerder de check-in vragen beantwoord als "${exactMatch.name}".`
                : `Je hebt "${enteredName}" ingevuld. Ik vond deze vergelijkbare namen:`
              }
            </p>
          </div>
          
          {/* List of matching names with checkmarks */}
          <div className="grid grid-cols-1 gap-4 mb-6">
            {matchingNames.map((name, index) => (
              <button
                key={index}
                onClick={() => handleSelectExistingName(name)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedExistingName === name
                    ? 'border-white bg-white bg-opacity-20'
                    : 'border-white border-opacity-30 hover:border-opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{name}</span>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400" />
                    {selectedExistingName === name && <Check className="w-6 h-6" />}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Option for new user */}
          <div className="mb-6">
            <button
              onClick={handleProceedAsNew}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                willProceedAsNew
                  ? 'border-white bg-white bg-opacity-20'
                  : 'border-white border-opacity-30 hover:border-opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">
                  {exactMatch 
                    ? "Ik wil alleen de checkout vragen beantwoorden"
                    : "Ik heb de eerdere vragen nog niet beantwoord"
                  }
                </span>
                {willProceedAsNew && <Check className="w-6 h-6" />}
              </div>
            </button>
          </div>

          <Button
            onClick={handleFinalConfirm}
            disabled={!selectedExistingName && !willProceedAsNew}
            className="w-full bg-white text-purple-600 hover:bg-gray-100 text-xl p-6 font-bold"
          >
            Doorgaan
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-teal-500 text-white">
      <div className="text-center max-w-5xl w-full">
        <div className="bg-white bg-opacity-20 rounded-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">{t.checkOutName?.name || "What is your name?"}</h2>
          
          <div className="space-y-4">
            <Input
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              placeholder={t.checkOutName?.namePlaceholder || "Type your name here..."}
              className="w-full p-4 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            {enteredName.length > 0 && (
              <div className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-white font-semibold">{t.yourAnswer}:</p>
                <p className="text-white text-lg">{enteredName}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNameSubmit}
            disabled={!enteredName.trim()}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            Volgende
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
}