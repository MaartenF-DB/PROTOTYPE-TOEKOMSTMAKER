import { useState, useEffect } from 'react';
import { TOPICS } from '@/types/survey';

// Import topic illustrations
import vredeImg from '@assets/VREDE_1752670457359.png';
import gezondheidImg from '@assets/GEZONDHEID_1752670458852.png';
import rijkdomImg from '@assets/RIJKDOM_1752670460242.png';
import vrijeTijdImg from '@assets/VRIJE TIJD_1752670475302.png';
import klimaatImg from '@assets/KLIMAAT_1752670476669.png';
import wonenImg from '@assets/WONEN_1752670478064.png';

const topicImages = {
  VREDE: vredeImg,
  GEZONDHEID: gezondheidImg,
  RIJKDOM: rijkdomImg,
  'VRIJE TIJD': vrijeTijdImg,
  KLIMAAT: klimaatImg,
  WONEN: wonenImg
};

interface RankingQuestionProps {
  ranking: string[];
  onRankingChange: (ranking: string[]) => void;
}

export function RankingQuestion({ ranking, onRankingChange }: RankingQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

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

    const newRanking = [...ranking];
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
      <p className="text-lg mb-6">Sleep de onderwerpen van minst belangrijk naar meest belangrijk!</p>
      
      <div className="grid grid-cols-6 gap-4 mb-6">
        {ranking.map((topic, index) => {
          const topicData = TOPICS[topic as keyof typeof TOPICS];
          const topicImage = topicImages[topic as keyof typeof topicImages];
          return (
            <div
              key={topic}
              draggable
              onDragStart={(e) => handleDragStart(e, topic)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, topic)}
              onDragEnd={handleDragEnd}
              onClick={() => setSelectedTopic(selectedTopic === topic ? null : topic)}
              className={`p-4 rounded-xl cursor-move shadow-lg transform hover:scale-105 transition-all text-white ${
                draggedItem === topic ? 'opacity-50' : ''
              }`}
              style={{ backgroundColor: topicData?.hexColor || '#6B7280' }}
            >
              {topicImage && (
                <img 
                  src={topicImage} 
                  alt={topic} 
                  className="w-12 h-12 mx-auto mb-2 object-contain"
                />
              )}
              <div className="text-2xl mb-2 text-center">{topicData?.icon || '❓'}</div>
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
        <span className="text-white">Minst belangrijk</span>
        <span className="text-white">Meest belangrijk</span>
      </div>
    </div>
  );
}
