import { useState, useEffect, useCallback, useRef } from 'react';
import { DOG_BREEDS, getDogBreed, canMerge, getMergedLevel } from '@/config/dogConfig';
import { loadGame, saveGame as saveGameApi } from '@/lib/gameApi';
import { useTelegram } from './useTelegram';

export interface Dog {
  id: string;
  level: number;
  x: number;
  y: number;
  isDragging?: boolean;
}

export interface GameState {
  coins: number;
  dogs: Dog[];
  maxDogs: number;
  userLevel: number;
  userExp: number;
  autoMergeEnabled: boolean;
  lastSaveTime: number;
}

const STORAGE_KEY = 'doggy-poop-tycoon-save';
const AUTO_SAVE_INTERVAL = 5000; // 5秒自动保存
const PRODUCTION_INTERVAL = 1000; // 1秒产出一次
const EXP_PER_MERGE = 10; // 每次合成获得的经验
const EXP_PER_LEVEL = 100; // 每级需要的经验

export function useGameState() {
  const { user } = useTelegram();
  const [isLoading, setIsLoading] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    coins: 100,
    dogs: [],
    maxDogs: 6,
    userLevel: 1,
    userExp: 0,
    autoMergeEnabled: false,
    lastSaveTime: Date.now(),
  });

  const productionIntervalRef = useRef<number | undefined>(undefined);
  const autoSaveIntervalRef = useRef<number | undefined>(undefined);
  const lastCloudSaveRef = useRef<number>(Date.now());

  // 从云端加载游戏数据
  useEffect(() => {
    async function loadFromCloud() {
      console.log('🔍 Checking Telegram user:', user);
      
      if (!user?.id) {
        console.warn('⚠️ No Telegram user ID found, using localStorage');
        // 没有 Telegram 用户信息，从 localStorage 加载
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setGameState(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse saved game state', e);
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        console.log('📡 Loading game from cloud for user:', user.id);
        const response = await loadGame(user.id);
        if (response.success) {
          console.log('✅ Game loaded from cloud:', response.data);
          setGameState({
            ...response.data,
            autoMergeEnabled: false,
            lastSaveTime: Date.now(),
          });
        }
      } catch (error) {
        console.error('Failed to load from cloud, using localStorage', error);
        // 云端加载失败，尝试从 localStorage 加载
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            setGameState(JSON.parse(saved));
          } catch (e) {
            console.error('Failed to parse saved game state', e);
          }
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFromCloud();
  }, [user?.id]);

  // 保存游戏状态（本地 + 云端）
  const saveGame = useCallback(async () => {
    const stateToSave = {
      ...gameState,
      lastSaveTime: Date.now(),
    };
    
    // 保存到 localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));

    // 保存到云端（限制频率，避免过于频繁）
    const now = Date.now();
    if (user?.id && now - lastCloudSaveRef.current > 3000) {
      lastCloudSaveRef.current = now;
      try {
        const saveData = {
          telegramId: user.id,
          username: user.username || user.first_name,
          gameState: {
            coins: gameState.coins,
            dogs: gameState.dogs,
            maxDogs: gameState.maxDogs,
            userLevel: gameState.userLevel,
            userExp: gameState.userExp,
          },
        };
        console.log('💾 Saving to cloud:', saveData);
        await saveGameApi(saveData);
        console.log('✅ Game saved to cloud successfully');
      } catch (error) {
        console.error('Failed to save to cloud', error);
      }
    }
  }, [gameState, user]);

  // 自动保存
  useEffect(() => {
    if (isLoading) return;
    
    autoSaveIntervalRef.current = window.setInterval(saveGame, AUTO_SAVE_INTERVAL);
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [saveGame, isLoading]);

  // 计算总产出
  const calculateProduction = useCallback(() => {
    return gameState.dogs.reduce((total, dog) => {
      const breed = getDogBreed(dog.level);
      return total + breed.baseProduction;
    }, 0);
  }, [gameState.dogs]);

  // 自动产出
  useEffect(() => {
    if (isLoading) return;
    
    productionIntervalRef.current = window.setInterval(() => {
      const production = calculateProduction();
      if (production > 0) {
        setGameState(prev => ({
          ...prev,
          coins: prev.coins + production,
        }));
      }
    }, PRODUCTION_INTERVAL);

    return () => {
      if (productionIntervalRef.current) {
        clearInterval(productionIntervalRef.current);
      }
    };
  }, [calculateProduction, isLoading]);

  // 添加经验并升级
  const addExp = useCallback((exp: number) => {
    setGameState(prev => {
      let newExp = prev.userExp + exp;
      let newLevel = prev.userLevel;
      
      // 检查是否升级
      while (newExp >= EXP_PER_LEVEL) {
        newExp -= EXP_PER_LEVEL;
        newLevel++;
      }
      
      return {
        ...prev,
        userExp: newExp,
        userLevel: newLevel,
      };
    });
  }, []);

  // 购买狗狗
  const buyDog = useCallback((level: number) => {
    const breed = getDogBreed(level);
    
    if (gameState.coins < breed.purchasePrice) {
      return { success: false, message: '金币不足' };
    }
    
    if (gameState.dogs.length >= gameState.maxDogs) {
      return { success: false, message: '狗狗数量已达上限' };
    }

    // 随机位置
    const x = Math.random() * 0.6 + 0.2; // 20%-80%
    const y = Math.random() * 0.4 + 0.3; // 30%-70%

    setGameState(prev => ({
      ...prev,
      coins: prev.coins - breed.purchasePrice,
      dogs: [
        ...prev.dogs,
        {
          id: `dog-${Date.now()}-${Math.random()}`,
          level,
          x,
          y,
        },
      ],
    }));

    return { success: true };
  }, [gameState.coins, gameState.dogs.length, gameState.maxDogs]);

  // 扩展容量
  const expandCapacity = useCallback((cost: number) => {
    if (gameState.coins < cost) {
      return { success: false, message: '金币不足' };
    }

    setGameState(prev => ({
      ...prev,
      coins: prev.coins - cost,
      maxDogs: prev.maxDogs + 2,
    }));

    return { success: true };
  }, [gameState.coins]);

  // 更新狗狗位置（修复拖拽bug - 保持原有level不变）
  const updateDogPosition = useCallback((dogId: string, x: number, y: number) => {
    setGameState(prev => ({
      ...prev,
      dogs: prev.dogs.map(dog =>
        dog.id === dogId ? { ...dog, x, y } : dog
      ),
    }));
  }, []);

  // 设置拖拽状态
  const setDogDragging = useCallback((dogId: string, isDragging: boolean) => {
    setGameState(prev => ({
      ...prev,
      dogs: prev.dogs.map(dog =>
        dog.id === dogId ? { ...dog, isDragging } : dog
      ),
    }));
  }, []);

  // 合成狗狗
  const mergeDogs = useCallback((dog1Id: string, dog2Id: string) => {
    const dog1 = gameState.dogs.find(d => d.id === dog1Id);
    const dog2 = gameState.dogs.find(d => d.id === dog2Id);

    if (!dog1 || !dog2) return { success: false };
    if (!canMerge(dog1.level, dog2.level)) return { success: false };

    const newLevel = getMergedLevel(dog1.level);
    const newX = (dog1.x + dog2.x) / 2;
    const newY = (dog1.y + dog2.y) / 2;

    setGameState(prev => ({
      ...prev,
      dogs: [
        ...prev.dogs.filter(d => d.id !== dog1Id && d.id !== dog2Id),
        {
          id: `dog-${Date.now()}-${Math.random()}`,
          level: newLevel,
          x: newX,
          y: newY,
        },
      ],
    }));

    // 增加经验
    addExp(EXP_PER_MERGE);

    return { success: true };
  }, [gameState.dogs, addExp]);

  // 自动合成（扫描所有可合成的狗狗）
  const autoMerge = useCallback(() => {
    if (!gameState.autoMergeEnabled) return;

    setGameState(prev => {
      let dogs = [...prev.dogs];
      let merged = false;
      let totalExp = 0;

      // 按等级分组
      const dogsByLevel = new Map<number, Dog[]>();
      dogs.forEach(dog => {
        if (!dogsByLevel.has(dog.level)) {
          dogsByLevel.set(dog.level, []);
        }
        dogsByLevel.get(dog.level)!.push(dog);
      });

      // 对每个等级，两两合成
      dogsByLevel.forEach((dogsOfLevel, level) => {
        while (dogsOfLevel.length >= 2 && level < DOG_BREEDS.length) {
          const dog1 = dogsOfLevel.shift()!;
          const dog2 = dogsOfLevel.shift()!;
          
          const newLevel = getMergedLevel(level);
          const newDog: Dog = {
            id: `dog-${Date.now()}-${Math.random()}`,
            level: newLevel,
            x: (dog1.x + dog2.x) / 2,
            y: (dog1.y + dog2.y) / 2,
          };

          // 从dogs中移除旧狗
          dogs = dogs.filter(d => d.id !== dog1.id && d.id !== dog2.id);
          dogs.push(newDog);
          
          merged = true;
          totalExp += EXP_PER_MERGE;

          // 如果新狗可以继续合成，加入对应等级组
          if (!dogsByLevel.has(newLevel)) {
            dogsByLevel.set(newLevel, []);
          }
          dogsByLevel.get(newLevel)!.push(newDog);
        }
      });

      if (!merged) return prev;

      // 计算升级
      let newExp = prev.userExp + totalExp;
      let newLevel = prev.userLevel;
      while (newExp >= EXP_PER_LEVEL) {
        newExp -= EXP_PER_LEVEL;
        newLevel++;
      }

      return {
        ...prev,
        dogs,
        userExp: newExp,
        userLevel: newLevel,
      };
    });
  }, [gameState.autoMergeEnabled]);

  // 切换自动合成
  const toggleAutoMerge = useCallback(() => {
    const newState = !gameState.autoMergeEnabled;
    setGameState(prev => ({
      ...prev,
      autoMergeEnabled: newState,
    }));
    return newState;
  }, [gameState.autoMergeEnabled]);

  // 自动合成定时器
  useEffect(() => {
    if (!gameState.autoMergeEnabled) return;

    const interval = setInterval(autoMerge, 2000); // 每2秒检查一次
    return () => clearInterval(interval);
  }, [gameState.autoMergeEnabled, autoMerge]);

  // 添加金币（用于点击产出）
  const addCoins = useCallback((amount: number) => {
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + amount,
    }));
  }, []);

  return {
    gameState,
    isLoading,
    buyDog,
    expandCapacity,
    updateDogPosition,
    setDogDragging,
    mergeDogs,
    toggleAutoMerge,
    autoMerge,
    calculateProduction,
    saveGame,
    addCoins,
  };
}
