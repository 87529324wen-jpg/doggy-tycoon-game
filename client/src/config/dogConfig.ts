/*
 * 狗狗品种配置 - 扩展到20种
 * 参考《萌犬变变变》的合成系统
 */

export interface DogBreed {
  id: number;
  name: string;
  image: string;
  level: number;
  baseProduction: number; // 每秒产出便便数
  purchasePrice: number; // 购买价格
  unlockLevel: number; // 解锁等级（用户等级）
}

// 狗狗品种列表 - 20种特色狗狗（使用AI生成的高质量图片）
export const DOG_BREEDS: DogBreed[] = [
  { id: 1, name: '吉娃娃', image: '/images/dog-1.png', level: 1, baseProduction: 1, purchasePrice: 10, unlockLevel: 0 },
  { id: 2, name: '柯基', image: '/images/dog-2.png', level: 2, baseProduction: 3, purchasePrice: 50, unlockLevel: 0 },
  { id: 3, name: '柴犬', image: '/images/dog-3.png', level: 3, baseProduction: 8, purchasePrice: 200, unlockLevel: 0 },
  { id: 4, name: '比格犬', image: '/images/dog-4.png', level: 4, baseProduction: 20, purchasePrice: 800, unlockLevel: 0 },
  { id: 5, name: '博美', image: '/images/dog-5.png', level: 5, baseProduction: 50, purchasePrice: 3000, unlockLevel: 5 },
  { id: 6, name: '金毛', image: '/images/dog-6.png', level: 6, baseProduction: 120, purchasePrice: 12000, unlockLevel: 10 },
  { id: 7, name: '哈士奇', image: '/images/dog-7.png', level: 7, baseProduction: 300, purchasePrice: 50000, unlockLevel: 15 },
  { id: 8, name: '斑点狗', image: '/images/dog-8.png', level: 8, baseProduction: 700, purchasePrice: 200000, unlockLevel: 20 },
  { id: 9, name: '圣伯纳', image: '/images/dog-9.png', level: 9, baseProduction: 1500, purchasePrice: 800000, unlockLevel: 25 },
  { id: 10, name: '传说神犬', image: '/images/dog-10.png', level: 10, baseProduction: 3500, purchasePrice: 3000000, unlockLevel: 30 },
  { id: 11, name: '铃铛狗', image: '/images/dog-11.png', level: 11, baseProduction: 8000, purchasePrice: 12000000, unlockLevel: 35 },
  { id: 12, name: '墨镜狗', image: '/images/dog-12.png', level: 12, baseProduction: 18000, purchasePrice: 50000000, unlockLevel: 40 },
  { id: 13, name: '忍者狗', image: '/images/dog-13.png', level: 13, baseProduction: 40000, purchasePrice: 200000000, unlockLevel: 45 },
  { id: 14, name: '蝙蝠侠狗', image: '/images/dog-14.png', level: 14, baseProduction: 90000, purchasePrice: 800000000, unlockLevel: 50 },
  { id: 15, name: '超人狗', image: '/images/dog-15.png', level: 15, baseProduction: 200000, purchasePrice: 3000000000, unlockLevel: 55 },
  { id: 16, name: '变形金刚狗', image: '/images/dog-16.png', level: 16, baseProduction: 450000, purchasePrice: 12000000000, unlockLevel: 60 },
  { id: 17, name: '魔法狗', image: '/images/dog-17.png', level: 17, baseProduction: 1000000, purchasePrice: 50000000000, unlockLevel: 65 },
  { id: 18, name: '国王狗', image: '/images/dog-18.png', level: 18, baseProduction: 2200000, purchasePrice: 200000000000, unlockLevel: 70 },
  { id: 19, name: '宇航员狗', image: '/images/dog-19.png', level: 19, baseProduction: 5000000, purchasePrice: 800000000000, unlockLevel: 75 },
  { id: 20, name: '海盗狗', image: '/images/dog-20.png', level: 20, baseProduction: 11000000, purchasePrice: 3000000000000, unlockLevel: 80 },
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
