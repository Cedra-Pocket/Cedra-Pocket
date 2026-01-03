'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CountdownTimerProps {
  targetTime: Date;
  onComplete?: () => void;
  format?: 'hh:mm:ss' | 'hh:mm';
  className?: string;
}

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(targetTime: Date): TimeRemaining {
  const now = new Date().getTime();
  const target = targetTime.getTime();
  const total = Math.max(0, target - now);

  const hours = Math.floor(total / (1000 * 60 * 60));
  const minutes = Math.floor((total % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((total % (1000 * 60)) / 1000);

  return { hours, minutes, seconds, total };
}

function padNumber(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * CountdownTimer component with format options
 * Requirements: 3.4 - Display countdown timer until next available claim
 */
export function CountdownTimer({
  targetTime,
  onComplete,
  format = 'hh:mm:ss',
  className = '',
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(targetTime)
  );

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // Recalculate when targetTime changes
    setTimeRemaining(calculateTimeRemaining(targetTime));
  }, [targetTime]);

  useEffect(() => {
    if (timeRemaining.total <= 0) {
      return;
    }

    const interval = setInterval(() => {
      const newTime = calculateTimeRemaining(targetTime);
      setTimeRemaining(newTime);

      if (newTime.total <= 0) {
        clearInterval(interval);
        handleComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, timeRemaining.total, handleComplete]);

  const formatTime = (): string => {
    const { hours, minutes, seconds } = timeRemaining;

    if (format === 'hh:mm') {
      return `${padNumber(hours)}:${padNumber(minutes)}`;
    }

    return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
  };

  const isComplete = timeRemaining.total <= 0;

  return (
    <div
      className={`font-mono text-lg font-semibold ${className}`}
      role="timer"
      aria-live="polite"
      aria-label={isComplete ? 'Timer complete' : `Time remaining: ${formatTime()}`}
    >
      {isComplete ? (
        <span className="text-accent-cyan">Ready!</span>
      ) : (
        <span className="text-text-primary">{formatTime()}</span>
      )}
    </div>
  );
}

export default CountdownTimer;
