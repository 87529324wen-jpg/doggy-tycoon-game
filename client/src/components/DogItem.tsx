import { useRef, useState, useEffect } from 'react';
import { Dog } from '@/hooks/useGameState';
import { getDogBreed } from '@/config/dogConfig';

interface DogItemProps {
  dog: Dog;
  onDragStart: (dogId: string) => void;
  onDragEnd: (dogId: string, x: number, y: number) => void;
  onMergeAttempt: (dog1Id: string, dog2Id: string) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  onClick?: (x: number, y: number) => void;
}

export function DogItem({ dog, onDragStart, onDragEnd, onMergeAttempt, containerRef, onClick }: DogItemProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: dog.x, y: dog.y });
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const breed = getDogBreed(dog.level);

  // 同步外部位置更新（但不在拖拽时）
  useEffect(() => {
    if (!isDragging) {
      setPosition({ x: dog.x, y: dog.y });
    }
  }, [dog.x, dog.y, isDragging]);

  // 狗狗自动溜达
  useEffect(() => {
    if (isDragging) return;

    const walkInterval = setInterval(() => {
      setPosition((prev) => {
        // 随机移动方向和距离
        const deltaX = (Math.random() - 0.5) * 0.05; // -2.5% 到 +2.5%
        const deltaY = (Math.random() - 0.5) * 0.05;
        
        // 计算新位置
        let newX = prev.x + deltaX;
        let newY = prev.y + deltaY;
        
        // 草地范围限制：确保狗狗的头部不超过围栏
        // 狗狗尺寸 24px，锁点在中心，所以需要额外留出 12px 的空间
        const containerHeight = containerRef.current?.clientHeight || 600;
        const dogHalfSize = 12; // 狗狗半高
        const topOffset = dogHalfSize / containerHeight; // 转换为百分比
        
        const minY = 0.25 + topOffset; // 顶部25% + 狗狗半高
        const maxY = 0.82 - topOffset; // 底部18% - 狗狗半高
        const minX = 0.08 + topOffset; // 左边距
        const maxX = 0.92 - topOffset; // 右边距
        
        // 限制在草地范围内
        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
        
        // 更新外部状态
        onDragEnd(dog.id, newX, newY);
        
        return { x: newX, y: newY };
      });
    }, 3000 + Math.random() * 2000); // 每3-5秒移动一次

    return () => clearInterval(walkInterval);
  }, [isDragging, dog.id, onDragEnd]);

  const startTimeRef = useRef<number>(0);
  const startPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    startTimeRef.current = Date.now();
    startPosRef.current = { x: e.clientX, y: e.clientY };
    if (!containerRef.current) return;
    
    // 阻止默认行为，防止页面滚动
    e.preventDefault();
    e.stopPropagation();
    
    // 禁用页面滚动（iOS Safari 修复）
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    
    const rect = containerRef.current.getBoundingClientRect();
    const dogElement = e.currentTarget as HTMLElement;
    const dogRect = dogElement.getBoundingClientRect();
    
    // 记录拖拽开始位置
    dragStartPos.current = {
      x: position.x,
      y: position.y,
    };
    
    // 计算鼠标相对于狗狗中心的偏移
    dragOffset.current = {
      x: e.clientX - dogRect.left - dogRect.width / 2,
      y: e.clientY - dogRect.top - dogRect.height / 2,
    };
    
    setIsDragging(true);
    onDragStart(dog.id);
    dogElement.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // 计算新位置（百分比）
    const newX = (e.clientX - rect.left - dragOffset.current.x) / rect.width;
    const newY = (e.clientY - rect.top - dragOffset.current.y) / rect.height;
    
    // 草地范围限制：确保狗狗的头部不超过围栏
    const containerHeight = rect.height;
    const dogHalfSize = 12;
    const topOffset = dogHalfSize / containerHeight;
    
    const minY = 0.25 + topOffset;
    const maxY = 0.82 - topOffset;
    const minX = 0.08 + topOffset;
    const maxX = 0.92 - topOffset;
    
    const clampedX = Math.max(minX, Math.min(maxX, newX));
    const clampedY = Math.max(minY, Math.min(maxY, newY));
    
    setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    // 恢复页面滚动
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    const duration = Date.now() - startTimeRef.current;
    const distance = Math.sqrt(
      Math.pow(e.clientX - startPosRef.current.x, 2) +
      Math.pow(e.clientY - startPosRef.current.y, 2)
    );

    // 如果是快速点击（不是拖拽），触发onClick
    if (duration < 300 && distance < 10 && onClick) {
      onClick(e.clientX, e.clientY);
    }
    if (!isDragging) return;
    
    e.preventDefault();
    const dogElement = e.currentTarget as HTMLElement;
    dogElement.releasePointerCapture(e.pointerId);
    
    setIsDragging(false);
    
    // 检测是否与其他狗狗重叠
    if (containerRef.current) {
      const allDogs = containerRef.current.querySelectorAll('[data-dog-id]');
      let merged = false;
      
      allDogs.forEach((otherDogElement) => {
        const otherDogId = otherDogElement.getAttribute('data-dog-id');
        if (otherDogId && otherDogId !== dog.id) {
          const rect1 = dogElement.getBoundingClientRect();
          const rect2 = otherDogElement.getBoundingClientRect();
          
          // 检测碰撞（增大容错范围）
          const tolerance = 20; // 增加 20px 的容错范围
          const overlap = !(
            rect1.right + tolerance < rect2.left ||
            rect1.left - tolerance > rect2.right ||
            rect1.bottom + tolerance < rect2.top ||
            rect1.top - tolerance > rect2.bottom
          );
          
          if (overlap && !merged) {
            merged = true;
            onMergeAttempt(dog.id, otherDogId);
          }
        }
      });
    }
    
    // 更新最终位置（保持level不变，这是修复bug的关键）
    onDragEnd(dog.id, position.x, position.y);
  };

  // 点击动画状态
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (!isDragging && onClick) {
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 300);
    }
  };

  return (
    <div
      data-dog-id={dog.id}
      className={`absolute cursor-move ${
        isDragging ? 'scale-110 z-50' : isClicked ? 'scale-95 z-10' : 'z-10'
      }`}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
        willChange: isDragging ? 'transform' : 'auto',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative" onClick={handleClick}>
        <img
          src={breed.image}
          alt={breed.name}
          className="w-24 h-24 sm:w-28 sm:h-28 object-contain pointer-events-none select-none animate-wiggle"
          draggable={false}
          style={{
            animation: 'wiggle 3s ease-in-out infinite',
          }}
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
          Lv.{dog.level}
        </div>
      </div>
    </div>
  );
}
