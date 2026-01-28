import { useRef, useState, useEffect } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useTelegram } from '@/hooks/useTelegram';
import { DogItem } from '@/components/DogItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { getDogBreed, DOG_BREEDS, isUnlocked } from '@/config/dogConfig';
import { ShoppingCart, Zap, TrendingUp, Settings, Home, Gift, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy] = useState(100);
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);
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
    addCoins,
  } = useGameState();

  // 能量恢复系统
  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, maxEnergy));
    }, 3000); // 每3秒恢复1点能量
    return () => clearInterval(interval);
  }, [maxEnergy]);

  const handleDogClick = (dogId: string, x: number, y: number) => {
    if (energy < 1) {
      toast.error('能量不足', { description: '等待能量恢复后再点击' });
      return;
    }

    // 消耗能量
    setEnergy((prev) => Math.max(0, prev - 1));

    // 添加金币
    const dog = gameState.dogs.find((d) => d.id === dogId);
    if (dog) {
      const breed = getDogBreed(dog.level);
      const coinAmount = breed.baseProduction;
      
      // 添加金币到游戏状态
      addCoins(coinAmount);
      
      // 显示飘字动画
      const floatingId = Date.now() + Math.random();
      setFloatingCoins((prev) => [...prev, { id: floatingId, x, y }]);
      setTimeout(() => {
        setFloatingCoins((prev) => prev.filter((c) => c.id !== floatingId));
      }, 1000);

      // 触觉反馈
      hapticFeedback.light();
    }
  };

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
  const energyPercent = (energy / maxEnergy) * 100;

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* 顶部状态栏 - 卡通木板风格 */}
      <div className="relative z-20 p-3 sm:p-4" style={{
        background: 'linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #8B4513 100%)',
        borderBottom: '4px solid #654321',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)',
      }}>
        <div className="container max-w-4xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
            {/* 金币 */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)',
              border: '2px solid #D2691E',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              <span className="text-2xl">💩</span>
              <div className="flex flex-col">
                <span className="text-xs text-amber-700">便便余额</span>
                <span className="font-bold text-amber-900">{Math.floor(gameState.coins).toLocaleString()}</span>
              </div>
            </div>

            {/* 产出 */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
              border: '2px solid #4CAF50',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="flex flex-col">
                <span className="text-xs text-green-700">每秒</span>
                <span className="font-bold text-green-900">+{production.toLocaleString()}</span>
              </div>
            </div>

            {/* 容量 */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{
              background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
              border: '2px solid #2196F3',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}>
              <span className="text-sm">🐕 {gameState.dogs.length}/{gameState.maxDogs}</span>
            </div>
          </div>

          {/* 能量条 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-blue-600">⚡ {energy}/{maxEnergy}</span>
            <div className="flex-1">
              <Progress value={energyPercent} className="h-2 bg-blue-200" />
            </div>
            <span className="text-xs text-gray-500">{energyPercent.toFixed(0)}%</span>
          </div>

          {/* 等级进度 */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-semibold text-gray-700">Lv.{gameState.userLevel}</span>
            <div className="flex-1">
              <Progress value={expProgress} className="h-2" />
            </div>
            <span className="text-xs text-gray-500">{gameState.userExp}/100</span>
          </div>
        </div>
      </div>

      {/* 左侧按钮栏 - 木质按钮风格 */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 space-y-2">
        <Dialog open={shopOpen} onOpenChange={setShopOpen}>
          <DialogTrigger asChild>
            <button className="w-12 h-12 rounded-full shadow-lg p-0 flex items-center justify-center text-white transition-transform hover:scale-110" style={{
              background: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
              border: '3px solid #6A1B9A',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)',
            }}>
              <ShoppingCart className="w-5 h-5" />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>🏪 商店</DialogTitle>
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
                          产出: {breed.baseProduction}/点击
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

        <button className="w-12 h-12 rounded-full shadow-lg p-0 flex items-center justify-center text-white transition-transform hover:scale-110" style={{
          background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
          border: '3px solid #FF8F00',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)',
        }}>
          <Trophy className="w-5 h-5" />
        </button>

        <button className="w-12 h-12 rounded-full shadow-lg p-0 flex items-center justify-center text-white transition-transform hover:scale-110" style={{
          background: 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
          border: '3px solid #AD1457',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)',
        }}>
          <Gift className="w-5 h-5" />
        </button>

        <button className="w-12 h-12 rounded-full shadow-lg p-0 flex items-center justify-center text-white transition-transform hover:scale-110" style={{
          background: 'linear-gradient(135deg, #757575 0%, #616161 100%)',
          border: '3px solid #424242',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.3)',
        }}>
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 游戏区域 - 后院背景 */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        style={{
          backgroundImage: 'url(/images/backyard-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 飘字动画 */}
        {floatingCoins.map((coin) => (
          <div
            key={coin.id}
            className="absolute pointer-events-none text-yellow-500 font-bold text-xl animate-float-up"
            style={{
              left: coin.x,
              top: coin.y,
              animation: 'float-up 1s ease-out forwards',
            }}
          >
            +1💩
          </div>
        ))}

        {/* 狗狗 */}
        {gameState.dogs.map((dog) => (
          <DogItem
            key={dog.id}
            dog={dog}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onMergeAttempt={handleMergeAttempt}
            containerRef={containerRef}
            onClick={(x, y) => handleDogClick(dog.id, x, y)}
          />
        ))}

        {/* 提示文字 */}
        {gameState.dogs.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center bg-white/90 backdrop-blur p-6 rounded-2xl shadow-lg">
              <p className="text-2xl mb-2">🐕</p>
              <p className="text-lg font-semibold text-gray-700 mb-1">欢迎来到萌犬大作战！</p>
              <p className="text-sm text-gray-500">点击左侧商店购买你的第一只狗狗吧</p>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航栏 - 草地风格 */}
      <div className="relative z-20 p-3" style={{
        background: 'linear-gradient(180deg, #7CB342 0%, #558B2F 50%, #33691E 100%)',
        borderTop: '3px solid #9CCC65',
        boxShadow: '0 -4px 8px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.1)',
      }}>
        <div className="container max-w-4xl">
          <div className="grid grid-cols-5 gap-2">
            <button className="flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all hover:bg-white/20 text-white">
              <Home className="w-5 h-5" />
              <span className="text-xs font-semibold">首页</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all hover:bg-white/20 text-white">
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-semibold">升级</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all hover:bg-white/20 text-white">
              <ShoppingCart className="w-5 h-5" />
              <span className="text-xs font-semibold">商店</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all hover:bg-white/20 text-white">
              <span className="text-lg">👥</span>
              <span className="text-xs font-semibold">好友</span>
            </button>
            <button className="flex flex-col items-center gap-1 py-2 px-2 rounded-lg transition-all hover:bg-white/20 text-white relative">
              <span className="text-lg">📋</span>
              <span className="text-xs font-semibold">任务</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold" style={{
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}>
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-up {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-50px);
          }
        }
      `}</style>
    </div>
  );
}
