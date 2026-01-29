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

// 狗狗名称和图片配置
const DOG_NAMES = [
  '吉娃娃', '柯基', '柴犬 (Doge)', '比格犬', '博美',
  '金毛', '哈士奇', '斑点狗', '圣伯纳', '传说神犬',
  '铃铛狗', '墨镜狗', '忍者狗', '蝙蝠侠狗', '超人狗',
  '变形金刚狗', '魔法狗', '国王狗', '宇航员狗', '海盗狗',
];

// 数值生成公式（基于研究的最佳实践）
function generateDogStats(level: number) {
  // 产出公式：base * (2.5 ^ (level - 1))
  const baseProduction = Math.floor(1 * Math.pow(2.5, level - 1));
  
  // 成本公式：baseCost * (4 ^ (level - 1))
  const purchasePrice = Math.floor(10 * Math.pow(4, level - 1));
  
  // 解锁等级：每级需要前一级的经验
  const unlockLevel = Math.max(0, level - 1);
  
  return { baseProduction, purchasePrice, unlockLevel };
}

// 生成所有狗狗品种（公式化）
export const DOG_BREEDS: DogBreed[] = Array.from({ length: 20 }, (_, index) => {
  const level = index + 1;
  const stats = generateDogStats(level);
  
  return {
    id: level,
    name: DOG_NAMES[index],
    image: `/images/dog-${level}.png`,
    level,
    ...stats,
  };
});

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
