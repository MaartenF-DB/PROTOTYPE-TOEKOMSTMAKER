import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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
}

export function MultipleChoice({
  options,
  value,
  onValueChange,
  otherValue = '',
  onOtherValueChange,
  allowOther = false,
  columns = 2
}: MultipleChoiceProps) {
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    setShowOtherInput(value === 'other');
  }, [value]);

  const handleOptionClick = (optionValue: string) => {
    onValueChange(optionValue);
    if (optionValue === 'other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
    }
  };

  const gridCols = columns === 1 ? 'grid-cols-1' : 
                  columns === 2 ? 'grid-cols-1 md:grid-cols-2' :
                  columns === 3 ? 'grid-cols-1 md:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-4';

  return (
    <div className="w-full">
      <div className={`grid ${gridCols} gap-4 mb-6`}>
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={() => handleOptionClick(option.value)}
            className={`p-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 ${
              value === option.value
                ? 'bg-blue-600 bg-opacity-70 text-white'
                : 'bg-white bg-opacity-30 hover:bg-opacity-50 text-white'
            }`}
          >
            {option.icon && <span className="mr-2 text-2xl">{option.icon}</span>}
            {option.label}
          </Button>
        ))}
      </div>
      
      {showOtherInput && onOtherValueChange && (
        <Input
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
          placeholder="Typ hier je antwoord..."
          className="w-full p-4 text-xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
        />
      )}
    </div>
  );
}
