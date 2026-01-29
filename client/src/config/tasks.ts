/**
 * 每日任务系统
 * 基于研究的最佳实践：增加玩家每日参与动力
 */

export type TaskType = 'click' | 'merge' | 'collect' | 'unlock' | 'production';

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  target: number;
  current: number;
  reward: {
    coins: number;
    energy?: number;
  };
  completed: boolean;
  claimed: boolean;
}

export interface Achievement extends Task {
  icon: string;
  special?: string; // 特殊奖励（如稀有狗狗）
}

// 每日任务配置
export const DAILY_TASKS: Omit<Task, 'current' | 'completed' | 'claimed'>[] = [
  {
    id: 'daily_click_100',
    title: '点击大师',
    description: '点击便便 100 次',
    type: 'click',
    target: 100,
    reward: { coins: 500 },
  },
  {
    id: 'daily_click_500',
    title: '点击狂魔',
    description: '点击便便 500 次',
    type: 'click',
    target: 500,
    reward: { coins: 2000, energy: 10 },
  },
  {
    id: 'daily_merge_10',
    title: '合成专家',
    description: '合成狗狗 10 次',
    type: 'merge',
    target: 10,
    reward: { coins: 1000 },
  },
  {
    id: 'daily_merge_30',
    title: '合成大师',
    description: '合成狗狗 30 次',
    type: 'merge',
    target: 30,
    reward: { coins: 5000, energy: 20 },
  },
  {
    id: 'daily_production_10000',
    title: '生产达人',
    description: '累计生产 10000 便便币',
    type: 'production',
    target: 10000,
    reward: { coins: 3000 },
  },
];

// 成就任务配置
export const ACHIEVEMENTS: Omit<Achievement, 'current' | 'completed' | 'claimed'>[] = [
  {
    id: 'achievement_click_1000',
    title: '点击新手',
    description: '累计点击 1000 次',
    icon: '👆',
    type: 'click',
    target: 1000,
    reward: { coins: 5000 },
  },
  {
    id: 'achievement_click_10000',
    title: '点击达人',
    description: '累计点击 10000 次',
    icon: '👆',
    type: 'click',
    target: 10000,
    reward: { coins: 50000 },
  },
  {
    id: 'achievement_click_100000',
    title: '点击传说',
    description: '累计点击 100000 次',
    icon: '🏆',
    type: 'click',
    target: 100000,
    reward: { coins: 500000 },
    special: 'golden_poop',
  },
  {
    id: 'achievement_merge_100',
    title: '合成新手',
    description: '累计合成 100 次',
    icon: '🔀',
    type: 'merge',
    target: 100,
    reward: { coins: 10000 },
  },
  {
    id: 'achievement_merge_1000',
    title: '合成大师',
    description: '累计合成 1000 次',
    icon: '🔀',
    type: 'merge',
    target: 1000,
    reward: { coins: 100000 },
  },
  {
    id: 'achievement_unlock_5',
    title: '狗狗收藏家',
    description: '解锁 5 种不同的狗狗',
    icon: '🐕',
    type: 'unlock',
    target: 5,
    reward: { coins: 20000 },
  },
  {
    id: 'achievement_unlock_10',
    title: '狗狗大师',
    description: '解锁 10 种不同的狗狗',
    icon: '🐕',
    type: 'unlock',
    target: 10,
    reward: { coins: 100000 },
    special: 'rare_dog',
  },
  {
    id: 'achievement_unlock_20',
    title: '狗狗传说',
    description: '解锁所有 20 种狗狗',
    icon: '👑',
    type: 'unlock',
    target: 20,
    reward: { coins: 1000000 },
    special: 'legendary_dog',
  },
  {
    id: 'achievement_production_1m',
    title: '百万富翁',
    description: '累计生产 1000000 便便币',
    icon: '💰',
    type: 'production',
    target: 1000000,
    reward: { coins: 50000 },
  },
  {
    id: 'achievement_production_10m',
    title: '千万富翁',
    description: '累计生产 10000000 便便币',
    icon: '💎',
    type: 'production',
    target: 10000000,
    reward: { coins: 500000 },
  },
];

// 初始化每日任务
export function initializeDailyTasks(): Task[] {
  return DAILY_TASKS.map(task => ({
    ...task,
    current: 0,
    completed: false,
    claimed: false,
  }));
}

// 初始化成就任务
export function initializeAchievements(): Achievement[] {
  return ACHIEVEMENTS.map(achievement => ({
    ...achievement,
    current: 0,
    completed: false,
    claimed: false,
  }));
}

// 检查任务是否完成
export function checkTaskCompletion(task: Task): boolean {
  return task.current >= task.target;
}

// 更新任务进度
export function updateTaskProgress(
  tasks: Task[],
  type: TaskType,
  increment: number = 1
): Task[] {
  return tasks.map(task => {
    if (task.type === type && !task.completed) {
      const newCurrent = task.current + increment;
      const completed = newCurrent >= task.target;
      return {
        ...task,
        current: Math.min(newCurrent, task.target),
        completed,
      };
    }
    return task;
  });
}

// 重置每日任务（每天 0 点调用）
export function resetDailyTasks(): Task[] {
  return initializeDailyTasks();
}

// 检查是否需要重置每日任务
export function shouldResetDailyTasks(lastResetDate: string): boolean {
  const today = new Date().toDateString();
  return lastResetDate !== today;
}
