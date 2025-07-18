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

    // Add natural pauses and improve text for speech
    const improvedText = text
      .replace(/\?/g, '? ') // Add pause after questions
      .replace(/\!/g, '! ') // Add pause after exclamations
      .replace(/\./g, '. ') // Add pause after sentences
      .replace(/\,/g, ', ') // Add slight pause after commas
      .replace(/\:/g, ': ') // Add pause after colons
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
      utterance.rate = 0.9; // Faster, more natural
      utterance.pitch = 0.95; // Lower, more human-like
      utterance.volume = 0.8; // Softer, more gentle
      
      // Find the best female Dutch voice with strict language matching
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'nl-NL' && 
        (voice.name.toLowerCase().includes('claire') || 
         voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('saskia') ||
         voice.name.toLowerCase().includes('lotte'))
      ) || voices.find(voice => 
        voice.lang === 'nl-NL' && voice.name.toLowerCase().includes('google')
      ) || voices.find(voice => 
        voice.lang === 'nl-NL' && 
        !voice.name.toLowerCase().includes('frank') && 
        !voice.name.toLowerCase().includes('male')
      ) || voices.find(voice => 
        voice.lang === 'nl-NL'
      ) || voices.find(voice => voice.lang.startsWith('nl-'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected Dutch voice:', preferredVoice.name, preferredVoice.lang);
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
