import { useCallback, useEffect, useState } from 'react';

export function useSpeech() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setIsSupported('speechSynthesis' in window);
  }, []);

  const speak = useCallback((text: string, language?: 'nl' | 'en') => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const targetLanguage = language || 'nl';

    // Clean text for better pronunciation
    const cleanText = text
      .replace(/\?/g, '? ') 
      .replace(/\!/g, '! ') 
      .replace(/\./g, '. ') 
      .replace(/\,/g, ', ') 
      .replace(/\:/g, ': ') 
      .replace(/\s+/g, ' ') 
      .trim();

    // Wait for voices to be loaded
    const ensureVoicesLoaded = () => {
      return new Promise<void>((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length > 0) {
          resolve();
        } else {
          const handleVoicesChanged = () => {
            resolve();
          };
          speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged, { once: true });
        }
      });
    };

    ensureVoicesLoaded().then(() => {
      const utterance = new SpeechSynthesisUtterance(cleanText);
    
      if (targetLanguage === 'en') {
        // English female voice configuration
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.2;
        utterance.volume = 0.9;
        
        const voices = speechSynthesis.getVoices();
        console.log('Available English voices:', voices.filter(v => v.lang.startsWith('en')).map(v => ({ name: v.name, lang: v.lang })));
        
        // Priority order for English female voices
        const femaleVoice = voices.find(voice => 
          voice.lang === 'en-US' && 
          (voice.name.toLowerCase().includes('samantha') ||
           voice.name.toLowerCase().includes('allison') ||
           voice.name.toLowerCase().includes('ava') ||
           voice.name.toLowerCase().includes('susan') ||
           voice.name.toLowerCase().includes('karen') ||
           voice.name.toLowerCase().includes('female'))
        ) || voices.find(voice => 
          voice.lang === 'en-US' && 
          voice.name.toLowerCase().includes('google') &&
          !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang === 'en-US' && 
          (voice.name.toLowerCase().includes('zira') || 
           voice.name.toLowerCase().includes('microsoft')) &&
          !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang === 'en-US' &&
          !voice.name.toLowerCase().includes('male') &&
          !voice.name.toLowerCase().includes('david') &&
          !voice.name.toLowerCase().includes('mark')
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log('✓ Selected English female voice:', femaleVoice.name);
        } else {
          console.log('⚠️ No English female voice found, using default with feminine settings');
          utterance.pitch = 1.3; // Higher pitch to compensate
        }
        
      } else {
        // Dutch female voice configuration - optimized to match English quality
        utterance.lang = 'nl-NL';
        utterance.rate = 0.9; // Slightly faster for better flow
        utterance.pitch = 1.1; // Slightly higher for warmer tone like English
        utterance.volume = 0.95; // Higher volume for clarity
        
        const voices = speechSynthesis.getVoices();
        console.log('Available Dutch voices:', voices.filter(v => v.lang.startsWith('nl')).map(v => ({ name: v.name, lang: v.lang })));
        
        // Enhanced priority order for Dutch female voices - Apple iOS/iPad optimized
        const femaleVoice = voices.find(voice => 
          voice.lang === 'nl-NL' && 
          (voice.name.toLowerCase().includes('claire') ||
           voice.name.toLowerCase().includes('xander') ||  // iOS Xander can sound feminine with high pitch
           voice.name.toLowerCase().includes('saskia') ||
           voice.name.toLowerCase().includes('lotte') ||
           voice.name.toLowerCase().includes('fenna') ||
           voice.name.toLowerCase().includes('emma') ||
           voice.name.toLowerCase().includes('anna') ||
           voice.name.toLowerCase().includes('female') ||
           voice.name.toLowerCase().includes('premium'))
        ) || voices.find(voice => 
          voice.lang === 'nl-NL' && 
          voice.name.toLowerCase().includes('google') &&
          !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang === 'nl-NL' && 
          voice.name.toLowerCase().includes('enhanced') &&
          !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          (voice.lang === 'nl-NL' || voice.lang === 'nl-BE') && 
          !voice.name.toLowerCase().includes('frank') &&
          !voice.name.toLowerCase().includes('male') &&
          !voice.name.toLowerCase().includes('ruben') &&
          !voice.name.toLowerCase().includes('jeroen') &&
          !voice.name.toLowerCase().includes('david') &&
          !voice.name.toLowerCase().includes('mark') &&
          !voice.name.toLowerCase().includes('bas') &&
          !voice.name.toLowerCase().includes('tim') &&
          !voice.name.toLowerCase().includes('rob')
        ) || voices.find(voice => 
          voice.lang.startsWith('nl') && 
          voice.name.toLowerCase().includes('compact') &&
          !voice.name.toLowerCase().includes('male')
        ) || voices.find(voice => 
          voice.lang.startsWith('nl') && 
          voice.name.toLowerCase().includes('xander')  // Fallback to Xander with high pitch
        );
        
        if (femaleVoice) {
          utterance.voice = femaleVoice;
          console.log('✓ Selected Dutch female voice:', femaleVoice.name);
          
          // Apply Apple device specific adjustments for consistent femininity
          if (femaleVoice.name.toLowerCase().includes('xander')) {
            utterance.pitch = 1.4; // Higher pitch for Xander to sound feminine
            utterance.rate = 0.8;  // Slower for clearer feminine delivery
          }
        } else {
          console.log('⚠️ No Dutch female voice found, applying Apple device optimized settings');
          // Force feminine voice characteristics for Apple devices
          utterance.pitch = 1.4; // Very high pitch for feminine sound
          utterance.rate = 0.8;  // Slower for clarity and femininity
          
          // Try to find any available Dutch voice and modify it
          const anyDutchVoice = voices.find(voice => voice.lang.startsWith('nl'));
          if (anyDutchVoice) {
            utterance.voice = anyDutchVoice;
            console.log('🔧 Using Dutch voice with Apple-optimized feminine adjustments:', anyDutchVoice.name);
          }
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        console.log('🎤 Started speaking:', targetLanguage);
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('🔇 Finished speaking');
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        console.error('❌ Speech error:', event);
      };

      speechSynthesis.speak(utterance);
    });
    
  }, [isSupported]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    console.log('⏹️ Speech stopped');
  }, []);

  return { speak, stopSpeaking, isSpeaking, isSupported };
}