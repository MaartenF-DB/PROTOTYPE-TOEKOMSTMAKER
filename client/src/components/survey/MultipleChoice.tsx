import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useSpeech } from '@/hooks/useSpeech';

interface Option {
  value: string;
  label: string;
  icon?: string;
}

interface MultipleChoiceProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  otherValue?: string;
  onOtherValueChange?: (value: string) => void;
  allowOther?: boolean;
  columns?: number;
  language?: 'nl' | 'en';
}

export function MultipleChoice({
  options,
  value,
  onValueChange,
  otherValue = '',
  onOtherValueChange,
  allowOther = false,
  columns = 2,
  language = 'nl'
}: MultipleChoiceProps) {
  const [showOtherInput, setShowOtherInput] = useState(false);
  const { speak } = useSpeech();

  useEffect(() => {
    setShowOtherInput(value === 'other');
  }, [value]);

  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    onValueChange(optionValue);
    if (optionValue === 'other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      // Read the selected answer aloud
      speak(optionLabel, language);
    }
  };

  // Keep all options visible - no simplified display

  const gridCols = columns === 1 ? 'grid-cols-1' : 
                  columns === 2 ? 'grid-cols-2' :
                  columns === 3 ? 'grid-cols-3' :
                  columns === 4 ? 'grid-cols-4' :
                  columns === 5 ? 'grid-cols-5' :
                  columns === 6 ? 'grid-cols-6' :
                  columns === 7 ? 'grid-cols-7' :
                  'grid-cols-8';

  return (
    <div className="w-full">
      <div className={`grid ${gridCols} gap-4 mb-6`}>
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleOptionClick(option.value, option.label)}
            className={`p-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 flex flex-col items-center justify-center space-y-3 min-h-[7rem] ${
              value === option.value
                ? 'bg-blue-600 bg-opacity-70 text-white'
                : 'bg-white bg-opacity-30 hover:bg-opacity-50 text-white'
            }`}
          >
            {option.icon && <span className="text-6xl multiple-choice-emoji">{option.icon}</span>}
            <span className="text-center">{option.label}</span>
          </Button>
        ))}
      </div>
      
      {showOtherInput && onOtherValueChange && (
        <Input
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
          placeholder="Anders..."
          className="w-full py-4 px-20 text-xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
        />
      )}
    </div>
  );
}
