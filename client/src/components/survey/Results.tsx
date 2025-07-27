import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';
import { useEffect, useState } from 'react';
import { TOPICS } from '@/types/survey';
import { exportToCSV } from '@/lib/csvExport';
import { SurveyAnswers } from '@/types/survey';
import { AnimatedResult } from './AnimatedResult';
import { translations, Language } from '@/lib/translations';
import { useLocation } from 'wouter';



interface ResultsProps {
  answers: SurveyAnswers;
  onRestart: () => void;
  language?: Language;
}

// Utility function to get topic name in correct language
const getTopicName = (topicKey: string, language: Language) => {
  const topic = TOPICS[topicKey as keyof typeof TOPICS];
  return language === 'en' ? topic?.nameEn : topic?.name || topicKey;
};

export function Results({ answers, onRestart, language = 'nl' }: ResultsProps) {
  const { speak } = useSpeech();
  const [showAnimatedResult, setShowAnimatedResult] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [, setLocation] = useLocation();

  const topicData = TOPICS[answers.mostImportantTopic as keyof typeof TOPICS];
  
  // Confidence-based motivational messages
  const getMotivationalMessage = (confidenceLevel: number | null) => {
    const t = translations[language];
    if (!confidenceLevel) return t.results.motivationalMessages[1];
    
    return t.results.motivationalMessages[confidenceLevel as keyof typeof t.results.motivationalMessages] || t.results.motivationalMessages[1];
  };
  
  const motivationalMessage = getMotivationalMessage(answers.confidenceAfter);
  
  // Safety check for topicData
  if (!topicData) {
    console.error('No topic data found for:', answers.mostImportantTopic);
    return (
      <div className="survey-section bg-gradient-to-br from-purple-600 to-blue-600 text-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Oeps! Er ging iets mis.</h1>
          <Button onClick={onRestart} className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold">
            Opnieuw beginnen
          </Button>
        </div>
      </div>
    );
  }

  // Remove automatic CSV export - CSV can be downloaded from dashboard instead

  useEffect(() => {
    console.log('Results component mounted, showAnimatedResult:', showAnimatedResult);
  }, [showAnimatedResult]);

  // Auto-redirect to homepage after 30 seconds with countdown
  useEffect(() => {
    if (!showAnimatedResult && animationComplete) {
      // Start countdown immediately
      let countdownValue = 30;
      setCountdown(countdownValue);
      
      const countdownInterval = setInterval(() => {
        countdownValue--;
        setCountdown(countdownValue);
        
        if (countdownValue <= 0) {
          clearInterval(countdownInterval);
          console.log('🕒 Auto-redirecting to homepage after 30 seconds');
          // Use both setLocation and window.location as fallback
          try {
            setLocation('/');
            // Fallback method if wouter navigation fails
            setTimeout(() => {
              window.location.href = '/';
            }, 100);
          } catch (error) {
            console.error('Navigation error:', error);
            window.location.href = '/';
          }
        }
      }, 1000); // Update every second

      return () => clearInterval(countdownInterval);
    }
  }, [showAnimatedResult, animationComplete, setLocation]);

  // Remove farewell message as requested by user

  // Show animated result first
  if (showAnimatedResult) {
    console.log('🎬 Rendering AnimatedResult component');
    return (
      <AnimatedResult 
        finalResult={answers.mostImportantTopic}
        language={language}
        onComplete={() => {
          console.log('✅ ANIMATION COMPLETE - SHOWING FINAL RESULTS NOW');
          setShowAnimatedResult(false);
          setAnimationComplete(true);
          
          // Speak each part of the result separately
          const actionType = language === 'en' ? 
            (answers.actionChoice === 'uitvinden' ? 'INVENTOR' :
             answers.actionChoice === 'actie' ? 'ACTIVIST' :
             answers.actionChoice === 'veranderen' ? 'CHANGEMAKER' : 'FUTURE MAKER') :
            (answers.actionChoice === 'uitvinden' ? 'UITVINDER' :
             answers.actionChoice === 'actie' ? 'ACTIEVOERDER' :
             answers.actionChoice === 'veranderen' ? 'VERANDERAAR' : 'TOEKOMSTMAKER');
          
          // Create a sequential speech function that doesn't cancel previous speech
          const titleText = language === 'en' ? 
            (actionType.startsWith('I') || actionType.startsWith('A') ? 'You are an' : 'You are a') : 
            'Jij bent een';
          const forText = language === 'en' ? 'for' : 'voor';
          const topicName = getTopicName(answers.mostImportantTopic, language);
          
          console.log('🎤 Starting continuous speech for results');
          
          // Create complete text to speak as one continuous piece
          const completeResultText = `${titleText} ${actionType} ${forText} ${topicName}. ${motivationalMessage}`;
          
          console.log('🎤 Complete text to speak:', completeResultText);
          
          // Function to speak complete text with proper voice selection
          const speakCompleteResult = (text: string, lang: 'nl' | 'en' = 'nl') => {
            if (!('speechSynthesis' in window)) return;
            
            // Cancel any existing speech first
            speechSynthesis.cancel();
            
            // Wait for voices to be loaded before creating utterance
            const ensureVoicesLoaded = () => {
              return new Promise<void>((resolve) => {
                const voices = speechSynthesis.getVoices();
                if (voices.length > 0) {
                  resolve();
                } else {
                  speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true });
                  // Trigger voice loading
                  speechSynthesis.getVoices();
                }
              });
            };
            
            ensureVoicesLoaded().then(() => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = lang === 'en' ? 'en-US' : 'nl-NL';
              utterance.rate = lang === 'en' ? 0.85 : 0.85;
              utterance.pitch = lang === 'en' ? 1.1 : 1.0;
              utterance.volume = 1.0;
              
              // Select appropriate female voice
              const voices = speechSynthesis.getVoices();
              
              if (lang === 'en') {
                // English female voice selection
                console.log('Available English voices:', voices.filter(v => v.lang.startsWith('en')).map(v => ({ name: v.name, lang: v.lang })));
                
                const englishFemaleVoice = voices.find(voice => 
                  (voice.lang === 'en-US' || voice.lang === 'en-GB') && 
                  (voice.name.toLowerCase().includes('samantha') ||
                   voice.name.toLowerCase().includes('allison') ||
                   voice.name.toLowerCase().includes('ava') ||
                   voice.name.toLowerCase().includes('karen') ||
                   voice.name.toLowerCase().includes('female') ||
                   voice.name.toLowerCase().includes('zira'))
                ) || voices.find(voice => 
                  (voice.lang === 'en-US' || voice.lang === 'en-GB') && 
                  voice.name.toLowerCase().includes('google') &&
                  !voice.name.toLowerCase().includes('male')
                ) || voices.find(voice => 
                  (voice.lang === 'en-US' || voice.lang === 'en-GB') &&
                  !voice.name.toLowerCase().includes('male') &&
                  !voice.name.toLowerCase().includes('david') &&
                  !voice.name.toLowerCase().includes('mark')
                );
                
                if (englishFemaleVoice) {
                  utterance.voice = englishFemaleVoice;
                  console.log('✓ Selected English female voice:', englishFemaleVoice.name);
                } else {
                  console.log('⚠️ No English female voice found, using default');
                }
              } else {
                // Dutch female voice selection - CONSISTENT WITH useSpeech.ts
                console.log('Available Dutch voices:', voices.filter(v => v.lang.startsWith('nl')).map(v => ({ name: v.name, lang: v.lang })));
                
                // NETHERLANDS DUTCH ONLY (nl-NL) - NO BELGIAN DUTCH
                const dutchFemaleVoice = voices.find(voice => 
                  voice.lang === 'nl-NL' && 
                  voice.name.toLowerCase().includes('google') &&
                  voice.name.toLowerCase().includes('nederlands') &&
                  !voice.name.toLowerCase().includes('male')
                ) || voices.find(voice => 
                  voice.lang === 'nl-NL' && 
                  (voice.name.toLowerCase().includes('claire') ||
                   voice.name.toLowerCase().includes('saskia') ||
                   voice.name.toLowerCase().includes('lotte') ||
                   voice.name.toLowerCase().includes('fenna') ||
                   voice.name.toLowerCase().includes('emma') ||
                   voice.name.toLowerCase().includes('anna') ||
                   voice.name.toLowerCase().includes('female') ||
                   voice.name.toLowerCase().includes('premium'))
                ) || voices.find(voice => 
                  voice.lang === 'nl-NL' && 
                  !voice.name.toLowerCase().includes('frank') &&
                  !voice.name.toLowerCase().includes('xander') &&
                  !voice.name.toLowerCase().includes('male') &&
                  !voice.name.toLowerCase().includes('ruben') &&
                  !voice.name.toLowerCase().includes('jeroen') &&
                  !voice.name.toLowerCase().includes('david') &&
                  !voice.name.toLowerCase().includes('mark') &&
                  !voice.name.toLowerCase().includes('bas') &&
                  !voice.name.toLowerCase().includes('tim') &&
                  !voice.name.toLowerCase().includes('rob')
                );
                
                if (dutchFemaleVoice) {
                  utterance.voice = dutchFemaleVoice;
                  console.log('✓ Selected Dutch female voice:', dutchFemaleVoice.name);
                  
                  // Apply same voice-specific optimizations as useSpeech.ts
                  if (dutchFemaleVoice.name.toLowerCase().includes('google')) {
                    utterance.pitch = 1.1; // Slight adjustment for Google voices
                    utterance.rate = 0.9;
                  }
                } else {
                  console.log('⚠️ No true Dutch female voice found, applying feminine fallback');
                  // Apply maximum feminine settings to ensure female sound
                  utterance.pitch = 1.3; // Higher pitch for feminine sound
                  utterance.rate = 0.85; // Slower for femininity
                }
              }
              
              // Add event handlers
              utterance.onstart = () => {
                console.log('🎤 Started speaking complete result:', lang);
              };
              
              utterance.onend = () => {
                console.log('🔇 Finished speaking complete result');
              };
              
              utterance.onerror = (event) => {
                console.error('❌ Speech error in Results:', event);
              };
              
              // Speak the complete text
              speechSynthesis.speak(utterance);
              console.log('🎤 Speaking complete result:', text.substring(0, 50) + '...', 'Language:', lang);
            });
          };
          
          // Speak the complete result as one piece
          speakCompleteResult(completeResultText, language);
        }}
      />
    );
  }

  console.log('🎯 Rendering final results section - UITSLAG VAN DE VRAGEN');

  const handleStop = () => {
    // Optionally perform any cleanup here
    onRestart();
  };

  // Create topic-specific gradient based on hex color
  const getTopicGradient = (hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    if (rgb) {
      const darkerRgb = {
        r: Math.max(0, rgb.r - 30),
        g: Math.max(0, rgb.g - 30),
        b: Math.max(0, rgb.b - 30)
      };
      return `linear-gradient(135deg, ${hexColor} 0%, rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b}) 100%)`;
    }
    return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)';
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center p-6 text-white relative bg-gradient-to-br from-purple-900 to-indigo-900">
      <div className="text-center max-w-2xl w-full relative z-10">
        {/* Mystical crystal ball with result */}
        <div className="mb-6">
          <div 
            className="w-32 h-32 mx-auto rounded-full shadow-2xl"
            style={{ 
              background: `linear-gradient(135deg, ${topicData.hexColor}, ${topicData.hexColor}dd, #1e1b4b)`,
              border: `3px solid ${topicData.hexColor}80`
            }}
          >
            <div className="w-full h-full rounded-full flex items-center justify-center text-6xl">
              {topicData?.icon || '🔮'}
            </div>
          </div>
        </div>
        
        {/* Results card directly under the crystal ball */}
        <div className="bg-white bg-opacity-40 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white border-opacity-30">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {language === 'en' ? 
              ((answers.actionChoice === 'uitvinden' || answers.actionChoice === 'actie') ? 'You are an...' : 'You are a...') : 
              'Jij bent een...'}
          </h2>
          
          <div className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            {language === 'en' ? 
              (answers.actionChoice === 'uitvinden' ? 'INVENTOR' :
               answers.actionChoice === 'actie' ? 'ACTIVIST' :
               answers.actionChoice === 'veranderen' ? 'CHANGEMAKER' : 'FUTURE MAKER')
              :
              (answers.actionChoice === 'uitvinden' ? 'UITVINDER' :
               answers.actionChoice === 'actie' ? 'ACTIEVOERDER' :
               answers.actionChoice === 'veranderen' ? 'VERANDERAAR' : 'TOEKOMSTMAKER')
            }
          </div>
          <div className="text-2xl mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            {language === 'en' ? 'for' : 'voor'}
          </div>
          <div className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-lg">
            {getTopicName(answers.mostImportantTopic, language)}
          </div>
          
          <div className="fortune-bg-secondary rounded-xl p-6 mt-6 border-2 border-yellow-400/30">
            <p className="text-lg font-medium text-white leading-relaxed">
              {motivationalMessage}
            </p>
          </div>
        </div>

        {/* Mystical farewell */}
        <div className="text-center mb-6">
          <p className="text-yellow-300 text-sm italic">
            {language === 'en' ? "The fortune teller's vision is complete..." : "De visie van de waarzegger is compleet..."}
          </p>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <Button 
            onClick={handleStop}
            className="fortune-bg-accent hover:bg-yellow-600 text-purple-900 px-8 py-4 rounded-full text-xl font-semibold transition-all transform hover:scale-105 shadow-lg border-2 border-purple-400/30 hover:border-purple-400/60"
          >
            <span className="mr-2">🔮</span>
            {language === 'en' ? 'New Reading' : 'Nieuwe Lezing'}
          </Button>
          
          {countdown > 0 && (
            <div className="text-yellow-300 text-sm text-center opacity-70">
              {language === 'en' 
                ? `Returning to welcome page in ${countdown} seconds...`
                : `Terug naar welkomstpagina in ${countdown} seconden...`}
            </div>
          )}
        </div>

      </div>
      
      {/* Reduced background emojis for less distraction */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
        {Array.from({ length: 8 }).map((_, i) => {
          const stars = ['⭐', '✨', '🌟', '💫'];
          const star = stars[i % stars.length];
          return (
            <div
              key={`star-${i}`}
              className="absolute text-yellow-400 animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${0.8 + Math.random() * 0.5}rem`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            >
              {star}
            </div>
          );
        })}
      </div>
    </section>
  );
}
