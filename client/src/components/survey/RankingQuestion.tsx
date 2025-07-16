import { useState, useEffect } from 'react';
import { TOPICS } from '@/types/survey';

interface RankingQuestionProps {
  ranking: string[];
  onRankingChange: (ranking: string[]) => void;
}

export function RankingQuestion({ ranking, onRankingChange }: RankingQuestionProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

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
          return (
            <div
              key={topic}
              draggable
              onDragStart={(e) => handleDragStart(e, topic)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, topic)}
              onDragEnd={handleDragEnd}
              className={`p-4 rounded-xl cursor-move shadow-lg transform hover:scale-105 transition-all text-white ${
                topicData?.color || 'bg-gray-500'
              } ${draggedItem === topic ? 'opacity-50' : ''}`}
            >
              <div className="text-2xl mb-2 text-center">{topicData?.icon || '❓'}</div>
              <h3 className="text-lg font-bold text-center">{topic}</h3>
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between items-center text-sm">
        <span className="bg-red-500 px-3 py-1 rounded-full">Minst belangrijk</span>
        <span className="bg-green-500 px-3 py-1 rounded-full">Meest belangrijk</span>
      </div>
    </div>
  );
}
