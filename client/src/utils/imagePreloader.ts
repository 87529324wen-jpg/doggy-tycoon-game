/**
 * 图片预加载工具
 */

export function preloadImages(imageUrls: string[]): Promise<void[]> {
  const promises = imageUrls.map((url) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.warn(`Failed to preload image: ${url}`);
        resolve(); // 即使失败也继续
      };
      img.src = url;
    });
  });
  
  return Promise.all(promises);
}

export function preloadDogImages(maxLevel: number = 20): Promise<void[]> {
  const imageUrls = Array.from({ length: maxLevel }, (_, i) => `/images/dog-${i + 1}.png`);
  return preloadImages(imageUrls);
}
