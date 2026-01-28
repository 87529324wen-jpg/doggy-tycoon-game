# 萌犬大作战 - 部署说明

## 项目概述

**项目名称：** 萌犬大作战 (Doggy Poop Tycoon)  
**类型：** Telegram Mini App 游戏  
**技术栈：** React 19 + TypeScript + Vite + Tailwind CSS

## 功能特性

### ✅ 已实现功能

1. **20种特色狗狗品种**
   - 铃铛狗、墨镜狗、忍者狗、厨师狗、菊花狗
   - 蝙蝠狗（蝙蝠侠）、超人狗、蜘蛛狗、钢铁狗、队长狗
   - 擎天狗、大黄蜂狗、魔法狗、海盗狗、宇航狗
   - 花仙狗、武士狗、摇滚狗、龙神狗、彩虹神犬
   - 每种狗狗都有独特的AI生成图片

2. **拖拽合成系统**
   - ✅ 修复了拖拽后自动切换狗狗的bug
   - 使用 Pointer Events API 实现流畅拖拽
   - 碰撞检测自动合成
   - 相同等级狗狗可以合成为更高等级

3. **自动合成功能**
   - 一键开启/关闭自动合成
   - 每2秒自动扫描并合成相同等级的狗狗
   - 自动合成按钮有视觉反馈（绿色激活状态）

4. **用户等级制度**
   - 每次合成获得10点经验
   - 每100点经验升级
   - 高等级狗狗需要达到对应用户等级才能解锁购买
   - 顶部显示等级进度条

5. **商店系统**
   - 响应式设计，手机端优化
   - 滚动查看所有20种狗狗
   - 显示狗狗名称、等级、产出、价格
   - 未解锁狗狗显示灰色并标注需要等级
   - 金币不足时购买按钮禁用

6. **游戏经济系统**
   - 每只狗狗自动产出金币
   - 产出速度随等级递增
   - 扩容功能（增加狗狗容量上限）
   - 自动保存游戏进度到 localStorage

7. **Telegram 集成**
   - Telegram WebApp SDK 集成
   - Haptic 反馈（震动反馈）
   - 自动展开全屏
   - 移动端优化

8. **UI/UX 优化**
   - 渐变背景（天空+草地）
   - 流畅的动画效果
   - Toast 提示消息
   - 响应式布局（手机/平板/桌面）
   - 琥珀色主题配色

## 部署到 Vercel

### 方法一：通过 Vercel Dashboard

1. 登录 Vercel Dashboard
2. 点击 "Add New Project"
3. 导入 GitHub 仓库或上传项目文件
4. 配置构建设置：
   - Framework Preset: Vite
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
   - Install Command: `pnpm install`
5. 点击 "Deploy"

### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## Telegram Bot 配置

1. 在 BotFather 中设置 Mini App：
   ```
   /newapp
   /setappdomain - 设置为你的 Vercel 域名
   /setappshortname - 设置短名称（如 doggy_poop_tycoon）
   ```

2. 游戏访问链接：
   ```
   https://t.me/你的bot用户名/你的app短名称
   ```

## 环境变量

无需额外环境变量，项目开箱即用。

## 技术细节

### 拖拽 Bug 修复

**问题：** 原项目拖拽后会自动切换到其他狗狗

**解决方案：**
- 使用独立的 position state 管理拖拽位置
- 拖拽结束时只更新位置，不修改 level
- 使用 useEffect 同步外部位置更新（但不在拖拽时）
- 使用 Pointer Events 代替 Touch Events，更稳定

### 性能优化

- 使用 useCallback 避免不必要的重渲染
- 使用 useRef 存储定时器引用
- localStorage 自动保存（每5秒）
- 生产环境自动优化图片

### 移动端优化

- 禁用页面缩放（user-scalable=no）
- Touch-action: none 防止滚动干扰
- 响应式字体和图标大小
- 底部导航栏固定

## 已知限制

1. 音效未实现（可以后续添加 Web Audio API）
2. 多人在线功能未实现（纯本地游戏）
3. 云端存档未实现（使用 localStorage）

## 后续优化建议

1. 添加音效（合成、购买、升级）
2. 添加粒子效果（合成时的特效）
3. 添加成就系统
4. 添加排行榜（需要后端）
5. 添加每日任务
6. 添加离线收益

## 联系方式

如有问题，请通过 Telegram 联系。
