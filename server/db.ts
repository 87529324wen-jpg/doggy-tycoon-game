import { Pool } from 'pg';

// Neon PostgreSQL 连接配置
// 用户需要在 Vercel 环境变量中设置 DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;

// 初始化数据库表
export async function initDatabase() {
  const client = await pool.connect();
  try {
    // 创建用户游戏数据表
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_saves (
        telegram_id BIGINT PRIMARY KEY,
        username VARCHAR(255),
        coins DECIMAL(20, 2) DEFAULT 0,
        user_level INTEGER DEFAULT 1,
        user_exp INTEGER DEFAULT 0,
        max_dogs INTEGER DEFAULT 6,
        dogs JSONB DEFAULT '[]'::jsonb,
        last_save_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 创建索引
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_game_saves_telegram_id ON game_saves(telegram_id);
      CREATE INDEX IF NOT EXISTS idx_game_saves_updated_at ON game_saves(updated_at);
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
