import { Router } from 'express';
import pool from './db';

const router = Router();

// 获取用户游戏数据
router.get('/api/game/load/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM game_saves WHERE telegram_id = $1',
      [telegramId]
    );

    if (result.rows.length === 0) {
      // 新用户，返回初始数据
      return res.json({
        success: true,
        data: {
          coins: 0,
          userLevel: 1,
          userExp: 0,
          maxDogs: 6,
          dogs: [],
        },
        isNew: true,
      });
    }

    const save = result.rows[0];
    res.json({
      success: true,
      data: {
        coins: parseFloat(save.coins),
        userLevel: save.user_level,
        userExp: save.user_exp,
        maxDogs: save.max_dogs,
        dogs: save.dogs,
      },
      isNew: false,
    });
  } catch (error) {
    console.error('Load game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load game data',
    });
  }
});

// 保存用户游戏数据
router.post('/api/game/save', async (req, res) => {
  try {
    const { telegramId, username, gameState } = req.body;

    if (!telegramId || !gameState) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const { coins, userLevel, userExp, maxDogs, dogs } = gameState;

    // 使用 UPSERT 操作
    await pool.query(
      `INSERT INTO game_saves (telegram_id, username, coins, user_level, user_exp, max_dogs, dogs, last_save_time, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT (telegram_id) 
       DO UPDATE SET
         username = $2,
         coins = $3,
         user_level = $4,
         user_exp = $5,
         max_dogs = $6,
         dogs = $7,
         last_save_time = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP`,
      [telegramId, username, coins, userLevel, userExp, maxDogs, JSON.stringify(dogs)]
    );

    res.json({
      success: true,
      message: 'Game saved successfully',
    });
  } catch (error) {
    console.error('Save game error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save game data',
    });
  }
});

// 获取排行榜
router.get('/api/game/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT telegram_id, username, coins, user_level
       FROM game_saves
       ORDER BY coins DESC
       LIMIT 100`
    );

    res.json({
      success: true,
      data: result.rows.map((row, index) => ({
        rank: index + 1,
        telegramId: row.telegram_id,
        username: row.username || '匿名玩家',
        coins: parseFloat(row.coins),
        level: row.user_level,
      })),
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load leaderboard',
    });
  }
});

export default router;
