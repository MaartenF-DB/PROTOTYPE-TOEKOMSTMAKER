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

  // If a value is selected, show only that option
  if (value && value !== '') {
    if (value === 'other') {
      return (
        <div className="w-full max-w-2xl mx-auto">
          <div className="p-4 rounded-xl bg-white text-gray-900 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✏️</span>
              <span className="text-lg font-medium">Anders: {otherValue}</span>
            </div>
          </div>
        </div>
      );
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      if (selectedOption) {
        return (
          <div className="w-full max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-white text-gray-900 border-2 border-gray-200">
              <div className="flex items-center space-x-3">
                {selectedOption.icon && <span className="text-2xl">{selectedOption.icon}</span>}
                <span className="text-lg font-medium">{selectedOption.label}</span>
              </div>
            </div>
          </div>
        );
      }
    }
  }

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
            onClick={() => handleOptionClick(option.value)}
            className={`p-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 flex flex-col items-center space-y-2 ${
              value === option.value
                ? 'bg-blue-600 bg-opacity-70 text-white'
                : 'bg-white bg-opacity-30 hover:bg-opacity-50 text-white'
            }`}
          >
            {option.icon && <span className="text-4xl">{option.icon}</span>}
            <span className="text-center">{option.label}</span>
          </Button>
        ))}
      </div>
      
      {showOtherInput && onOtherValueChange && (
        <Input
          value={otherValue}
          onChange={(e) => onOtherValueChange(e.target.value)}
          placeholder="Anders..."
          className="w-full p-4 text-xl text-gray-800 rounded-xl border-none shadow-lg focus:ring-4 focus:ring-blue-300 outline-none"
        />
      )}
    </div>
  );
}
