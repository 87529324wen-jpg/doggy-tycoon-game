import { useEffect, useState, useRef } from 'react';

interface PoopAnimationProps {
  id: number;
  startX: number;
  startY: number;
  amount: number;
  onComplete: () => void;
}

export function PoopAnimation({ id, startX, startY, amount, onComplete }: PoopAnimationProps) {
  const [position, setPosition] = useState({ x: startX, y: startY });
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(1);
  const animationRef = useRef<number>();

  useEffect(() => {
    // 获取左上角金币图标的位置
    const coinElement = document.querySelector('[data-coin-icon]');
    const targetX = coinElement ? coinElement.getBoundingClientRect().left + 20 : 80;
    const targetY = coinElement ? coinElement.getBoundingClientRect().top + 20 : 60;

    const startTime = Date.now();
    const duration = 600; // 减少到 600ms，更快的动画

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用 easeInOutCubic 缓动函数
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // 计算当前位置（抛物线）
      const currentX = startX + (targetX - startX) * eased;
      const currentY = startY + (targetY - startY) * eased - Math.sin(progress * Math.PI) * 50;

      setPosition({ x: currentX, y: currentY });
      setScale(1 - progress * 0.5); // 缩小到 0.5
      setOpacity(1 - progress * 0.3); // 保持一定透明度

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [id, startX, startY, onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
        transform: `translate(-50%, -50%) scale(${scale})`,
        willChange: 'transform, opacity',
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
