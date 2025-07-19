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
  const [touchItem, setTouchItem] = useState<string | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);
  const [hasSpoken, setHasSpoken] = useState(false);

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

  // Speak the main question when component mounts - only once
  useEffect(() => {
    // Only speak once when component first mounts and has topics
    if (shuffledTopics.length > 0 && !hasSpoken) {
      const mainQuestion = language === 'en' ? 
        "Which topic do you think is most important?" : 
        "Welk onderwerp vind jij het meest belangrijk?";
      const instructions = language === 'en' ? 
        "Drag the topics to the right place." : 
        "Sleep de onderwerpen naar de goede plek.";
      speak(`${mainQuestion} ${instructions}`, language);
      setHasSpoken(true);
    }
  }, [speak, language, shuffledTopics.length, hasSpoken]);

  // Use the existing ranking or shuffled topics
  const displayRanking = ranking.length > 0 ? ranking : shuffledTopics;

  // Get topic name and description based on language
  const getTopicName = (topicKey: string) => {
    const topic = TOPICS[topicKey as keyof typeof TOPICS];
    return language === 'en' ? topic?.nameEn : topic?.name || topicKey;
  };

  const getTopicDescription = (topicKey: string) => {
    const topic = TOPICS[topicKey as keyof typeof TOPICS];
    return language === 'en' ? topic?.descriptionEn : topic?.description || '';
  };

  // Handle drag and drop
  const handleDragStart = (e: React.DragEvent, topic: string) => {
    setDraggedItem(topic);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPosition: number) => {
    e.preventDefault();
    
    if (!draggedItem) return;

    const newRanking = [...displayRanking];
    const draggedIndex = newRanking.indexOf(draggedItem);
    
    // Remove the dragged item
    newRanking.splice(draggedIndex, 1);
    
    // Insert at the target position
    newRanking.splice(targetPosition, 0, draggedItem);

    onRankingChange(newRanking);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  // Touch event handlers for mobile support
  const handleTouchStart = (e: React.TouchEvent, topic: string) => {
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    setTouchItem(topic);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartPos || !touchItem) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos || !touchItem) return;

    const touch = e.changedTouches[0];
    const endPos = { x: touch.clientX, y: touch.clientY };
    
    // Calculate distance moved
    const distance = Math.sqrt(
      Math.pow(endPos.x - touchStartPos.x, 2) + 
      Math.pow(endPos.y - touchStartPos.y, 2)
    );

    // If significant movement, find the closest drop zone
    if (distance > 50) {
      const dropZones = document.querySelectorAll('.drop-zone');
      let closestZone = null;
      let closestDistance = Infinity;

      dropZones.forEach((zone, index) => {
        const rect = zone.getBoundingClientRect();
        const zoneCenterX = rect.left + rect.width / 2;
        const zoneCenterY = rect.top + rect.height / 2;
        
        const zoneDistance = Math.sqrt(
          Math.pow(endPos.x - zoneCenterX, 2) + 
          Math.pow(endPos.y - zoneCenterY, 2)
        );

        if (zoneDistance < closestDistance) {
          closestDistance = zoneDistance;
          closestZone = index;
        }
      });

      if (closestZone !== null) {
        const newRanking = [...displayRanking];
        const touchIndex = newRanking.indexOf(touchItem);
        
        // Remove the touched item
        newRanking.splice(touchIndex, 1);
        
        // Insert at the target position
        newRanking.splice(closestZone, 0, touchItem);

        onRankingChange(newRanking);
      }
    }

    setTouchStartPos(null);
    setTouchItem(null);
  };

  return (
    <div className="w-full">
      {/* Instruction text */}
      <div className="text-center mb-6">
        <p className="text-white text-lg">
          {language === 'en' ? 'Drag the topics to the right place.' : 'Versleep de onderwerpen naar de goede plek.'}
        </p>
      </div>
      
      {/* Interactive Ranking with Drop Zones */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-bold text-lg">{t.ranking.leastImportant}</span>
          <span className="text-white font-bold text-lg">{t.ranking.mostImportant}</span>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {[0, 1, 2, 3, 4, 5].map((position) => {
            const topicAtPosition = displayRanking[position];
            const topicData = topicAtPosition ? TOPICS[topicAtPosition as keyof typeof TOPICS] : null;
            const isBeingDragged = draggedItem === topicAtPosition || touchItem === topicAtPosition;
            
            return (
              <div
                key={position}
                className="drop-zone"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, position)}
              >
                <div className="h-48 border-2 border-dashed border-white border-opacity-50 rounded-xl flex flex-col items-center justify-center bg-white bg-opacity-10 hover:bg-opacity-20 transition-all relative">
                  {/* Position indicator */}
                  <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-gray-800 text-lg font-bold">{6 - position}</span>
                  </div>
                  
                  {/* Topic content */}
                  {topicAtPosition && topicData && (
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, topicAtPosition)}
                      onDragEnd={handleDragEnd}
                      onTouchStart={(e) => handleTouchStart(e, topicAtPosition)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onClick={() => {
                        const newSelected = selectedTopic === topicAtPosition ? null : topicAtPosition;
                        setSelectedTopic(newSelected);
                        // Remove audio when clicking on topics
                      }}
                      className={`p-4 rounded-lg cursor-move shadow-lg transform hover:scale-105 transition-all duration-300 text-white border-2 select-none w-full ${
                        isBeingDragged
                          ? 'opacity-50 border-yellow-400 scale-110 animate-pulse' 
                          : 'border-white border-opacity-30 hover:border-opacity-60'
                      }`}
                      style={{ backgroundColor: topicData.hexColor || '#6B7280' }}
                    >
                      <div className="text-3xl mb-1 text-center">{topicData.icon}</div>
                      <h3 className="text-xs font-bold text-center">{getTopicName(topicAtPosition)}</h3>
                      
                      {selectedTopic === topicAtPosition && (
                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded text-xs text-white text-center">
                          {getTopicDescription(topicAtPosition)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Empty slot message */}
                  {!topicAtPosition && (
                    <div className="text-white text-xs opacity-50 text-center">
                      Versleep hier een onderwerp
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}