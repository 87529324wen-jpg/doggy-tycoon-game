import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatNumber, formatOfflineDuration } from '@/utils/offlineProgress';

interface OfflineRewardDialogProps {
  open: boolean;
  onClose: () => void;
  coins: number;
  duration: number;
}

export function OfflineRewardDialog({ open, onClose, coins, duration }: OfflineRewardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">🎁 离线收益</DialogTitle>
          <DialogDescription className="text-center">
            你离开了 {formatOfflineDuration(duration)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="text-6xl animate-bounce">💰</div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">你获得了</div>
            <div className="text-4xl font-bold text-yellow-500">
              {formatNumber(coins)} 💩
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground text-center max-w-xs">
            离线期间产出为正常的 70%<br/>
            最多累计 24 小时
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={onClose}
            className="flex-1"
            size="lg"
          >
            领取奖励
          </Button>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            观看广告 x2
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
