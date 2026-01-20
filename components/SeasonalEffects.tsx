
import React, { useMemo } from 'react';
import { Season } from '../types';

interface SeasonalEffectsProps {
  season: Season;
}

const SeasonalEffects: React.FC<SeasonalEffectsProps> = ({ season }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      size: 10 + Math.random() * 20,
    }));
  }, [season]);

  const getStyle = () => {
    switch (season) {
      case Season.SPRING:
        return { color: 'text-pink-300', icon: '🌸', bg: 'bg-green-50' };
      case Season.SUMMER:
        return { color: 'text-yellow-400', icon: '☀️', bg: 'bg-amber-50' };
      case Season.AUTUMN:
        return { color: 'text-orange-400', icon: '🍂', bg: 'bg-orange-50' };
      case Season.WINTER:
        return { color: 'text-blue-200', icon: '❄️', bg: 'bg-blue-50' };
    }
  };

  const theme = getStyle();

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 transition-colors duration-1000 ${theme.bg}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute animate-float opacity-30 ${theme.color}`}
          style={{
            left: `${p.left}%`,
            top: `-50px`,
            fontSize: `${p.size}px`,
            animation: `fall ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {theme.icon}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SeasonalEffects;
