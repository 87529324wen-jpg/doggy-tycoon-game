// Build: 1769603222
import { useRef, useState, useEffect, useCallback } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { useTelegram } from '@/hooks/useTelegram';
import { DogItem } from '@/components/DogItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { getDogBreed, DOG_BREEDS, isUnlocked } from '@/config/dogConfig';
import { ShoppingCart, Zap, TrendingUp, Settings, Home, Gift, Trophy, X, CheckCircle2, Circle } from 'lucide-react';
import { toast } from 'sonner';
import { PoopAnimation } from '@/components/PoopAnimation';
import { PoopIcon } from '@/components/PoopIcon';
import { ComboDisplay, CriticalHit } from '@/components/ComboDisplay';
import { ParticleEffect } from '@/components/ParticleEffect';
import { UnlockCelebration } from '@/components/UnlockCelebration';
import { TabContent } from '@/components/TabContent';
import { DAILY_TASKS, ACHIEVEMENT_TASKS } from '@/config/taskConfig';
import { GAME_VERSION, BUILD_DATE } from '@/config/version';
import { formatNumber } from '@/lib/formatNumber';

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shopOpen, setShopOpen] = useState(false);
  const [tasksOpen, setTasksOpen] = useState(false);
  const [energy, setEnergy] = useState(100);
  const [maxEnergy] = useState(100);
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [poopAnimations, setPoopAnimations] = useState<Array<{ id: number; x: number; y: number; amount: number; isCritical?: boolean; multiplier?: number }>>([]);
  const [combo, setCombo] = useState(0);
  const [comboPosition, setComboPosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [criticalHits, setCriticalHits] = useState<Array<{ id: number; x: number; y: number; multiplier: number }>>([]);
  const [unlockCelebration, setUnlockCelebration] = useState<{ dogName: string; dogImage: string; dogLevel: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'tasks' | 'settings'>('home');
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { hapticFeedback, user } = useTelegram();
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
      toast.error('能量不足', { description: '等待能量恢复后再点击', duration: 500 });
      return;
    }

    // 消耗能量
    setEnergy((prev) => Math.max(0, prev - 1));

    // 添加金币
    const dog = gameState.dogs.find((d) => d.id === dogId);
    if (dog) {
      const breed = getDogBreed(dog.level);
      let coinAmount = breed.baseProduction;
      
      // 连击系统
      setCombo((prev) => prev + 1);
      setComboPosition({ x: window.innerWidth / 2, y: window.innerHeight / 3 });
      
      // 清除之前的计时器
      if (comboTimerRef.current) {
        clearTimeout(comboTimerRef.current);
      }
      
      // 2秒后重置连击
      comboTimerRef.current = setTimeout(() => {
        setCombo(0);
      }, 2000);
      
      // 暴击系统（10%概率）
      const isCritical = Math.random() < 0.1;
      let multiplier = 1;
      
      if (isCritical) {
        multiplier = 2 + Math.floor(Math.random() * 4); // 2-5倍
        coinAmount *= multiplier;
        
        // 显示暴击特效
        const critId = Date.now() + Math.random();
        setCriticalHits((prev) => [...prev, { id: critId, x, y, multiplier }]);
        
        // 更强的震动
        hapticFeedback.heavy();
      } else {
        hapticFeedback.light();
      }
      
      // 连击奖励：每5连击额外+50%
      if (combo > 0 && combo % 5 === 0) {
        coinAmount = Math.floor(coinAmount * 1.5);
      }
      
      // 添加金币到游戏状态
      addCoins(coinAmount);
      
      // 显示屎掉落动画（使用更可靠的 ID 生成）
      const poopId = Date.now() * 1000 + Math.floor(Math.random() * 1000);
      setPoopAnimations((prev) => {
        // 限制最多 20 个动画，防止卡顿
        const newAnims = [...prev, { id: poopId, x, y, amount: coinAmount, isCritical, multiplier }];
        return newAnims.length > 20 ? newAnims.slice(-20) : newAnims;
      });
      
      // 粒子特效
      const particleId = Date.now() * 1000 + Math.floor(Math.random() * 1000) + 1;
      setParticles((prev) => {
        // 限制最多 15 个粒子
        const newParticles = [...prev, { id: particleId, x, y }];
        return newParticles.length > 15 ? newParticles.slice(-15) : newParticles;
      });
    }
  };

  const handlePoopAnimationComplete = (id: number) => {
    setPoopAnimations((prev) => prev.filter((p) => p.id !== id));
  };

  const handleParticleComplete = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCriticalHitComplete = (id: number) => {
    setCriticalHits((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDragStart = (dogId: string) => {
    setDogDragging(dogId, true);
  };

  const handleDragEnd = (dogId: string, x: number, y: number) => {
    setDogDragging(dogId, false);
    updateDogPosition(dogId, x, y);
  };

  const handleMergeAttempt = (dog1Id: string, dog2Id: string) => {
    // 合成前记录已解锁的等级
    const previousUnlockedLevels = [...gameState.unlockedLevels];
    
    const result = mergeDogs(dog1Id, dog2Id);
    if (result.success) {
      hapticFeedback.success();
      
      // 获取合成后的狗狗信息
      const mergedDog = gameState.dogs.find(d => d.id === dog1Id);
      if (mergedDog) {
        const breed = getDogBreed(mergedDog.level);
        
        // 检查是否是首次解锁这个等级
        const isNewUnlock = !previousUnlockedLevels.includes(mergedDog.level);
        
        if (isNewUnlock) {
          // 首次解锁，显示庆祝弹窗
          setUnlockCelebration({
            dogName: breed.name,
            dogImage: breed.image,
            dogLevel: breed.level,
          });
        }
        // 移除普通合成提示
      }
    }
  };

  const handleBuyDog = (level: number) => {
    const result = buyDog(level);
    if (result.success) {
      hapticFeedback.success();
      // 购买成功，保持商店打开，不显示提示
    } else {
      hapticFeedback.error();
      toast.error('购买失败', {
        description: result.message,
        duration: 500,
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
        duration: 500,
      });
    } else {
      hapticFeedback.error();
      toast.error('扩容失败', {
        description: result.message,
        duration: 500,
      });
    }
  };

  const handleClaimTask = (taskId: string) => {
    // TODO: 实现任务领取逻辑
    hapticFeedback.success();
    toast.success('领取成功！', {
      description: '奖励已发放',
      duration: 500,
    });
  };

  const production = calculateProduction();
  const expProgress = (gameState.userExp / 100) * 100;
  const expansionCost = gameState.maxDogs * 1000;
  const energyPercent = (energy / maxEnergy) * 100;

  // 强制全屏和禁止滚动
  useEffect(() => {
    // 设置全屏高度
    const setFullHeight = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${vh}px`);
    };
    
    setFullHeight();
    window.addEventListener('resize', setFullHeight);
    
    // 禁止所有滚动
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.documentElement.style.overflow = 'hidden';
    
    // 禁止 iOS 滚动弹性
    const preventScroll = (e: TouchEvent) => {
      if (e.touches.length > 1) return; // 允许多点触摸
      const target = e.target as HTMLElement;
      // 只允许对话框内容滚动
      if (!target.closest('[data-radix-scroll-area-viewport]')) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    return () => {
      window.removeEventListener('resize', setFullHeight);
      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: 'var(--app-height, 100vh)',
        overflow: 'hidden',
        touchAction: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* 顶部状态栏 - 升级版卡通风格 */}
      <div className="relative z-20 p-3 sm:p-4 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #C06C84 50%, #6C5B7B 100%)',
        borderBottom: '4px solid #355C7D',
        boxShadow: '0 6px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
      }}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-yellow-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container max-w-4xl">
          {/* 版本号显示 */}
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-white text-xs font-mono z-30">
            {GAME_VERSION}
          </div>
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-2">
            {/* 金币 */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl relative overflow-hidden group" style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              border: '3px solid #FF8C00',
              boxShadow: '0 4px 8px rgba(255,165,0,0.4), inset 0 2px 0 rgba(255,255,255,0.5)',
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:animate-shimmer"></div>
              <div data-coin-icon className="animate-bounce" style={{ animationDuration: '2s' }}>
                <PoopIcon size={36} />
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-xs font-bold text-orange-900">便便余额</span>
                <span className="text-lg font-black text-orange-950">{formatNumber(gameState.coins)}</span>
              </div>
            </div>

            {/* 产出 */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{
              background: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)',
              border: '3px solid #2E8B57',
              boxShadow: '0 4px 8px rgba(46,139,87,0.4), inset 0 2px 0 rgba(255,255,255,0.5)',
            }}>
              <TrendingUp className="w-6 h-6 text-white animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-teal-100">每秒</span>
                <span className="text-lg font-black text-white">+{formatNumber(production)}</span>
              </div>
            </div>

            {/* 容量 - 点击升级 */}
            <Dialog>
              <DialogTrigger asChild>
                <button 
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 relative group"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 4px 12px rgba(255,107,107,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span className="text-xl">🐾</span>
                    <div className="flex flex-col items-start">
                      <span className="text-[10px] font-bold text-white/80 leading-none">容量</span>
                      <span className="text-sm font-black text-white leading-none">{gameState.dogs.length}/{gameState.maxDogs}</span>
                    </div>
                  </div>
                  {gameState.maxDogs < 12 && (
                    <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-red-500 font-bold text-xs shadow-md group-hover:scale-110 transition-transform">
                      +
                    </div>
                  )}
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>🐾 扩容狗狗容量</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-2">当前容量: {gameState.maxDogs}</p>
                    <p className="text-gray-600">最大容量: 12</p>
                  </div>
                  
                  {gameState.maxDogs < 12 ? (
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 mb-3">
                        升级后容量 +2，可以拥有更多狗狗！
                      </p>
                      <p className="text-lg font-bold text-purple-700 mb-3">
                        💰 需要: {formatNumber(expansionCost)} 便便
                      </p>
                      <Button 
                        onClick={handleExpandCapacity}
                        disabled={gameState.coins < expansionCost}
                        className="w-full"
                        size="lg"
                      >
                        🚀 升级容量
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg text-center">
                      <p className="text-lg font-bold text-green-700">
                        🎉 已达到最大容量！
                      </p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* 能量条 */}
          <div className="flex items-center gap-2 relative z-10">
            <span className="text-sm font-bold text-white drop-shadow-lg">⚡ {energy}/{maxEnergy}</span>
            <div className="flex-1 bg-white/30 rounded-full h-3 overflow-hidden backdrop-blur-sm border-2 border-white/50">
              <div 
                className="h-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${energyPercent}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
              </div>
            </div>
            <span className="text-xs font-bold text-white drop-shadow-lg">{energyPercent.toFixed(0)}%</span>
          </div>

          {/* 等级进度 */}
          <div className="flex items-center gap-2 mt-2 relative z-10">
            <span className="text-sm font-bold text-white drop-shadow-lg bg-purple-600 px-3 py-1 rounded-full border-2 border-white/50">Lv.{gameState.userLevel}</span>
            <div className="flex-1 bg-white/30 rounded-full h-3 overflow-hidden backdrop-blur-sm border-2 border-white/50">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 transition-all duration-300 relative overflow-hidden"
                style={{ width: `${expProgress}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>
              </div>
            </div>
            <span className="text-xs font-bold text-white drop-shadow-lg">{gameState.userExp}/100</span>
          </div>
        </div>
      </div>

      {/* 左侧按钮栏已移除，功能整合到底部导航栏 */}
      <div className="hidden">
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
                {DOG_BREEDS.filter(breed => gameState.unlockedLevels.includes(breed.level)).map((breed) => {
                  const canAfford = gameState.coins >= breed.purchasePrice;
                  const canBuy = canAfford && gameState.dogs.length < gameState.maxDogs;

                  return (
                    <div
                      key={breed.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 bg-white border-amber-200"
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
        {/* 屎掉落动画 */}
        {poopAnimations.map((poop) => (
          <PoopAnimation
            key={poop.id}
            id={poop.id}
            startX={poop.x}
            startY={poop.y}
            amount={poop.amount}
            onComplete={() => handlePoopAnimationComplete(poop.id)}
          />
        ))}

        {/* 粒子特效 */}
        {particles.map((particle) => (
          <ParticleEffect
            key={particle.id}
            x={particle.x}
            y={particle.y}
            onComplete={() => handleParticleComplete(particle.id)}
          />
        ))}

        {/* 暴击特效 */}
        {criticalHits.map((crit) => (
          <CriticalHit
            key={crit.id}
            x={crit.x}
            y={crit.y}
            multiplier={crit.multiplier}
            onComplete={() => handleCriticalHitComplete(crit.id)}
          />
        ))}

        {/* 连击显示 */}
        <ComboDisplay combo={combo} x={comboPosition.x} y={comboPosition.y} />

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

      {/* 底部导航栏 - 升级版卡通风格 */}
      <div className="relative z-20 p-3 overflow-hidden" style={{
        background: 'linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        borderTop: '4px solid #5a67d8',
        boxShadow: '0 -6px 12px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.3)',
      }}>
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-40 h-40 bg-pink-300 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="container max-w-4xl relative z-10">
          <div className="grid grid-cols-5 gap-2">
            <Dialog open={shopOpen} onOpenChange={setShopOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all hover:bg-white/30 active:scale-95 text-white hover:shadow-lg">
                  <div className="relative">
                    <ShoppingCart className="w-6 h-6" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  </div>
                  <span className="text-xs font-bold drop-shadow-lg">商店</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>🏪 商店</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[60vh] pr-4">
                  <div className="space-y-3">
                    {(() => {
                      // 显示所有狗狗，但只有已解锁和下一个待解锁的显示详细信息
                      const maxUnlockedLevel = Math.max(...gameState.unlockedLevels);
                      const nextLockLevel = maxUnlockedLevel + 1;
                      
                      return DOG_BREEDS.map((breed) => {
                        const isUnlocked = gameState.unlockedLevels.includes(breed.level);
                        const isNextToUnlock = breed.level === nextLockLevel;
                        const showDetails = isUnlocked || isNextToUnlock;
                        const canAfford = gameState.coins >= breed.purchasePrice;
                        const canBuy = isUnlocked && canAfford && gameState.dogs.length < gameState.maxDogs;

                        return (
                          <div
                            key={breed.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                              isUnlocked 
                                ? 'bg-white border-amber-200' 
                                : isNextToUnlock
                                ? 'bg-gray-50 border-gray-300 opacity-90'
                                : 'bg-gray-100 border-gray-200 opacity-60'
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
                                {!isUnlocked && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">
                                    🔒 未解锁
                                  </span>
                                )}
                              </div>
                              {showDetails ? (
                                <>
                                  <div className="text-xs text-gray-600 mb-1">
                                    产出: {breed.baseProduction}/点击
                                  </div>
                                  {isUnlocked ? (
                                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-700">
                                      <span>💩</span>
                                      <span>{formatNumber(breed.purchasePrice)}</span>
                                    </div>
                                  ) : (
                                    <div className="text-xs text-gray-500">
                                      通过合成解锁
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="text-xs text-gray-400">
                                  ??? 神秘狗狗
                                </div>
                              )}
                            </div>
                            {isUnlocked ? (
                              <Button
                                size="sm"
                                disabled={!canBuy}
                                onClick={() => handleBuyDog(breed.level)}
                              >
                                购买
                              </Button>
                            ) : (
                              <div className="text-xs text-gray-400 px-3">
                                {isNextToUnlock ? '合成解锁' : '???'}
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>

            <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all hover:bg-white/30 active:scale-95 text-white hover:shadow-lg">
              <Trophy className="w-6 h-6" />
              <span className="text-xs font-bold drop-shadow-lg">排行</span>
            </button>

            <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all hover:bg-white/30 active:scale-95 text-white hover:shadow-lg">
              <Gift className="w-6 h-6" />
              <span className="text-xs font-bold drop-shadow-lg">礼物</span>
            </button>

            <Dialog open={tasksOpen} onOpenChange={setTasksOpen}>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all hover:bg-white/30 active:scale-95 text-white hover:shadow-lg relative">
                  <div className="relative">
                    <span className="text-2xl">📋</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce" style={{
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    }}>
                      3
                    </span>
                  </div>
                  <span className="text-xs font-bold drop-shadow-lg">任务</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md w-[90vw] p-0 gap-0 max-h-[50vh]">
                <div className="h-full overflow-y-auto pb-4">
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-4">
                    <div className="space-y-6">
                      {/* 每日任务 */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-bold text-purple-700">📅 每日任务</h3>
                          <span className="text-xs text-gray-500">每日刷新</span>
                        </div>
                        <div className="space-y-3">
                          {DAILY_TASKS.map((task) => {
                            const progress = task.type === 'click' ? gameState.taskStats.totalClicks :
                                           task.type === 'collect' ? gameState.taskStats.totalCoinsCollected :
                                           task.type === 'merge' ? gameState.taskStats.totalMerges : 0;
                            const currentProgress = Math.min(progress, task.target);
                            const progressPercent = (currentProgress / task.target) * 100;
                            const completed = gameState.completedTasks.includes(task.id);
                            const canClaim = currentProgress >= task.target && !completed;

                            return (
                              <div key={task.id} className={`p-4 rounded-xl border-2 ${
                                completed ? 'bg-gray-100 border-gray-300' :
                                canClaim ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-lg' :
                                'bg-white border-purple-200'
                              }`}>
                                <div className="flex items-start gap-3">
                                  <div className="text-3xl">{task.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-bold text-gray-800">{task.title}</h4>
                                      {completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                    <div className="mb-2">
                                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                        <span>进度</span>
                                        <span>{currentProgress}/{task.target}</span>
                                      </div>
                                      <Progress value={progressPercent} className="h-2" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-amber-600">💩 {formatNumber(task.reward.coins)}</span>
                                      {canClaim && (
                                        <Button size="sm" onClick={() => handleClaimTask(task.id)} className="bg-gradient-to-r from-yellow-400 to-orange-400">领取</Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* 成就任务 */}
                      <div>
                        <h3 className="text-lg font-bold text-purple-700 mb-3">🏆 成就任务</h3>
                        <div className="space-y-3">
                          {ACHIEVEMENT_TASKS.map((task) => {
                            const progress = task.type === 'unlock' ? gameState.unlockedLevels.length :
                                           task.type === 'capacity' ? gameState.maxDogs :
                                           task.type === 'level' ? gameState.userLevel : 0;
                            const currentProgress = Math.min(progress, task.target);
                            const progressPercent = (currentProgress / task.target) * 100;
                            const completed = gameState.completedTasks.includes(task.id);
                            const canClaim = currentProgress >= task.target && !completed;

                            return (
                              <div key={task.id} className={`p-4 rounded-xl border-2 ${
                                completed ? 'bg-gray-100 border-gray-300' :
                                canClaim ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-lg' :
                                'bg-white border-purple-200'
                              }`}>
                                <div className="flex items-start gap-3">
                                  <div className="text-3xl">{task.icon}</div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                      <h4 className="font-bold text-gray-800">{task.title}</h4>
                                      {completed ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Circle className="w-5 h-5 text-gray-300" />}
                                    </div>
                                    <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                                    <div className="mb-2">
                                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                        <span>进度</span>
                                        <span>{currentProgress}/{task.target}</span>
                                      </div>
                                      <Progress value={progressPercent} className="h-2" />
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-amber-600">💩 {formatNumber(task.reward.coins)}</span>
                                      {canClaim && (
                                        <Button size="sm" onClick={() => handleClaimTask(task.id)} className="bg-gradient-to-r from-yellow-400 to-orange-400">领取</Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all hover:bg-white/30 active:scale-95 text-white hover:shadow-lg">
                  <Settings className="w-6 h-6" />
                  <span className="text-xs font-bold drop-shadow-lg">设置</span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[70vh]">
                <DialogHeader>
                  <DialogTitle>⚙️ 设置</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-[55vh] pr-4">
                  <div className="space-y-4 py-4">
                  {/* 容量升级 */}
                  <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                    <div className="font-bold text-lg mb-2">🐾 狗狗容量</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">当前容量:</span>
                        <span className="font-bold text-lg">{gameState.dogs.length} / {gameState.maxDogs}</span>
                      </div>
                      {gameState.maxDogs < 12 && (
                        <button
                          onClick={() => {
                            const cost = gameState.maxDogs * 1000; // 每次升级费用递增
                            const result = expandCapacity(cost);
                            if (result.success) {
                              hapticFeedback.success();
                              toast.success('✅ 容量升级成功！', {
                                description: `容量增加到 ${gameState.maxDogs + 2} 个`,
                                duration: 500,
                              });
                            } else {
                              hapticFeedback.error();
                              toast.error('升级失败', {
                                description: result.message,
                                duration: 500,
                              });
                            }
                          }}
                          disabled={gameState.coins < gameState.maxDogs * 1000}
                          className="w-full py-2 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          💎 升级容量 (+2) - {(gameState.maxDogs * 1000).toLocaleString()} 便便
                        </button>
                      )}
                      {gameState.maxDogs >= 12 && (
                        <div className="text-center text-sm text-gray-500 py-2">
                          🎉 已达到最大容量！
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 自动合成 */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
                    <div className="flex-1">
                      <div className="font-bold text-lg flex items-center gap-2">
                        🤖 自动合成
                        {gameState.userLevel < 20 && (
                          <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                            Lv.20解锁
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {gameState.userLevel >= 20 
                          ? '自动合成相同等级的狗狗' 
                          : '达到 20 级解锁此功能'}
                      </p>
                    </div>
                    <button
                      disabled={gameState.userLevel < 20}
                      onClick={() => {
                        const newState = toggleAutoMerge();
                        if (newState) {
                          toast.success('🎉 自动合成已开启！', {
                            description: '系统将每 2 秒自动合成相同等级的狗狗',
                            duration: 500,
                          });
                        }
                      }}
                      className={`w-14 h-8 rounded-full transition-all ${
                        gameState.userLevel < 20
                          ? 'bg-gray-300 cursor-not-allowed'
                          : gameState.autoMergeEnabled
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      } relative`}
                    >
                      <div
                        className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all ${
                          gameState.autoMergeEnabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 用户信息 */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200">
                    <div className="font-bold text-lg mb-2">👤 账号信息</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telegram ID:</span>
                        <span className="font-mono">{user?.id || '未登录'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">用户名:</span>
                        <span>{user?.username || user?.first_name || '游客'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">等级:</span>
                        <span className="font-bold text-purple-600">Lv.{gameState.userLevel}</span>
                      </div>
                    </div>
                  </div>

                  {/* 音量控制 */}
                  <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-200">
                    <div className="font-bold text-lg mb-2">🔊 音量控制</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">音效:</span>
                        <button className="w-14 h-8 rounded-full bg-gray-400 relative">
                          <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-1" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">背景音乐:</span>
                        <button className="w-14 h-8 rounded-full bg-gray-400 relative">
                          <div className="w-6 h-6 bg-white rounded-full absolute top-1 left-1" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">🚧 音效系统即将上线</p>
                      </div>
                    </div>
                  </div>

                  {/* 版本信息 */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg border-2 border-gray-200">
                    <div className="font-bold text-lg mb-2">ℹ️ 版本信息</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">当前版本:</span>
                        <span className="font-mono font-bold text-blue-600">{GAME_VERSION}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">更新日期:</span>
                        <span className="font-mono">{BUILD_DATE}</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>            </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* 解锁庆祝弹窗 */}
      {unlockCelebration && (
        <UnlockCelebration
          dogName={unlockCelebration.dogName}
          dogImage={unlockCelebration.dogImage}
          dogLevel={unlockCelebration.dogLevel}
          onClose={() => setUnlockCelebration(null)}
        />
      )}

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
        
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
