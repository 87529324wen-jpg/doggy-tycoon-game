/*
 * 狗狗品种配置 - 扩展到20种
 * 参考《萌犬变变变》的合成系统
 */

export interface DogBreed {
  id: number;
  name: string;
  emoji: string;
  level: number;
  baseProduction: number; // 每秒产出便便数
  purchasePrice: number; // 购买价格
  unlockLevel: number; // 解锁等级（用户等级）
}

// 狗狗品种列表 - 20种特色狗狗
export const DOG_BREEDS: DogBreed[] = [
  { id: 1, name: '铃铛狗', emoji: '🔔', level: 1, baseProduction: 1, purchasePrice: 10, unlockLevel: 0 },
  { id: 2, name: '墨镜狗', emoji: '😎', level: 2, baseProduction: 3, purchasePrice: 50, unlockLevel: 0 },
  { id: 3, name: '忍者狗', emoji: '🥷', level: 3, baseProduction: 8, purchasePrice: 200, unlockLevel: 0 },
  { id: 4, name: '厨师狗', emoji: '👨‍🍳', level: 4, baseProduction: 20, purchasePrice: 800, unlockLevel: 0 },
  { id: 5, name: '菊花狗', emoji: '🌼', level: 5, baseProduction: 50, purchasePrice: 3000, unlockLevel: 5 },
  { id: 6, name: '蝙蝠狗', emoji: '🦇', level: 6, baseProduction: 120, purchasePrice: 12000, unlockLevel: 10 },
  { id: 7, name: '超人狗', emoji: '🦸', level: 7, baseProduction: 300, purchasePrice: 50000, unlockLevel: 15 },
  { id: 8, name: '蜘蛛狗', emoji: '🕷️', level: 8, baseProduction: 700, purchasePrice: 200000, unlockLevel: 20 },
  { id: 9, name: '钢铁狗', emoji: '🤖', level: 9, baseProduction: 1500, purchasePrice: 800000, unlockLevel: 25 },
  { id: 10, name: '队长狗', emoji: '🛡️', level: 10, baseProduction: 3500, purchasePrice: 3000000, unlockLevel: 30 },
  { id: 11, name: '擎天狗', emoji: '🚛', level: 11, baseProduction: 8000, purchasePrice: 12000000, unlockLevel: 35 },
  { id: 12, name: '大黄蜂狗', emoji: '🚗', level: 12, baseProduction: 18000, purchasePrice: 50000000, unlockLevel: 40 },
  { id: 13, name: '魔法狗', emoji: '🧙', level: 13, baseProduction: 40000, purchasePrice: 200000000, unlockLevel: 45 },
  { id: 14, name: '海盗狗', emoji: '🏴‍☠️', level: 14, baseProduction: 90000, purchasePrice: 800000000, unlockLevel: 50 },
  { id: 15, name: '宇航狗', emoji: '🚀', level: 15, baseProduction: 200000, purchasePrice: 3000000000, unlockLevel: 55 },
  { id: 16, name: '花仙狗', emoji: '🌸', level: 16, baseProduction: 450000, purchasePrice: 12000000000, unlockLevel: 60 },
  { id: 17, name: '武士狗', emoji: '⚔️', level: 17, baseProduction: 1000000, purchasePrice: 50000000000, unlockLevel: 65 },
  { id: 18, name: '摇滚狗', emoji: '🎸', level: 18, baseProduction: 2200000, purchasePrice: 200000000000, unlockLevel: 70 },
  { id: 19, name: '龙神狗', emoji: '🐉', level: 19, baseProduction: 5000000, purchasePrice: 800000000000, unlockLevel: 75 },
  { id: 20, name: '彩虹神犬', emoji: '🌈', level: 20, baseProduction: 11000000, purchasePrice: 3000000000000, unlockLevel: 80 },
];

// 获取狗狗品种信息
export function getDogBreed(level: number): DogBreed {
  return DOG_BREEDS.find(dog => dog.level === level) || DOG_BREEDS[0];
}

// 合成规则：两只相同等级的狗可以合成下一级
export function canMerge(dog1Level: number, dog2Level: number): boolean {
  return dog1Level === dog2Level && dog1Level < DOG_BREEDS.length;
}

// 获取合成后的等级
export function getMergedLevel(level: number): number {
  return Math.min(level + 1, DOG_BREEDS.length);
}

// 根据用户等级判断是否解锁
export function isUnlocked(dogLevel: number, userLevel: number): boolean {
  const dog = getDogBreed(dogLevel);
  return userLevel >= dog.unlockLevel;
}
