import { GameState } from '@/hooks/useGameState';

const API_BASE = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';

export interface SaveGameRequest {
  telegramId: number;
  username?: string;
  gameState: Omit<GameState, 'lastSaveTime' | 'autoMergeEnabled'>;
}

export interface LoadGameResponse {
  success: boolean;
  data: Omit<GameState, 'lastSaveTime' | 'autoMergeEnabled'>;
  isNew: boolean;
}

export interface SaveGameResponse {
  success: boolean;
  message: string;
}

export interface LeaderboardEntry {
  rank: number;
  telegramId: number;
  username: string;
  coins: number;
  level: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data: LeaderboardEntry[];
}

// 加载游戏数据
export async function loadGame(telegramId: number): Promise<LoadGameResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/game/load/${telegramId}`);
    if (!response.ok) {
      throw new Error('Failed to load game');
    }
    return await response.json();
  } catch (error) {
    console.error('Load game error:', error);
    throw error;
  }
}

// 保存游戏数据
export async function saveGame(data: SaveGameRequest): Promise<SaveGameResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/game/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save game');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Save game error:', error);
    throw error;
  }
}

// 获取排行榜
export async function getLeaderboard(): Promise<LeaderboardResponse> {
  try {
    const response = await fetch(`${API_BASE}/api/game/leaderboard`);
    if (!response.ok) {
      throw new Error('Failed to load leaderboard');
    }
    return await response.json();
  } catch (error) {
    console.error('Leaderboard error:', error);
    throw error;
  }
}
