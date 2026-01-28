import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Version info for debugging cache issues
const APP_VERSION = '1.0.3';
console.log(`%c🐕 萌犬大作战 v${APP_VERSION}`, 'font-size: 20px; color: #FFD700; font-weight: bold;');
console.log('%c✅ 最新版本已加载！', 'font-size: 14px; color: #4ECDC4;');
console.log('%c包含功能：狗狗镜像溜达、金额格式化、任务系统、容量升级按钮', 'font-size: 12px; color: #999;');

createRoot(document.getElementById("root")!).render(<App />);
