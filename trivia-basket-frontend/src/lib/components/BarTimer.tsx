import React, { useEffect, useState } from "react";

export const BarTimer: React.FC<{ duration: number; startDate?: number }> = ({
  duration,
  startDate,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [elapsedTime, setElapsedTime] = useState(0);

  const progress = elapsedTime / duration;

  useEffect(() => {
    const startTime = startDate ? startDate : Date.now();
    const animationInterval = setInterval(() => {
      const currentTime = Date.now();
      const timeElapsed = (currentTime - startTime) / 1000;
      setElapsedTime(Math.min(timeElapsed, duration));
    }, 16);

    const numberTimeout = setInterval(() => {
      setTimeLeft(
        Math.max(0, Math.floor(duration - (Date.now() - startTime) / 1000)),
      );
    }, 1000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(numberTimeout);
    };
  }, []);

  return (
    <div className="w-full h-4">
      <div
        className="bg-primary-chestnut h-4 rounded-r-full"
        style={{ width: `${100 - progress * 100}%` }}
      ></div>
    </div>
  );
};
