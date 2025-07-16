import { Button } from '@/components/ui/button';

interface LikertOption {
  value: number;
  label: string;
  emoji: string;
}

interface LikertScaleProps {
  options: LikertOption[];
  value: number | null;
  onValueChange: (value: number) => void;
}

export function LikertScale({ options, value, onValueChange }: LikertScaleProps) {
  return (
    <div className="flex flex-col space-y-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center px-8">
        {options.map((option) => (
          <div key={option.value} className="flex flex-col items-center space-y-2">
            <div className="text-4xl">{option.emoji}</div>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="likert-scale"
                value={option.value}
                checked={value === option.value}
                onChange={() => onValueChange(option.value)}
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
          </div>
        ))}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between items-center px-8">
        <span className="text-sm font-medium">{options[0]?.label}</span>
        <span className="text-sm font-medium">{options[options.length - 1]?.label}</span>
      </div>
      
      {/* Selected option display */}
      <div className="text-center">
        {value !== null && (
          <p className="text-lg font-semibold">
            {options.find(opt => opt.value === value)?.label}
          </p>
        )}
      </div>
    </div>
  );
}
