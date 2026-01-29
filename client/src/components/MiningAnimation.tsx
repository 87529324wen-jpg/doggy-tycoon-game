import { useEffect, useState } from 'react';

interface MiningAnimationProps {
  id: number;
  x: number;
  y: number;
  amount: number;
  onComplete: (id: number) => void;
}

export function MiningAnimation({ id, x, y, amount, onComplete }: MiningAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete(id);
    }, 1200);

    return () => clearTimeout(timer);
  }, [id, onComplete]);

  if (!isAnimating) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        animation: 'miningFloat 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      }}
    >
      <div className="relative">
        {/* 便便矿石 */}
        <div className="text-4xl animate-spin-slow" style={{
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
          animation: 'spin 1.2s linear infinite',
        }}>
          💩
        </div>
        
        {/* 金币数量 */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-2xl font-black text-yellow-500" style={{
            textShadow: '2px 2px 4px rgba(0,0,0,0.5), 0 0 10px rgba(255,215,0,0.8)',
          }}>
            +{amount}
          </span>
        </div>

        {/* 闪光效果 */}
        <div className="absolute inset-0 animate-ping opacity-75">
          <div className="w-full h-full bg-yellow-400 rounded-full blur-xl"></div>
        </div>
      </div>

      <style>{`
        @keyframes miningFloat {
          0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
          }
          20% {
            transform: translate(0, -30px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(calc(50vw - ${x}px), calc(20px - ${y}px)) scale(0.3);
            opacity: 0;
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin-slow {
          animation: spin 2s linear infinite;
        }
      `}</style>
    </div>
  );
}
