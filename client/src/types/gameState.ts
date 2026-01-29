/**
 * 游戏状态类型定义（增强版）
 */

import { Task, Achievement } from '@/config/tasks';
import { CheckinState } from '@/config/checkin';
import { ReferralData } from '@/config/referral';
import { WheelState } from '@/config/wheel';

export interface Dog {
  id: string;
  level: number;
  x: number;
  y: number;
  isDragging?: boolean;
}

export interface GameState {
  // 基础数据
  coins: number;
  dogs: Dog[];
  maxDogs: number;
  userLevel: number;
  userExp: number;
  
  // 功能开关
  autoMergeEnabled: boolean;
  
  // 时间戳
  lastSaveTime: number;
  lastOnlineTime: number; // 上次在线时间（用于离线收益）
  
  // 解锁状态
  unlockedLevels: number[]; // 已解锁的狗狗等级
  
  // 统计数据
  stats: {
    totalClicks: number;
    totalCoinsCollected: number;
    totalMerges: number;
    totalProduction: number;
    maxCombo: number;
    criticalHits: number;
  };
  
  // 任务系统
  dailyTasks: Task[];
  achievements: Achievement[];
  lastDailyReset: string; // 上次每日任务重置日期
  
  // 签到系统
  checkin: CheckinState;
  
  // 邀请系统
  referral: ReferralData;
  
  // 幸运转盘
  wheel: WheelState;
  
  // 商店购买记录
  purchases: {
    doubleProduction: boolean;
    autoMerge: boolean;
    removeAds: boolean;
  };
}

export interface OfflineRewardData {
  coins: number;
  duration: number;
  formattedDuration: string;
}
