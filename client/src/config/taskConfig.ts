export interface Task {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'click' | 'collect' | 'merge' | 'unlock' | 'capacity' | 'level';
  target: number;
  reward: {
    coins: number;
    exp?: number;
  };
  completed: boolean;
  progress: number;
}

export const DAILY_TASKS: Omit<Task, 'completed' | 'progress'>[] = [
  {
    id: 'daily_click_50',
    title: '点击狗狗50次',
    description: '点击任意狗狗累计50次',
    icon: '👆',
    type: 'click',
    target: 50,
    reward: { coins: 500, exp: 10 },
  },
  {
    id: 'daily_collect_1000',
    title: '收集1000便便',
    description: '累计收集1000个便便',
    icon: '💩',
    type: 'collect',
    target: 1000,
    reward: { coins: 1000, exp: 20 },
  },
  {
    id: 'daily_merge_5',
    title: '合成5次',
    description: '成功合成狗狗5次',
    icon: '✨',
    type: 'merge',
    target: 5,
    reward: { coins: 800, exp: 15 },
  },
];

export const ACHIEVEMENT_TASKS: Omit<Task, 'completed' | 'progress'>[] = [
  {
    id: 'unlock_dog_5',
    title: '解锁5种狗狗',
    description: '通过合成解锁5种不同的狗狗',
    icon: '🐕',
    type: 'unlock',
    target: 5,
    reward: { coins: 2000, exp: 50 },
  },
  {
    id: 'unlock_dog_10',
    title: '解锁10种狗狗',
    description: '通过合成解锁10种不同的狗狗',
    icon: '🏆',
    type: 'unlock',
    target: 10,
    reward: { coins: 5000, exp: 100 },
  },
  {
    id: 'capacity_10',
    title: '扩容到10',
    description: '将狗狗容量扩展到10',
    icon: '📦',
    type: 'capacity',
    target: 10,
    reward: { coins: 3000, exp: 50 },
  },
  {
    id: 'capacity_12',
    title: '扩容到最大',
    description: '将狗狗容量扩展到12（最大）',
    icon: '🎁',
    type: 'capacity',
    target: 12,
    reward: { coins: 5000, exp: 100 },
  },
  {
    id: 'level_10',
    title: '达到10级',
    description: '玩家等级达到10级',
    icon: '⭐',
    type: 'level',
    target: 10,
    reward: { coins: 3000, exp: 50 },
  },
  {
    id: 'level_20',
    title: '达到20级',
    description: '玩家等级达到20级，解锁自动合成',
    icon: '🌟',
    type: 'level',
    target: 20,
    reward: { coins: 10000, exp: 200 },
  },
];
