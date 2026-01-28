import { useEffect, useState } from 'react';

interface PoopAnimationProps {
  id: number;
  startX: number;
  startY: number;
  amount: number;
  onComplete: () => void;
}

export function PoopAnimation({ id, startX, startY, amount, onComplete }: PoopAnimationProps) {
  const [style, setStyle] = useState({
    left: startX,
    top: startY,
    opacity: 1,
    transform: 'scale(1) translateY(0)',
  });

  useEffect(() => {
    // 第一阶段：屎弹出
    setTimeout(() => {
      setStyle({
        left: startX,
        top: startY - 30,
        opacity: 1,
        transform: 'scale(1.2) translateY(-20px) rotate(20deg)',
      });
    }, 50);

    // 第二阶段：飞向顶部
    setTimeout(() => {
      const targetX = window.innerWidth / 2;
      const targetY = 60; // 顶部金币栏位置
      
      setStyle({
        left: targetX,
        top: targetY,
        opacity: 0.8,
        transform: 'scale(0.5) translateY(-100px)',
      });
    }, 200);

    // 动画完成
    setTimeout(() => {
      onComplete();
    }, 1000);
  }, [id, startX, startY, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50 transition-all duration-700 ease-out"
      style={{
        left: `${style.left}px`,
        top: `${style.top}px`,
        opacity: style.opacity,
        transform: style.transform,
      }}
    >
      <div className="flex flex-col items-center">
        <span className="text-4xl">💩</span>
        <span className="text-yellow-500 font-bold text-lg mt-1 drop-shadow-lg">
          +{amount}
        </span>
      </div>
    </div>
  );
}
