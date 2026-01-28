import { useEffect, useState } from 'react';

interface ComboDisplayProps {
  combo: number;
  x: number;
  y: number;
}

export function ComboDisplay({ combo, x, y }: ComboDisplayProps) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    setScale(1.5);
    setTimeout(() => setScale(1), 200);
  }, [combo]);

  if (combo < 2) return null;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-200"
      style={{
        left: x,
        top: y - 100,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <div className="flex flex-col items-center">
        <div className="text-6xl font-black text-yellow-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
             style={{
               textShadow: '0 0 10px #FFD700, 0 0 20px #FFA500, 0 0 30px #FF6347',
               WebkitTextStroke: '2px #FF6347',
             }}>
          {combo}x
        </div>
        <div className="text-xl font-bold text-white drop-shadow-lg mt-1">
          COMBO!
        </div>
      </div>
    </div>
  );
}

interface CriticalHitProps {
  x: number;
  y: number;
  multiplier: number;
  onComplete: () => void;
}

export function CriticalHit({ x, y, multiplier, onComplete }: CriticalHitProps) {
  useEffect(() => {
    setTimeout(onComplete, 1000);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50 animate-bounce"
      style={{
        left: x,
        top: y - 80,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex flex-col items-center">
        <div className="text-5xl font-black text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.8)]"
             style={{
               textShadow: '0 0 10px #FF0000, 0 0 20px #FF4500, 0 0 30px #FFD700',
               WebkitTextStroke: '2px #8B0000',
               animation: 'pulse 0.5s ease-in-out infinite',
             }}>
          {multiplier}x
        </div>
        <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">
          💥 CRITICAL!
        </div>
      </div>
    </div>
  );
}
