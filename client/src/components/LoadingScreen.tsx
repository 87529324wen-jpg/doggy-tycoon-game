import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
}

export function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('正在加载狗狗...');

  useEffect(() => {
    const texts = [
      '正在加载狗狗...',
      '正在准备便便矿场...',
      '正在召唤神犬...',
      '即将开始挖矿...'
    ];
    
    let currentIndex = 0;
    const textInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % texts.length;
      setLoadingText(texts[currentIndex]);
    }, 800);

    // 模拟加载进度
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(textInterval);
          setTimeout(onLoadComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      }}
    >
      {/* 背景动画装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 text-center px-8">
        {/* Logo/Icon */}
        <div className="mb-8 animate-bounce">
          <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/30">
            <span className="text-7xl">🐕</span>
          </div>
        </div>

        {/* 游戏标题 */}
        <h1 className="text-5xl font-black text-white mb-4 drop-shadow-2xl" style={{
          textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.5)'
        }}>
          萌犬大作战
        </h1>
        
        <p className="text-xl text-white/90 mb-8 font-semibold drop-shadow-lg">
          {loadingText}
        </p>

        {/* 进度条 */}
        <div className="w-80 mx-auto">
          <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm border-2 border-white/30 shadow-lg">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* 闪光效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
            </div>
          </div>
          <div className="mt-3 text-white/90 font-bold text-lg drop-shadow-lg">
            {progress}%
          </div>
        </div>

        {/* 小提示 */}
        <div className="mt-12 text-white/70 text-sm animate-pulse">
          💡 提示：点击狗狗可以加速挖矿哦！
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
