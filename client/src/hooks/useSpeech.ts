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

    // Force language to be explicit and ensure proper pronunciation
    const targetLanguage = language || 'nl';

    // Add natural pauses and improve text for speech with feminine intonation
    const improvedText = text
      .replace(/\?/g, '?.. ') // Longer pause after questions for feminine intonation
      .replace(/\!/g, '!.. ') // Longer pause after exclamations
      .replace(/\./g, '... ') // Longer pause after sentences for more gentle delivery
      .replace(/\,/g, ',.. ') // Slightly longer pause after commas
      .replace(/\:/g, ':.. ') // Pause after colons
      .replace(/\d+/g, (match) => `${match} `) // Add space after numbers for better pronunciation
      .replace(/\s+/g, ' ') // Clean up multiple spaces
      .trim();

    const utterance = new SpeechSynthesisUtterance(improvedText);
    
    // Use the explicit language parameter
    const detectedLanguage = targetLanguage;
    
    if (detectedLanguage === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 0.95; // Faster, more natural
      utterance.pitch = 1.1; // Slightly higher, more pleasant
      utterance.volume = 0.8; // Softer, more gentle
      
      // Find the best female English voice with strict language matching
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.toLowerCase().includes('samantha') || 
         voice.name.toLowerCase().includes('susan') || 
         voice.name.toLowerCase().includes('karen') ||
         voice.name.toLowerCase().includes('female'))
      ) || voices.find(voice => 
        voice.lang === 'en-US' && voice.name.toLowerCase().includes('google')
      ) || voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('microsoft'))
      ) || voices.find(voice => voice.lang === 'en-US') || voices.find(voice => voice.lang.startsWith('en-'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected English voice:', preferredVoice.name, preferredVoice.lang);
      }
    } else {
      utterance.lang = 'nl-NL';
      utterance.rate = 0.7; // Much slower for very natural, gentle feminine delivery
      utterance.pitch = 1.5; // Very high pitch for clearly feminine voice
      utterance.volume = 1.0; // Full volume for clarity
      
      // Find the best female Dutch voice with strict language matching
      const voices = speechSynthesis.getVoices();
      console.log('Available Dutch voices:', voices.filter(v => v.lang.startsWith('nl')).map(v => ({ name: v.name, lang: v.lang })));
      
      // Look for explicitly female voices first
      let preferredVoice = voices.find(voice => 
        voice.lang === 'nl-NL' && 
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('claire') || 
         voice.name.toLowerCase().includes('saskia') ||
         voice.name.toLowerCase().includes('lotte') ||
         voice.name.toLowerCase().includes('fenna') ||
         voice.name.toLowerCase().includes('emma') ||
         voice.name.toLowerCase().includes('anna'))
      );

      // If no explicitly female voice, try to find any Dutch voice that's not obviously male
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang === 'nl-NL' && 
          !voice.name.toLowerCase().includes('frank') && 
          !voice.name.toLowerCase().includes('male') &&
          !voice.name.toLowerCase().includes('ruben') &&
          !voice.name.toLowerCase().includes('jeroen') &&
          !voice.name.toLowerCase().includes('david') &&
          !voice.name.toLowerCase().includes('mark')
        );
      }

      // If still no good voice, try Google voices (they tend to be more neutral)
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => 
          voice.lang === 'nl-NL' && 
          voice.name.toLowerCase().includes('google')
        );
      }

      // Last resort: any Dutch voice
      if (!preferredVoice) {
        preferredVoice = voices.find(voice => voice.lang === 'nl-NL') || 
                       voices.find(voice => voice.lang.startsWith('nl-'));
      }
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected Dutch voice:', preferredVoice.name, preferredVoice.lang);
        
        // Always use high pitch and slower rate for more feminine sound
        utterance.pitch = 1.5; // Very high pitch for feminine voice
        utterance.rate = 0.7; // Slower for more gentle, feminine delivery
        console.log('Applied feminine voice settings: pitch=1.5, rate=0.7');
      } else {
        console.log('No Dutch voice found, using browser default with feminine settings');
        utterance.pitch = 1.5;
        utterance.rate = 0.7;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Small delay to ensure voices are loaded and speech sounds more natural
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 100);
  }, [isSupported]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stopSpeaking, isSpeaking, isSupported };
}
