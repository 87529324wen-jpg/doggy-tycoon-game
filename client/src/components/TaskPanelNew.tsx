import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatNumber } from '@/lib/formatNumber';
import { CheckCircle2, Circle } from 'lucide-react';

interface Task {
  id: string;
  icon: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: {
    coins: number;
  };
  completed: boolean;
  claimed: boolean;
}

interface TaskPanelNewProps {
  dailyTasks: Task[];
  achievementTasks: Task[];
  onClaimTask: (taskId: string) => void;
}

export function TaskPanelNew({ dailyTasks, achievementTasks, onClaimTask }: TaskPanelNewProps) {
  const unclaimedCount = [...dailyTasks, ...achievementTasks].filter(t => t.completed && !t.claimed).length;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* 头部 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b-2 border-purple-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-800">每日任务</h2>
            <p className="text-xs text-gray-500">完成任务领取奖励</p>
          </div>
        </div>
        {unclaimedCount > 0 && (
          <div className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-bounce shadow-lg">
            {unclaimedCount}
          </div>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* 每日任务 */}
        <div className="space-y-3">
          {dailyTasks.map((task) => {
            const progress = (task.current / task.target) * 100;
            const canClaim = task.completed && !task.claimed;
            const isClaimed = task.claimed;

            return (
              <div
                key={task.id}
                className={`relative rounded-2xl p-4 border-3 transition-all duration-300 ${
                  isClaimed
                    ? 'bg-gray-100 border-gray-300 opacity-60'
                    : canClaim
                    ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400 shadow-xl scale-105 animate-pulse'
                    : 'bg-white border-purple-200 hover:shadow-lg hover:scale-102'
                }`}
                style={{
                  boxShadow: canClaim ? '0 8px 20px rgba(251, 191, 36, 0.4)' : undefined,
                }}
              >
                {/* 完成标记 */}
                {isClaimed && (
                  <div className="absolute top-2 right-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                )}

                <div className="flex items-start gap-4">
                  {/* 图标 */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${
                    canClaim ? 'bg-yellow-200 animate-bounce' : 'bg-gray-100'
                  }`}>
                    {task.icon}
                  </div>

                  {/* 内容 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                    {/* 进度 */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span className="font-semibold">进度</span>
                        <span className="font-bold">{task.current}/{task.target}</span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress >= 100
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                              : 'bg-gradient-to-r from-orange-400 to-pink-400'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* 奖励和按钮 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-lg">
                        <span className="text-2xl">💩</span>
                        <span className="font-black text-lg text-amber-700">
                          {formatNumber(task.reward.coins)}
                        </span>
                      </div>

                      {canClaim && (
                        <Button
                          onClick={() => onClaimTask(task.id)}
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                        >
                          领取
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 成就任务 */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="text-lg font-black text-gray-800">成就任务</h3>
          </div>

          <div className="space-y-3">
            {achievementTasks.map((task) => {
              const progress = (task.current / task.target) * 100;
              const canClaim = task.completed && !task.claimed;
              const isClaimed = task.claimed;

              return (
                <div
                  key={task.id}
                  className={`relative rounded-2xl p-4 border-3 transition-all duration-300 ${
                    isClaimed
                      ? 'bg-gray-100 border-gray-300 opacity-60'
                      : canClaim
                      ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-400 shadow-xl scale-105'
                      : 'bg-white border-purple-200 hover:shadow-lg'
                  }`}
                >
                  {isClaimed && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-4xl ${
                      canClaim ? 'bg-yellow-200' : 'bg-gray-100'
                    }`}>
                      {task.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{task.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span className="font-semibold">进度</span>
                          <span className="font-bold">{task.current}/{task.target}</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              progress >= 100
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-purple-400 to-pink-400'
                            }`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-amber-100 px-3 py-1.5 rounded-lg">
                          <span className="text-2xl">💩</span>
                          <span className="font-black text-lg text-amber-700">
                            {formatNumber(task.reward.coins)}
                          </span>
                        </div>

                        {canClaim && (
                          <Button
                            onClick={() => onClaimTask(task.id)}
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                          >
                            领取
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
