import { useEffect, useState, useRef } from 'react';
import { PoopIcon } from './PoopIcon';

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
    const duration = 500; // 减少到 500ms，更快

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 使用 easeOutCubic 缓动函数（更快的开始）
      const eased = 1 - Math.pow(1 - progress, 3);

      // 计算当前位置（抛物线）
      const currentX = startX + (targetX - startX) * eased;
      const currentY = startY + (targetY - startY) * eased - Math.sin(progress * Math.PI) * 40;

      setPosition({ x: currentX, y: currentY });
      setScale(1 - progress * 0.4); // 缩小到 0.6
      setOpacity(1 - progress * 0.2); // 保持较高透明度

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    // 立即开始动画，无延迟
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
        <PoopIcon size={48} />
        <span className="text-yellow-500 font-bold text-lg mt-1 drop-shadow-lg">
          +{amount}
        </span>
      </div>
    </div>
  );
}
