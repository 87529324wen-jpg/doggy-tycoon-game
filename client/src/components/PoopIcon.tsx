interface PoopIconProps {
  className?: string;
  size?: number;
}

export function PoopIcon({ className = '', size = 32 }: PoopIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 底部最大的一坨 */}
      <ellipse cx="32" cy="48" rx="22" ry="14" fill="#8B4513" />
      <ellipse cx="32" cy="48" rx="20" ry="12" fill="#A0522D" />
      
      {/* 中间的一坨 */}
      <ellipse cx="32" cy="34" rx="18" ry="12" fill="#8B4513" />
      <ellipse cx="32" cy="34" rx="16" ry="10" fill="#A0522D" />
      
      {/* 顶部的一坨 */}
      <ellipse cx="32" cy="22" rx="14" ry="10" fill="#8B4513" />
      <ellipse cx="32" cy="22" rx="12" ry="8" fill="#A0522D" />
      
      {/* 高光效果 */}
      <ellipse cx="26" cy="20" rx="4" ry="3" fill="#D2691E" opacity="0.6" />
      <ellipse cx="38" cy="32" rx="3" ry="2" fill="#D2691E" opacity="0.6" />
      <ellipse cx="24" cy="46" rx="5" ry="3" fill="#D2691E" opacity="0.6" />
      
      {/* 阴影 */}
      <ellipse cx="32" cy="60" rx="20" ry="3" fill="#000000" opacity="0.2" />
    </svg>
  );
}
