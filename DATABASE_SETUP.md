# 数据库配置说明

## 1. 创建 Neon PostgreSQL 数据库

1. 访问 https://neon.tech
2. 注册/登录账号
3. 点击 "Create Project"
4. 项目名称：`doggy-tycoon`
5. 选择区域：Singapore（新加坡，最接近亚洲用户）
6. 点击 "Create Project"

## 2. 获取数据库连接字符串

1. 在项目页面，点击 "Connection Details"
2. 复制 "Connection string"，格式类似：
   ```
   postgresql://username:password@ep-xxx-xxx.ap-southeast-1.aws.neon.tech/dbname?sslmode=require
   ```

## 3. 在 Vercel 配置环境变量

1. 访问 Vercel 项目页面：https://vercel.com/dashboard
2. 选择 `doggy-tycoon-game-njnm` 项目
3. 进入 Settings → Environment Variables
4. 添加新变量：
   - **Name**: `DATABASE_URL`
   - **Value**: 粘贴上面复制的连接字符串
   - **Environment**: 选择 Production, Preview, Development（全选）
5. 点击 "Save"

## 4. 重新部署

1. 进入 Deployments 页面
2. 点击最新部署右侧的 "..." 按钮
3. 选择 "Redeploy"
4. 等待部署完成（约 30-60 秒）

## 5. 验证

部署完成后：
1. 打开 Telegram，进入您的 Bot
2. 启动游戏
3. 购买一只狗狗
4. 关闭游戏，重新打开
5. 如果狗狗还在，说明云端存档成功！ ✅

## 数据库表结构

```sql
CREATE TABLE game_saves (
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
```

## 功能特性

- ✅ 自动绑定 Telegram 用户 ID
- ✅ 每 5 秒自动保存到云端
- ✅ 跨设备同步游戏进度
- ✅ 数据永久保存
- ✅ 支持排行榜功能（已实现 API）

## 故障排查

如果遇到问题：

1. **游戏无法加载**
   - 检查 Vercel 环境变量是否正确配置
   - 查看 Vercel 部署日志是否有错误

2. **数据未保存**
   - 打开浏览器控制台，查看是否有网络错误
   - 确认 DATABASE_URL 连接字符串正确

3. **数据库连接失败**
   - 确认 Neon 项目状态正常
   - 检查连接字符串是否包含 `?sslmode=require`
