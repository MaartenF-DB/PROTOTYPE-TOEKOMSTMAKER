interface BackgroundEmojisProps {
  sectionType?: 'entry' | 'checkin' | 'checkout' | 'questions' | 'results';
}

export function BackgroundEmojis({ sectionType = 'entry' }: BackgroundEmojisProps) {
  const getEmojisForSection = () => {
    // Use only stars and dots for all sections as background
    return ['⭐', '✨', '🌟', '💫', '⭐', '✨'];
  };

  const emojis = getEmojisForSection();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-15">
      {/* Removed top-left elements as requested */}
      {/* Top row - avoiding top-left area */}
      <div className="absolute top-1/5 right-1/5 text-4xl">{emojis[1]}</div>
      <div className="absolute top-1/4 left-1/2 text-3xl">{emojis[2]}</div>
      
      {/* Middle row */}
      <div className="absolute top-1/2 right-1/8 text-5xl">{emojis[4]}</div>
      
      {/* Bottom row */}
      <div className="absolute bottom-1/4 left-1/3 text-4xl">{emojis[5]}</div>
      <div className="absolute bottom-1/5 right-1/3 text-3xl">{emojis[0]}</div>
      <div className="absolute bottom-1/6 left-1/2 text-5xl">{emojis[1]}</div>
      
      {/* Additional scattered emojis - avoiding top-left quadrant */}
      <div className="absolute top-2/3 right-1/4 text-3xl">{emojis[3]}</div>
      <div className="absolute bottom-1/3 right-1/5 text-2xl">{emojis[4]}</div>
      <div className="absolute top-3/4 right-1/6 text-4xl">{emojis[5]}</div>
    </div>
  );
}