import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';
import { BackgroundEmojis } from '@/components/fortune/BackgroundEmojis';

interface CheckoutNameInputProps {
  existingResponses: any[];
  onNameConfirm: (name: string, isNewUser: boolean) => void;
  language?: Language;
}

export function CheckoutNameInput({ existingResponses, onNameConfirm, language = 'nl' }: CheckoutNameInputProps) {
  const [enteredName, setEnteredName] = useState<string>('');
  const t = translations[language];
  const { speak } = useSpeech();

  useEffect(() => {
    speak(t.questions?.name || "What is your name?", language);
  }, [speak, t.questions, language]);



  // Check if current name already exists and has COMPLETED both check-in AND check-out
  // Only show conflict if user has already completed the ENTIRE survey (feelingAfter is not null)
  const hasNameConflict = existingResponses.some((response: any) => 
    response.name.toLowerCase() === enteredName.toLowerCase() && 
    enteredName.length > 0 &&
    response.feelingAfter !== null && 
    response.feelingAfter !== 0 // User has completed checkout
  );

  const handleNameSubmit = () => {
    if (!enteredName.trim()) return;
    
    // Block if name conflict exists - user must enter unique name
    if (hasNameConflict) return;
    
    console.log('🔍 CHECKOUT NAME SUBMIT:', { enteredName, existingResponses });
    
    // Check if this exact name exists and has complete check-in data
    // BUT has NOT completed checkout (feelingAfter is null)
    const exactMatch = existingResponses.find(response => 
      response.name.toLowerCase() === enteredName.toLowerCase() &&
      response.age && response.age.trim() !== '' && 
      response.visitingWith && response.visitingWith.trim() !== '' &&
      response.mostImportantTopic && response.mostImportantTopic.trim() !== '' &&
      response.feelingAfter === null // Only check-in users, not completed checkout
    );
    
    console.log('🔍 EXACT MATCH RESULT:', { 
      exactMatch, 
      enteredName,
      allUsers: existingResponses.map(r => ({ 
        name: r.name, 
        hasCheckIn: !!(r.age && r.visitingWith && r.mostImportantTopic),
        hasCheckOut: r.feelingAfter !== null
      }))
    });
    
    if (exactMatch) {
      // Exact match with complete check-in data - use their previous data, skip age/visiting/ranking questions
      console.log('✅ FOUND EXISTING USER WITH CHECK-IN DATA - SKIPPING ALL PRELIMINARY QUESTIONS');
      speak("Ik heb je naam gevonden! Je hebt al eerder de check-in vragen beantwoord.");
      onNameConfirm(exactMatch.name, false); // false = existing user with complete check-in data
    } else {
      // No exact match with complete check-in data - this is a new user who needs to answer age/visiting/ranking questions
      console.log('❌ NO EXACT MATCH - NEW USER NEEDS ALL PRELIMINARY QUESTIONS');
      onNameConfirm(enteredName, true); // true = new user
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-500 to-teal-500 text-white relative">
      <div className="text-center max-w-3xl w-full relative z-10 px-4">
        <div className="bg-white bg-opacity-20 rounded-2xl p-6 md:p-8 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-tight">{t.questions?.name || "What is your name?"}</h2>
          
          <div className="space-y-4">
            <Input
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              placeholder={t.placeholders?.typeName || "Type your name here..."}
              className="w-full py-4 px-4 md:px-8 lg:px-12 text-2xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
            />
            {hasNameConflict && (
              <div className="text-sm text-white space-y-2 bg-red-500 bg-opacity-20 p-4 rounded-lg border border-red-300">
                <p className="font-semibold">⚠️ {language === 'en' ? 'This name already exists!' : 'Deze naam bestaat al!'}</p>
                <p>{language === 'en' 
                  ? 'Please add a number to make your name unique (example: "Anna 1")'
                  : 'Voeg een nummer toe om je naam uniek te maken (bijvoorbeeld: "Anna 1")'}</p>
              </div>
            )}

          </div>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleNameSubmit}
            disabled={!enteredName.trim() || hasNameConflict}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Volgende
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Background emojis for name input */}
      <BackgroundEmojis sectionType="checkout" />
    </section>
  );
}