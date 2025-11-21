'use client';
import React from 'react';

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  textColor: string;
}

const Timer: React.FC<TimerProps> = ({
  hours,
  minutes,
  seconds,
  textColor,
}) => {
  return (
    <div className="flex items-center justify-center gap-1">
      {[hours, minutes, seconds].map((t, i) => (
        <React.Fragment key={i}>
          <span className="min-w-8 rounded-sm bg-white px-2 py-1 text-sm font-bold text-red-600">
            {t.toString().padStart(2, '0')}
          </span>
          {i < 2 && <span className={textColor}>:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Timer;
