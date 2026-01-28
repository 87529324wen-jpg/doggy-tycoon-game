import { useRef, useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useTelegram } from '@/hooks/useTelegram';
import { DogItem } from '@/components/DogItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { getDogBreed, DOG_BREEDS, isUnlocked } from '@/config/dogConfig';
import { ShoppingCart, Zap, TrendingUp, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const { hapticFeedback } = useTelegram();
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

  const handleDragStart = (dogId: string) => {
    setDogDragging(dogId, true);
  };

  const handleDragEnd = (dogId: string, x: number, y: number) => {
    setDogDragging(dogId, false);
    updateDogPosition(dogId, x, y);
  };

  const handleMergeAttempt = (dog1Id: string, dog2Id: string) => {
    const result = mergeDogs(dog1Id, dog2Id);
    if (result.success) {
      hapticFeedback.success();
      toast.success('合成成功！', {
        description: '获得了更高级的狗狗！',
      });
    }
  };

  const handleBuyDog = (level: number) => {
    const result = buyDog(level);
    if (result.success) {
      hapticFeedback.success();
      const breed = getDogBreed(level);
      toast.success(`购买成功！`, {
        description: `获得了 ${breed.name}`,
      });
      setShopOpen(false);
    } else {
      hapticFeedback.error();
      toast.error('购买失败', {
        description: result.message,
      });
    }
  };

  const handleExpandCapacity = () => {
    const cost = gameState.maxDogs * 1000;
    const result = expandCapacity(cost);
    if (result.success) {
      hapticFeedback.success();
      toast.success('扩容成功！', {
        description: `容量增加了 2 个位置`,
      });
    } else {
      hapticFeedback.error();
      toast.error('扩容失败', {
        description: result.message,
      });
    }
  };

  const production = calculateProduction();
  const expProgress = (gameState.userExp / 100) * 100;
  const expansionCost = gameState.maxDogs * 1000;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 flex flex-col">
      {/* 顶部状态栏 */}
      <div className="bg-white/90 backdrop-blur shadow-md p-3 sm:p-4">
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* 金币 */}
            <div className="flex items-center gap-2 bg-amber-100 px-3 py-2 rounded-lg">
              <span className="text-2xl">💩</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-700">金币</span>
                <span className="font-bold text-amber-900">{Math.floor(gameState.coins).toLocaleString()}</span>
              </div>
            </div>

            {/* 等级 */}
            <div className="flex-1 max-w-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-gray-700">Lv.{gameState.userLevel}</span>
                <span className="text-xs text-gray-500">{gameState.userExp}/100</span>
              </div>
              <Progress value={expProgress} className="h-2" />
            </div>

            {/* 产出 */}
            <div className="hidden sm:flex items-center gap-2 bg-green-100 px-3 py-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="flex flex-col">
                <span className="text-xs text-green-700">每秒</span>
                <span className="font-bold text-green-900">{production.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 游戏区域 */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        {/* 背景 */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 to-green-200">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-400 to-transparent"></div>
        </div>

        {/* 狗狗 */}
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

        {/* 提示文字 */}
        {gameState.dogs.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/80 backdrop-blur p-6 rounded-2xl shadow-lg">
              <p className="text-2xl mb-2">🐕</p>
              <p className="text-lg font-semibold text-gray-700 mb-1">欢迎来到萌犬大作战！</p>
              <p className="text-sm text-gray-500">点击下方商店购买你的第一只狗狗吧</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <div className="bg-white/90 backdrop-blur shadow-lg p-3 sm:p-4">
        <div className="container max-w-4xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {/* 商店按钮 */}
            <Dialog open={shopOpen} onOpenChange={setShopOpen}>
              <DialogTrigger asChild>
                <Button className="flex flex-col items-center gap-1 h-auto py-3" variant="default">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-xs">商店</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>狗狗商店</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-3">
                    {DOG_BREEDS.map((breed) => {
                      const unlocked = isUnlocked(breed.level, gameState.userLevel);
                      const canAfford = gameState.coins >= breed.purchasePrice;
                      const canBuy = unlocked && canAfford && gameState.dogs.length < gameState.maxDogs;

                      return (
                        <div
                          key={breed.id}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                            unlocked ? 'bg-white border-amber-200' : 'bg-gray-100 border-gray-200 opacity-60'
                          }`}
                        >
                          <img
                            src={breed.image}
                            alt={breed.name}
                            className="w-16 h-16 object-contain"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-800">{breed.name}</span>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                Lv.{breed.level}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              产出: {breed.baseProduction}/秒
                            </div>
                            <div className="flex items-center gap-1 text-sm font-semibold text-amber-700">
                              <span>💩</span>
                              <span>{breed.purchasePrice.toLocaleString()}</span>
                            </div>
                            {!unlocked && (
                              <div className="text-xs text-red-500 mt-1">
                                需要等级 {breed.unlockLevel}
                              </div>
                            )}
                          </div>
                          <Button
                            size="sm"
                            disabled={!canBuy}
                            onClick={() => handleBuyDog(breed.level)}
                          >
                            购买
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            {/* 自动合成按钮 */}
            <Button
              className={`flex flex-col items-center gap-1 h-auto py-3 ${
                gameState.autoMergeEnabled ? 'bg-green-600 hover:bg-green-700' : ''
              }`}
              variant={gameState.autoMergeEnabled ? 'default' : 'outline'}
              onClick={toggleAutoMerge}
            >
              <Zap className="w-5 h-5" />
              <span className="text-xs">自动合成</span>
            </Button>

            {/* 扩容按钮 */}
            <Button
              className="flex flex-col items-center gap-1 h-auto py-3"
              variant="outline"
              onClick={handleExpandCapacity}
            >
              <Settings className="w-5 h-5" />
              <span className="text-xs">扩容</span>
              <span className="text-[10px] text-gray-500">💩{expansionCost.toLocaleString()}</span>
            </Button>

            {/* 容量显示 */}
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-2">
              <span className="text-xs text-gray-600">容量</span>
              <span className="text-lg font-bold text-gray-800">
                {gameState.dogs.length}/{gameState.maxDogs}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
