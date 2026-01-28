import { useRef, useEffect, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { DogItem } from '@/components/DogItem';
import { DOG_BREEDS, getDogBreed, isUnlocked } from '@/config/dogConfig';
import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        HapticFeedback?: {
          impactOccurred?: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred?: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged?: () => void;
        };
      };
    };
  }
}

export default function Home() {
  const {
    gameState,
    buyDog,
    expandCapacity,
    updateDogPosition,
    setDogDragging,
    mergeDogs,
    toggleAutoMerge,
    calculateProduction,
  } = useGameState();

  const containerRef = useRef<HTMLDivElement>(null);
  const [showShop, setShowShop] = useState(false);

  const hapticFeedback = (type: 'light' | 'success' | 'error' = 'light') => {
    try {
      if (window.Telegram?.WebApp?.HapticFeedback) {
        if (type === 'success' || type === 'error') {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred?.(type);
        } else {
          window.Telegram.WebApp.HapticFeedback.impactOccurred?.(type);
        }
      }
    } catch (e) {
      console.log('Haptic feedback not available');
    }
  };

  const handleDragStart = (dogId: string) => {
    setDogDragging(dogId, true);
    hapticFeedback('light');
  };

  const handleDragEnd = (dogId: string, x: number, y: number) => {
    setDogDragging(dogId, false);
    updateDogPosition(dogId, x, y);
  };

  const handleMergeAttempt = (dog1Id: string, dog2Id: string) => {
    const result = mergeDogs(dog1Id, dog2Id);
    if (result.success) {
      hapticFeedback('success');
    }
  };

  const handleBuyDog = (level: number) => {
    const result = buyDog(level);
    if (result.success) {
      hapticFeedback('success');
    } else {
      hapticFeedback('error');
    }
  };

  const handleExpandCapacity = () => {
    const result = expandCapacity(1000);
    if (result.success) {
      hapticFeedback('success');
    } else {
      hapticFeedback('error');
    }
  };

  const handleToggleAutoMerge = () => {
    toggleAutoMerge();
    hapticFeedback('light');
  };

  const production = calculateProduction();
  const expProgress = (gameState.userExp / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-200 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/30 rounded-full blur-2xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-white/25 rounded-full blur-2xl"></div>
      </div>

      {/* 顶部状态栏 */}
      <div className="relative z-10 p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-2xl">💩</span>
            <span className="font-bold text-lg">{formatNumber(gameState.coins)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-xl">⚡</span>
            <span className="font-semibold text-sm">+{formatNumber(production)}/秒</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm">🐕 {gameState.dogs.length}/{gameState.maxDogs}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <span className="text-sm font-semibold">Lv.{gameState.userLevel}</span>
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-300"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 左侧按钮栏 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 space-y-3">
        <Button
          onClick={() => setShowShop(!showShop)}
          className="w-14 h-14 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
        >
          <span className="text-2xl">🏪</span>
        </Button>
        <Button
          onClick={handleToggleAutoMerge}
          className={`w-14 h-14 rounded-full shadow-lg ${
            gameState.autoMergeEnabled 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          }`}
        >
          <span className="text-2xl">🔄</span>
        </Button>
      </div>

      {/* 游戏区域 */}
      <div 
        ref={containerRef}
        className="relative mx-auto mt-8 w-[90vw] h-[50vh] max-w-2xl bg-gradient-to-b from-green-300 to-green-400 rounded-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="%2368b36b"/%3E%3Cpath d="M10 10c0-5 5-5 5 0s-5 5-5 0zm20 0c0-5 5-5 5 0s-5 5-5 0zm20 0c0-5 5-5 5 0s-5 5-5 0zm20 0c0-5 5-5 5 0s-5 5-5 0zm20 0c0-5 5-5 5 0s-5 5-5 0z" fill="%2356a159"/%3E%3C/svg%3E")',
          backgroundSize: '50px 50px',
        }}
      >
        {gameState.dogs.map((dog) => (
          <DogItem
            key={dog.id}
            dog={dog}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMergeAttempt={handleMergeAttempt}
            containerRef={containerRef}
          />
        ))}
      </div>

      {/* 商店弹窗 */}
      {showShop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">🐕 犬舍商店</h2>
                  <p className="text-white/80 text-sm">购买不同品种的狗狗，合成更高级的品种！</p>
                </div>
                <Button
                  onClick={() => setShowShop(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 text-2xl w-10 h-10 p-0"
                >
                  ×
                </Button>
              </div>

              <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <span className="text-white font-semibold">💩 {formatNumber(gameState.coins)}</span>
                <span className="text-white/80 text-sm">狗狗数量: {gameState.dogs.length}/{gameState.maxDogs}</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {DOG_BREEDS.map((breed) => {
                  const unlocked = isUnlocked(breed.level, gameState.userLevel);
                  const canAfford = gameState.coins >= breed.purchasePrice;
                  const hasSpace = gameState.dogs.length < gameState.maxDogs;

                  return (
                    <div
                      key={breed.id}
                      className="bg-white/90 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3"
                    >
                      <img 
                        src={breed.image} 
                        alt={breed.name}
                        className="w-12 h-12 object-contain"
                      />
                      <div className="flex-1">
                        <div className="font-bold text-gray-800">{breed.name}</div>
                        <div className="text-xs text-gray-600">💩 产出: {formatNumber(breed.baseProduction)}/秒</div>
                        <div className="text-xs text-gray-600">🎯 等级: Lv.{breed.level}</div>
                      </div>
                      <Button
                        onClick={() => handleBuyDog(breed.level)}
                        disabled={!unlocked || !canAfford || !hasSpace}
                        className={`${
                          unlocked && canAfford && hasSpace
                            ? 'bg-yellow-500 hover:bg-yellow-600'
                            : 'bg-gray-400'
                        } text-white font-bold px-4 py-2 rounded-lg`}
                      >
                        {!unlocked ? `🔒 Lv.${breed.unlockLevel}` : 
                         !canAfford ? '金币不足' : 
                         !hasSpace ? '空间不足' : 
                         formatNumber(breed.purchasePrice)}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={handleExpandCapacity}
                disabled={gameState.coins < 1000}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl"
              >
                🏠 扩展狗狗容量 (+2) - 1000💩
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
