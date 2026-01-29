/**
 * 离线收益系统
 * 基于研究的最佳实践：让玩家离线时也能获得收益
 */

export interface OfflineReward {
  coins: number;
  duration: number; // 秒
  cappedDuration: number; // 实际计算的秒数
}

/**
 * 计算离线收益
 * @param lastSaveTime 上次保存时间戳（毫秒）
 * @param productionPerSecond 每秒产出
 * @param maxOfflineHours 最大离线时长（小时）
 * @returns 离线奖励信息
 */
export function calculateOfflineReward(
  lastSaveTime: number,
  productionPerSecond: number,
  maxOfflineHours: number = 24
): OfflineReward {
  const now = Date.now();
  const offlineMilliseconds = now - lastSaveTime;
  const offlineSeconds = Math.floor(offlineMilliseconds / 1000);
  
  // 限制最大离线时长
  const maxOfflineSeconds = maxOfflineHours * 3600;
  const cappedSeconds = Math.min(offlineSeconds, maxOfflineSeconds);
  
  // 计算离线收益（离线期间产出为正常的 70%）
  const offlineMultiplier = 0.7;
  const coins = Math.floor(productionPerSecond * cappedSeconds * offlineMultiplier);
  
  return {
    coins,
    duration: offlineSeconds,
    cappedDuration: cappedSeconds,
  };
}

/**
 * 格式化离线时长显示
 * @param seconds 秒数
 * @returns 格式化的时长字符串
 */
export function formatOfflineDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} 秒`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} 分钟`;
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} 小时 ${minutes} 分钟`;
  } else {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} 天 ${hours} 小时`;
  }
}

/**
 * 格式化大数字显示
 * @param num 数字
 * @returns 格式化的字符串
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  } else if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else if (num < 1000000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num < 1000000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else {
    return `${(num / 1000000000000).toFixed(1)}T`;
  }
}
