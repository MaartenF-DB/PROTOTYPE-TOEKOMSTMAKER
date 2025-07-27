import { Button } from '@/components/ui/button';
import { useSpeech } from '@/hooks/useSpeech';

interface LikertOption {
  value: number;
  label: string;
  emoji: string;
}

interface LikertScaleProps {
  options: LikertOption[];
  value: number | null;
  onValueChange: (value: number) => void;
  language?: 'nl' | 'en';
}

export function LikertScale({ options, value, onValueChange, language = 'nl' }: LikertScaleProps) {
  const { speak } = useSpeech();
  
  const handleValueChange = (newValue: number) => {
    onValueChange(newValue);
    const selectedOption = options.find(opt => opt.value === newValue);
    if (selectedOption) {
      speak(selectedOption.label, language);
    }
  };
  
  // Keep all options visible - no simplified display

  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center px-8">
        {options.map((option) => (
          <div key={option.value} className="flex flex-col items-center justify-start space-y-2 min-h-[6rem]">
            <div className="text-4xl emoji-container likert-emoji">{option.emoji}</div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="likert-scale"
                value={option.value}
                checked={value === option.value}
                onChange={() => handleValueChange(option.value)}
                className="sr-only"
              />
              <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                value === option.value 
                  ? 'bg-white' 
                  : 'bg-transparent hover:bg-white hover:bg-opacity-20'
              }`}>
                {value === option.value && <div className="w-3 h-3 rounded-full bg-blue-600" />}
              </div>
            </label>
            {/* Show selected answer label below the circle */}
            {value === option.value && (
              <div className="text-xs text-white text-center px-2 py-1 bg-white bg-opacity-20 rounded">
                {option.label}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between items-center px-8">
        <span className="text-sm font-medium">{options[0]?.label}</span>
        <span className="text-sm font-medium">{options[options.length - 1]?.label}</span>
      </div>
    </div>
  );
}
