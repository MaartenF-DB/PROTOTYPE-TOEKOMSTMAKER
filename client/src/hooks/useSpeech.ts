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

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Detect language from text or use provided language
    const detectedLanguage = language || (text.match(/[a-zA-Z]/) && text.match(/[a-zA-Z]/g)!.length > text.length / 2 ? 'en' : 'nl');
    
    if (detectedLanguage === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.3; // Higher pitch for child-friendly voice
      utterance.volume = 1;
      
      // Try to find a female English voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en-US') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('samantha') || 
         voice.name.toLowerCase().includes('susan') || 
         voice.name.toLowerCase().includes('karen') ||
         voice.name.toLowerCase().includes('zira'))
      ) || voices.find(voice => voice.lang.includes('en-US')) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    } else {
      utterance.lang = 'nl-NL';
      utterance.rate = 0.8;
      utterance.pitch = 1.2; // Slightly higher pitch for children
      utterance.volume = 1;
      
      // Try to find a female Dutch voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('nl') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('claire') || 
         voice.name.toLowerCase().includes('xander') ||
         voice.name.toLowerCase().includes('google'))
      ) || voices.find(voice => voice.lang.includes('nl-NL')) || voices.find(voice => voice.lang.includes('nl'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
  }, [isSupported]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stopSpeaking, isSpeaking, isSupported };
}
