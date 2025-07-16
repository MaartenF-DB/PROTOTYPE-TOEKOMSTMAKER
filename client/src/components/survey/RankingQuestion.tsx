import { useState, useEffect } from 'react';
import { TOPICS } from '@/types/survey';

interface RankingQuestionProps {
  ranking: string[];
  onRankingChange: (ranking: string[]) => void;
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

export function RankingQuestion({ ranking, onRankingChange }: RankingQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [shuffledTopics, setShuffledTopics] = useState<string[]>([]);

  // Initialize shuffled topics once
  useEffect(() => {
    if (shuffledTopics.length === 0) {
      const topicKeys = Object.keys(TOPICS);
      const shuffled = shuffleArray(topicKeys);
      setShuffledTopics(shuffled);
      // Initialize ranking with shuffled order if not already set
      if (ranking.length === 0) {
        onRankingChange(shuffled);
      }
    }
  }, [ranking, onRankingChange, shuffledTopics.length]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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

  return (
    <div className="w-full">
      <p className="text-lg mb-4">Sleep de onderwerpen van minst belangrijk naar meest belangrijk!</p>
      <p className="text-sm mb-6 opacity-75">Klik op de onderwerpen voor meer info.</p>
      
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
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={`p-4 rounded-xl cursor-move shadow-lg transform hover:scale-105 transition-all text-white border-2 ${
                draggedItem === topic 
                  ? 'opacity-50 border-yellow-400' 
                  : 'border-white border-opacity-30 hover:border-opacity-60'
              }`}
              style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
            >
              <div className="text-5xl mb-2 text-center">{topicData?.icon || '❓'}</div>
              <h3 className="text-sm font-bold text-center">{topic}</h3>
              
              {selectedTopic === topic && (
                <div className="mt-3 p-2 bg-white bg-opacity-20 rounded text-xs text-white text-center">
                  {topicData?.description}
                </div>
              )}

            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="text-white font-bold">Minst belangrijk</span>
        <span className="text-white font-bold">Meest belangrijk</span>
      </div>
    </div>
  );
}
