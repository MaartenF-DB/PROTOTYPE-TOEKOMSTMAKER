import { useState, useEffect } from 'react';
import { TOPICS } from '@/types/survey';
import { translations } from '@/lib/translations';
import { useSpeech } from '@/hooks/useSpeech';

interface RankingQuestionProps {
  ranking: string[];
  onRankingChange: (ranking: string[]) => void;
  language?: 'nl' | 'en';
}

// Shuffle function to randomize topic order
const shuffleArray = (array: string[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export function RankingQuestion({ ranking, onRankingChange, language = 'nl' }: RankingQuestionProps) {
  const t = translations[language];
  const { speak } = useSpeech();
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [shuffledTopics, setShuffledTopics] = useState<string[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchItem, setTouchItem] = useState<string | null>(null);

  // Initialize shuffled topics once and speak instructions
  useEffect(() => {
    if (shuffledTopics.length === 0) {
      const topicKeys = Object.keys(TOPICS);
      const shuffled = shuffleArray(topicKeys);
      setShuffledTopics(shuffled);
      // Initialize ranking with shuffled order if not already set
      if (ranking.length === 0) {
        onRankingChange(shuffled);
      }
      
      // Speak the instruction text when the component first loads
      const instructionText = language === 'en' ? 
        'Drag the topics to the right place.' : 
        'Versleep de onderwerpen naar de goede plek.';
      speak(instructionText, language);
    }
  }, [ranking, onRankingChange, shuffledTopics.length, speak, language]);

  // Use the existing ranking or shuffled topics
  const displayRanking = ranking.length > 0 ? ranking : shuffledTopics;

  const handleDragStart = (e: React.DragEvent, topic: string) => {
    setDraggedItem(topic);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTopic: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetTopic) return;

    const newRanking = [...displayRanking];
    const draggedIndex = newRanking.indexOf(draggedItem);
    const targetIndex = newRanking.indexOf(targetTopic);

    // Swap the items
    newRanking[draggedIndex] = targetTopic;
    newRanking[targetIndex] = draggedItem;

    onRankingChange(newRanking);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent, topic: string) => {
    const touch = e.touches[0];
    setTouchStartY(touch.clientY);
    setTouchItem(topic);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartY || !touchItem) return;
    
    const touch = e.touches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - touchStartY;
    
    // Prevent default scroll behavior
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent, targetTopic: string) => {
    if (!touchStartY || !touchItem || touchItem === targetTopic) {
      setTouchStartY(null);
      setTouchItem(null);
      return;
    }

    const touch = e.changedTouches[0];
    const currentY = touch.clientY;
    const deltaY = currentY - touchStartY;
    
    // Only trigger swap if there's significant movement
    if (Math.abs(deltaY) > 50) {
      const newRanking = [...displayRanking];
      const draggedIndex = newRanking.indexOf(touchItem);
      const targetIndex = newRanking.indexOf(targetTopic);

      // Swap the items
      newRanking[draggedIndex] = targetTopic;
      newRanking[targetIndex] = touchItem;

      onRankingChange(newRanking);
    }

    setTouchStartY(null);
    setTouchItem(null);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <p className="text-white text-lg">
          {language === 'en' ? 'Drag the topics to the right place.' : 'Versleep de onderwerpen naar de goede plek.'}
        </p>
      </div>
      <p className="text-sm mb-6 opacity-75">{t.ranking.clickForInfo}</p>
      
      <div className="grid grid-cols-6 gap-4 mb-6 p-4 bg-white bg-opacity-10 rounded-xl">
        {displayRanking.map((topic, index) => {
          const topicData = TOPICS[topic as keyof typeof TOPICS];
          return (
            <div
              key={topic}
              draggable
              onDragStart={(e) => handleDragStart(e, topic)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, topic)}
              onDragEnd={handleDragEnd}
              onTouchStart={(e) => handleTouchStart(e, topic)}
              onTouchMove={handleTouchMove}
              onTouchEnd={(e) => handleTouchEnd(e, topic)}
              onClick={() => {
                const newSelected = selectedTopic === topic ? null : topic;
                setSelectedTopic(newSelected);
                // Show explanation immediately on click
                if (newSelected && topicData?.description) {
                  speak(topicData.description, language);
                }
              }}
              className={`p-4 rounded-xl cursor-move shadow-lg transform hover:scale-105 transition-all text-white border-2 select-none ${
                draggedItem === topic || touchItem === topic
                  ? 'opacity-50 border-yellow-400' 
                  : 'border-white border-opacity-30 hover:border-opacity-60'
              }`}
              style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
            >
              <div className="text-6xl mb-2 text-center topic-emoji">{topicData?.icon || '❓'}</div>
              <h3 className="text-lg font-bold text-center leading-tight px-1">{topic}</h3>
              
              {selectedTopic === topic && (
                <div className="mt-3 p-3 bg-white bg-opacity-30 rounded-lg text-sm text-white text-center font-medium leading-tight">
                  {topicData?.description}
                </div>
              )}

            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center text-lg">
        <span className="text-white font-bold">{t.ranking.leastImportant}</span>
        <span className="text-white font-bold">{t.ranking.mostImportant}</span>
      </div>
    </div>
  );
}
