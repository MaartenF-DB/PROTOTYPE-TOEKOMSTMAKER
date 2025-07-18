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
    
    // Detect language from text or use provided language
    const detectedLanguage = language || (text.match(/[a-zA-Z]/) && text.match(/[a-zA-Z]/g)!.length > text.length / 2 ? 'en' : 'nl');
    
    if (detectedLanguage === 'en') {
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Slightly faster for more natural flow
      utterance.pitch = 1.1; // More natural pitch
      utterance.volume = 0.9; // Slightly softer volume
      
      // Try to find the most natural female English voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en-US') && 
        (voice.name.toLowerCase().includes('samantha') || 
         voice.name.toLowerCase().includes('susan') || 
         voice.name.toLowerCase().includes('karen') ||
         voice.name.toLowerCase().includes('zira') ||
         voice.name.toLowerCase().includes('google') ||
         voice.name.toLowerCase().includes('microsoft'))
      ) || voices.find(voice => 
        voice.lang.includes('en-US') && voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => voice.lang.includes('en-US')) || voices.find(voice => voice.lang.includes('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    } else {
      utterance.lang = 'nl-NL';
      utterance.rate = 0.85; // Natural speaking pace
      utterance.pitch = 1.0; // More natural pitch
      utterance.volume = 0.9; // Slightly softer volume
      
      // Try to find the most natural female Dutch voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('nl') && 
        (voice.name.toLowerCase().includes('google') || 
         voice.name.toLowerCase().includes('microsoft') ||
         voice.name.toLowerCase().includes('claire') ||
         voice.name.toLowerCase().includes('female'))
      ) || voices.find(voice => voice.lang.includes('nl-NL')) || voices.find(voice => voice.lang.includes('nl'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
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
