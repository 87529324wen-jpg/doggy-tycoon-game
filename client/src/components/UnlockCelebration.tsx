import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface UnlockCelebrationProps {
  dogName: string;
  dogImage: string;
  dogLevel: number;
  onClose: () => void;
}

export function UnlockCelebration({ dogName, dogImage, dogLevel, onClose }: UnlockCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 延迟显示动画
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? 'bg-black/60 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div 
        className={`relative bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden transition-all duration-500 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white shadow-lg transition-all hover:scale-110"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-pink-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 right-0 w-48 h-48 bg-orange-300 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* 内容 */}
        <div className="relative z-10 p-8 text-center">
          {/* 标题 */}
          <div className="mb-6">
            <div className="text-6xl mb-3 animate-bounce">🎉</div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 mb-2">
              恭喜解锁！
            </h2>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-full"></div>
          </div>

          {/* 狗狗图片 */}
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white rounded-full p-6 shadow-xl mx-auto w-40 h-40 flex items-center justify-center">
              <img
                src={dogImage}
                alt={dogName}
                className="w-32 h-32 object-contain animate-bounce"
                style={{ animationDuration: '1.5s' }}
              />
            </div>
          </div>

          {/* 狗狗信息 */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{dogName}</h3>
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold shadow-lg">
              Level {dogLevel}
            </div>
          </div>

          {/* 提示文字 */}
          <p className="text-gray-600 text-sm mb-6">
            现在可以在商店购买这只狗狗了！
          </p>

          {/* 确认按钮 */}
          <button
            onClick={handleClose}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 hover:from-yellow-500 hover:via-orange-500 hover:to-pink-500 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-105 active:scale-95"
          >
            太棒了！
          </button>
        </div>

        {/* 装饰元素 */}
        <div className="absolute top-10 left-10 text-4xl animate-spin-slow">✨</div>
        <div className="absolute top-20 right-10 text-3xl animate-spin-slow" style={{ animationDelay: '0.5s' }}>⭐</div>
        <div className="absolute bottom-20 left-16 text-3xl animate-spin-slow" style={{ animationDelay: '1s' }}>🌟</div>
        <div className="absolute bottom-10 right-16 text-4xl animate-spin-slow" style={{ animationDelay: '1.5s' }}>💫</div>
      </div>
    </div>
  );
}
