import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CHECKIN_REWARDS, CheckinReward } from '@/config/checkin';
import { formatNumber } from '@/utils/offlineProgress';
import { Check } from 'lucide-react';

interface CheckinDialogProps {
  open: boolean;
  onClose: () => void;
  onCheckin: () => void;
  currentStreak: number;
  todayReward: CheckinReward;
}

export function CheckinDialog({ 
  open, 
  onClose, 
  onCheckin, 
  currentStreak,
  todayReward 
}: CheckinDialogProps) {
  const handleCheckin = () => {
    onCheckin();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">📅 每日签到</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-7 gap-2 py-4">
          {CHECKIN_REWARDS.map((reward, index) => {
            const day = index + 1;
            const isToday = day === ((currentStreak % 7) || 7);
            const isCompleted = currentStreak >= day && !isToday;
            
            return (
              <div
                key={day}
                className={`
                  relative flex flex-col items-center gap-1 p-2 rounded-lg border-2
                  ${isToday ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : 'border-gray-200'}
                `}
              >
                {isCompleted && (
                  <div className="absolute top-1 right-1">
                    <Check className="w-4 h-4 text-green-500" />
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">Day {day}</div>
                <div className="text-lg">💰</div>
                <div className="text-xs font-bold">{formatNumber(reward.coins)}</div>
                <div className="text-xs text-muted-foreground">⚡{reward.energy}</div>
                
                {reward.special && (
                  <div className="text-xs">🎁</div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg">
          <div className="text-center mb-2">
            <div className="text-sm text-muted-foreground">今日奖励</div>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {formatNumber(todayReward.coins)} 💩 + {todayReward.energy} ⚡
            </div>
            {todayReward.special && (
              <div className="text-sm text-muted-foreground mt-1">
                + 稀有狗狗 🐕
              </div>
            )}
          </div>
        </div>
        
        <Button 
          onClick={handleCheckin}
          size="lg"
          className="w-full text-lg"
        >
          立即签到
        </Button>
        
        <div className="text-xs text-center text-muted-foreground">
          连续签到 {currentStreak} 天
        </div>
      </DialogContent>
    </Dialog>
  );
}
