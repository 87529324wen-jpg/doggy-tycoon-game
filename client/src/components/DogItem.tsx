import { useRef, useState, useEffect } from 'react';
import { Dog } from '@/hooks/useGameState';
import { getDogBreed } from '@/config/dogConfig';

interface DogItemProps {
  dog: Dog;
  onDragStart: (dogId: string) => void;
  onDragEnd: (dogId: string, x: number, y: number) => void;
  onMergeAttempt: (dog1Id: string, dog2Id: string) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function DogItem({ dog, onDragStart, onDragEnd, onMergeAttempt, containerRef }: DogItemProps) {
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

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
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
    
    // 限制在容器内
    const clampedX = Math.max(0.05, Math.min(0.95, newX));
    const clampedY = Math.max(0.05, Math.min(0.95, newY));
    
    setPosition({ x: clampedX, y: clampedY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
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
          
          // 检测碰撞
          const overlap = !(
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom
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

  return (
    <div
      data-dog-id={dog.id}
      className={`absolute cursor-move transition-transform ${isDragging ? 'scale-110 z-50' : 'z-10'}`}
      style={{
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
        transform: 'translate(-50%, -50%)',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div className="relative">
        <img
          src={breed.image}
          alt={breed.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-contain pointer-events-none select-none"
          draggable={false}
        />
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded-full whitespace-nowrap">
          Lv.{dog.level}
        </div>
      </div>
    </div>
  );
}
