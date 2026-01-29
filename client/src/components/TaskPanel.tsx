import { Task, Achievement } from '@/config/tasks';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/utils/offlineProgress';
import { Check, Gift } from 'lucide-react';

interface TaskPanelProps {
  tasks: Task[];
  achievements: Achievement[];
  onClaimTask: (taskId: string) => void;
}

export function TaskPanel({ tasks, achievements, onClaimTask }: TaskPanelProps) {
  const unclaimedTasks = tasks.filter(t => t.completed && !t.claimed);
  const unclaimedAchievements = achievements.filter(a => a.completed && !a.claimed);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* 每日任务 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">📋 每日任务</h3>
          {unclaimedTasks.length > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unclaimedTasks.length}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onClaim={() => onClaimTask(task.id)}
            />
          ))}
        </div>
      </div>
      
      {/* 成就 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold">🏆 成就</h3>
          {unclaimedAchievements.length > 0 && (
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unclaimedAchievements.length}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {achievements.map(achievement => (
            <AchievementItem
              key={achievement.id}
              achievement={achievement}
              onClaim={() => onClaimTask(achievement.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task, onClaim }: { task: Task; onClaim: () => void }) {
  const progress = (task.current / task.target) * 100;

  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-semibold">{task.title}</div>
          <div className="text-xs text-muted-foreground">{task.description}</div>
        </div>
        
        {task.claimed ? (
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            已领取
          </div>
        ) : task.completed ? (
          <Button size="sm" onClick={onClaim} className="ml-2">
            <Gift className="w-4 h-4 mr-1" />
            领取
          </Button>
        ) : null}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>进度</span>
          <span>{task.current} / {task.target}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex gap-2 mt-2 text-xs">
        <div className="bg-yellow-100 dark:bg-yellow-950 px-2 py-1 rounded">
          💰 {formatNumber(task.reward.coins)}
        </div>
        {task.reward.energy && (
          <div className="bg-blue-100 dark:bg-blue-950 px-2 py-1 rounded">
            ⚡ {task.reward.energy}
          </div>
        )}
      </div>
    </div>
  );
}

function AchievementItem({ 
  achievement, 
  onClaim 
}: { 
  achievement: Achievement; 
  onClaim: () => void 
}) {
  const progress = (achievement.current / achievement.target) * 100;

  return (
    <div className="bg-card border rounded-lg p-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-2 flex-1">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-semibold">{achievement.title}</div>
            <div className="text-xs text-muted-foreground">{achievement.description}</div>
          </div>
        </div>
        
        {achievement.claimed ? (
          <div className="flex items-center gap-1 text-green-500 text-sm">
            <Check className="w-4 h-4" />
            已领取
          </div>
        ) : achievement.completed ? (
          <Button size="sm" onClick={onClaim} className="ml-2">
            <Gift className="w-4 h-4 mr-1" />
            领取
          </Button>
        ) : null}
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>进度</span>
          <span>{achievement.current} / {achievement.target}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex gap-2 mt-2 text-xs">
        <div className="bg-yellow-100 dark:bg-yellow-950 px-2 py-1 rounded">
          💰 {formatNumber(achievement.reward.coins)}
        </div>
        {achievement.special && (
          <div className="bg-purple-100 dark:bg-purple-950 px-2 py-1 rounded">
            🎁 {achievement.special}
          </div>
        )}
      </div>
    </div>
  );
}
