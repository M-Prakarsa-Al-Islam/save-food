import React, { useState, useEffect, useContext } from 'react';
// FIX: Corrected the import path for LanguageContext.
import { LanguageContext } from '../context/ThemeContext';

interface CountdownTimerProps {
  expiresAt: Date;
  onExpire: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const { t } = useContext(LanguageContext)!;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiresAt) - +new Date();
      let timeLeftString = '';

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        timeLeftString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        timeLeftString = t('expired');
        onExpire();
      }
      return timeLeftString;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());
    
    return () => clearInterval(timer);
  }, [expiresAt, onExpire, t]);

  return (
    <span className="font-mono font-bold text-red-500">
      {timeLeft}
    </span>
  );
};

export default CountdownTimer;