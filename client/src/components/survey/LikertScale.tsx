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
    <div className="space-y-4">
      {options.map((option) => (
        <Button
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`w-full p-4 rounded-xl text-xl font-semibold transition-all transform hover:scale-105 flex items-center justify-center ${
            value === option.value
              ? 'bg-green-600 bg-opacity-70 text-white'
              : 'bg-white bg-opacity-30 hover:bg-opacity-50 text-white'
          }`}
        >
          <span className="text-3xl mr-4">{option.emoji}</span>
          <span>{option.label}</span>
        </Button>
      ))}
    </div>
  );
}
