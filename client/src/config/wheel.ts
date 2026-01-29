/**
 * 幸运转盘系统
 * 基于研究的最佳实践：增加游戏趣味性和留存
 */

export interface WheelPrize {
  id: number;
  name: string;
  icon: string;
  coins?: number;
  energy?: number;
  special?: string;
  probability: number; // 概率（0-1）
  color: string; // 扇形颜色
}

export interface WheelState {
  dailySpins: number; // 今日剩余次数
  totalSpins: number; // 总转动次数
  lastSpinDate: string; // 上次转动日期
  prizes: WheelPrize[]; // 奖品列表
}

// 幸运转盘奖品配置
export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 1,
    name: '100 币',
    icon: '💰',
    coins: 100,
    probability: 0.30,
    color: '#FFD700',
  },
  {
    id: 2,
    name: '500 币',
    icon: '💰',
    coins: 500,
    probability: 0.25,
    color: '#FFA500',
  },
  {
    id: 3,
    name: '1000 币',
    icon: '💎',
    coins: 1000,
    probability: 0.20,
    color: '#FF6347',
  },
  {
    id: 4,
    name: '5000 币',
    icon: '💎',
    coins: 5000,
    probability: 0.15,
    color: '#9370DB',
  },
  {
    id: 5,
    name: '能量 +10',
    icon: '⚡',
    energy: 10,
    probability: 0.08,
    color: '#00CED1',
  },
  {
    id: 6,
    name: '稀有狗',
    icon: '🐕',
    special: 'rare_dog',
    probability: 0.02,
    color: '#FF1493',
  },
];

// 每日免费次数
export const DAILY_FREE_SPINS = 1;

/**
 * 转动轮盘（加权随机）
 * @returns 中奖的奖品
 */
export function spinWheel(): WheelPrize {
  const random = Math.random();
  let cumulative = 0;
  
  for (const prize of WHEEL_PRIZES) {
    cumulative += prize.probability;
    if (random <= cumulative) {
      return prize;
    }
  }
  
  // 兜底返回第一个奖品
  return WHEEL_PRIZES[0];
}

/**
 * 检查是否可以免费转动
 * @param state 轮盘状态
 * @returns 是否可以免费转动
 */
export function canSpinForFree(state: WheelState): boolean {
  const today = new Date().toDateString();
  
  // 如果是新的一天，重置次数
  if (state.lastSpinDate !== today) {
    return true;
  }
  
  return state.dailySpins > 0;
}

/**
 * 重置每日次数
 * @param state 当前状态
 * @returns 新状态
 */
export function resetDailySpins(state: WheelState): WheelState {
  const today = new Date().toDateString();
  
  if (state.lastSpinDate !== today) {
    return {
      ...state,
      dailySpins: DAILY_FREE_SPINS,
      lastSpinDate: today,
    };
  }
  
  return state;
}

/**
 * 执行转动
 * @param state 当前状态
 * @returns 新状态和中奖奖品
 */
export function performSpin(state: WheelState): {
  newState: WheelState;
  prize: WheelPrize;
} {
  const prize = spinWheel();
  const today = new Date().toDateString();
  
  // 更新状态
  const newState: WheelState = {
    ...state,
    dailySpins: Math.max(0, state.dailySpins - 1),
    totalSpins: state.totalSpins + 1,
    lastSpinDate: today,
  };
  
  return { newState, prize };
}

/**
 * 初始化轮盘状态
 * @returns 初始状态
 */
export function initializeWheelState(): WheelState {
  return {
    dailySpins: DAILY_FREE_SPINS,
    totalSpins: 0,
    lastSpinDate: '',
    prizes: WHEEL_PRIZES,
  };
}

/**
 * 计算轮盘扇形角度
 * @returns 每个奖品的起始和结束角度
 */
export function calculateWheelAngles(): Array<{ start: number; end: number; prize: WheelPrize }> {
  let currentAngle = 0;
  const angles: Array<{ start: number; end: number; prize: WheelPrize }> = [];
  
  for (const prize of WHEEL_PRIZES) {
    const angleSize = prize.probability * 360;
    angles.push({
      start: currentAngle,
      end: currentAngle + angleSize,
      prize,
    });
    currentAngle += angleSize;
  }
  
  return angles;
}

/**
 * 获取转盘旋转角度（用于动画）
 * @param prize 中奖奖品
 * @returns 旋转角度（度）
 */
export function getSpinAngle(prize: WheelPrize): number {
  const angles = calculateWheelAngles();
  const prizeAngle = angles.find(a => a.prize.id === prize.id);
  
  if (!prizeAngle) return 0;
  
  // 计算奖品的中心角度
  const centerAngle = (prizeAngle.start + prizeAngle.end) / 2;
  
  // 转动 3-5 圈后停在奖品位置
  const fullRotations = 3 + Math.random() * 2;
  const totalAngle = fullRotations * 360 + (360 - centerAngle);
  
  return totalAngle;
}
