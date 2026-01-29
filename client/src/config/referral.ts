/**
 * 邀请系统
 * 基于研究的最佳实践：社交传播机制
 */

export interface ReferralData {
  referralCode: string; // 我的邀请码
  referredBy?: string; // 被谁邀请
  referralCount: number; // 我邀请的人数
  referralBonus: number; // 邀请加成（百分比）
  referredUsers: string[]; // 被邀请用户列表
}

export interface ReferralReward {
  count: number; // 邀请人数
  bonus: number; // 产出加成（百分比）
  coins?: number; // 金币奖励
  special?: string; // 特殊奖励
}

// 邀请奖励阶梯
export const REFERRAL_REWARDS: ReferralReward[] = [
  { count: 1, bonus: 5, coins: 1000 },
  { count: 3, bonus: 15, coins: 5000 },
  { count: 5, bonus: 25, coins: 20000, special: 'rare_dog' },
  { count: 10, bonus: 50, coins: 100000, special: 'legendary_skin' },
  { count: 20, bonus: 100, coins: 500000, special: 'golden_dog' },
  { count: 50, bonus: 200, coins: 2000000, special: 'ultimate_dog' },
];

/**
 * 生成邀请码
 * @param userId 用户ID
 * @returns 8位邀请码
 */
export function generateReferralCode(userId: string): string {
  // 使用 Base64 编码并截取前8位
  try {
    return btoa(userId).slice(0, 8).toUpperCase();
  } catch {
    // 如果 btoa 失败，使用简单的哈希
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36).slice(0, 8).toUpperCase();
  }
}

/**
 * 计算邀请加成
 * @param referralCount 邀请人数
 * @returns 产出加成倍数（1.0 = 无加成）
 */
export function calculateReferralBonus(referralCount: number): number {
  let totalBonus = 0;
  
  for (const reward of REFERRAL_REWARDS) {
    if (referralCount >= reward.count) {
      totalBonus = reward.bonus;
    } else {
      break;
    }
  }
  
  return 1 + (totalBonus / 100);
}

/**
 * 获取下一个邀请奖励
 * @param currentCount 当前邀请人数
 * @returns 下一个奖励，如果没有则返回 null
 */
export function getNextReferralReward(currentCount: number): ReferralReward | null {
  for (const reward of REFERRAL_REWARDS) {
    if (currentCount < reward.count) {
      return reward;
    }
  }
  return null;
}

/**
 * 获取已解锁的邀请奖励
 * @param referralCount 邀请人数
 * @returns 已解锁的奖励列表
 */
export function getUnlockedRewards(referralCount: number): ReferralReward[] {
  return REFERRAL_REWARDS.filter(reward => referralCount >= reward.count);
}

/**
 * 生成 Telegram 分享链接
 * @param referralCode 邀请码
 * @param botUsername Telegram bot 用户名
 * @returns 分享链接
 */
export function generateShareLink(referralCode: string, botUsername: string = 'doggy_poop_game_bot'): string {
  const url = `https://t.me/${botUsername}?start=${referralCode}`;
  return url;
}

/**
 * 生成分享文案
 * @param referralCode 邀请码
 * @param username 用户名
 * @returns 分享文案
 */
export function generateShareText(referralCode: string, username?: string): string {
  const text = username
    ? `🐶 ${username} 邀请你一起玩 Doggy Tycoon！\n\n💰 使用邀请码 ${referralCode} 加入游戏\n🎁 你将获得新手大礼包\n🚀 我们一起 To the Moon！`
    : `🐶 Join me in Doggy Tycoon!\n\n💰 Use code: ${referralCode}\n🎁 Get starter bonus\n🚀 To the Moon!`;
  
  return text;
}

/**
 * 分享到 Telegram
 * @param referralCode 邀请码
 * @param botUsername Telegram bot 用户名
 */
export function shareToTelegram(referralCode: string, botUsername: string = 'doggy_poop_game_bot'): void {
  const url = generateShareLink(referralCode, botUsername);
  const text = generateShareText(referralCode);
  
  const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  
  // 如果在 Telegram WebApp 环境中
  if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
    (window as any).Telegram.WebApp.openTelegramLink(shareUrl);
  } else {
    // 否则在新窗口打开
    window.open(shareUrl, '_blank');
  }
}

/**
 * 初始化邀请数据
 * @param userId 用户ID
 * @returns 初始邀请数据
 */
export function initializeReferralData(userId: string): ReferralData {
  return {
    referralCode: generateReferralCode(userId),
    referralCount: 0,
    referralBonus: 1.0,
    referredUsers: [],
  };
}
