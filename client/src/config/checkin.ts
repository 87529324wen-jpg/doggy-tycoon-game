/**
 * 每日签到系统
 * 基于研究的最佳实践：7天递增奖励，提升留存
 */

export interface CheckinReward {
  day: number;
  coins: number;
  energy: number;
  special?: string; // 特殊奖励
}

export interface CheckinState {
  currentStreak: number; // 当前连续签到天数
  totalCheckins: number; // 总签到次数
  lastCheckinDate: string; // 上次签到日期
  checkedInToday: boolean; // 今天是否已签到
}

// 7天签到奖励配置（递增）
export const CHECKIN_REWARDS: CheckinReward[] = [
  { day: 1, coins: 500, energy: 5 },
  { day: 2, coins: 1000, energy: 10 },
  { day: 3, coins: 2000, energy: 15 },
  { day: 4, coins: 5000, energy: 20 },
  { day: 5, coins: 10000, energy: 30 },
  { day: 6, coins: 20000, energy: 50 },
  { day: 7, coins: 50000, energy: 100, special: 'rare_dog' },
];

/**
 * 获取当天的签到奖励
 * @param currentStreak 当前连续签到天数
 * @returns 签到奖励
 */
export function getTodayCheckinReward(currentStreak: number): CheckinReward {
  // 7天一个周期，循环
  const dayIndex = (currentStreak % 7) || 7;
  return CHECKIN_REWARDS[dayIndex - 1];
}

/**
 * 检查是否可以签到
 * @param lastCheckinDate 上次签到日期
 * @returns 是否可以签到
 */
export function canCheckin(lastCheckinDate: string): boolean {
  const today = new Date().toDateString();
  return lastCheckinDate !== today;
}

/**
 * 执行签到
 * @param state 当前签到状态
 * @returns 新的签到状态和奖励
 */
export function performCheckin(state: CheckinState): {
  newState: CheckinState;
  reward: CheckinReward;
} {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  // 判断是否连续签到
  const isContinuous = state.lastCheckinDate === yesterday;
  const newStreak = isContinuous ? state.currentStreak + 1 : 1;
  
  const reward = getTodayCheckinReward(newStreak);
  
  const newState: CheckinState = {
    currentStreak: newStreak,
    totalCheckins: state.totalCheckins + 1,
    lastCheckinDate: today,
    checkedInToday: true,
  };
  
  return { newState, reward };
}

/**
 * 初始化签到状态
 * @returns 初始签到状态
 */
export function initializeCheckinState(): CheckinState {
  return {
    currentStreak: 0,
    totalCheckins: 0,
    lastCheckinDate: '',
    checkedInToday: false,
  };
}

/**
 * 检查今天是否已签到
 * @param lastCheckinDate 上次签到日期
 * @returns 是否已签到
 */
export function hasCheckedInToday(lastCheckinDate: string): boolean {
  const today = new Date().toDateString();
  return lastCheckinDate === today;
}

/**
 * 获取下一次签到奖励预览
 * @param currentStreak 当前连续签到天数
 * @returns 下一次签到奖励
 */
export function getNextCheckinReward(currentStreak: number): CheckinReward {
  return getTodayCheckinReward(currentStreak + 1);
}
