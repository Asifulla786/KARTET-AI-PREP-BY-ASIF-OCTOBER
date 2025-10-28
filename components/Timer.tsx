import React from 'react';

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const isLowTime = timeLeft <= 60;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Time Left</span>
      <div className={`text-2xl font-bold transition-colors ${isLowTime ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-slate-200'}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default Timer;