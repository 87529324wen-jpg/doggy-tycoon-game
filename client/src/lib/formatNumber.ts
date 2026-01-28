/**
 * 格式化数字为简洁单位
 * 1,000 -> 1.00K
 * 1,000,000 -> 1.00M
 * 1,000,000,000 -> 1.00B
 * 等等
 */
export function formatNumber(num: number): string {
  if (num < 1000) {
    return Math.floor(num).toString();
  }

  const units = ['K', 'M', 'B', 'T', 'Q', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier === 0) {
    return Math.floor(num).toString();
  }

  const unit = units[tier - 1];
  const scaled = num / Math.pow(1000, tier);
  
  // 保留2位小数
  return scaled.toFixed(2) + unit;
}

/**
 * 格式化数字为整数（用于显示等级、数量等）
 */
export function formatInteger(num: number): string {
  return Math.floor(num).toLocaleString();
}
