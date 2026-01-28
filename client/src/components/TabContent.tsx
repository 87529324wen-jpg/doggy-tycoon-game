import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Circle, Volume2, VolumeX } from 'lucide-react';
import { DAILY_TASKS, ACHIEVEMENT_TASKS, type Task } from '@/config/taskConfig';
import type { GameState } from '@/hooks/useGameState';
import { formatNumber } from '@/lib/formatNumber';

interface TabContentProps {
  activeTab: 'home' | 'shop' | 'tasks' | 'settings';
  gameState: GameState;
  onClaimTask?: (taskId: string) => void;
  onToggleAutoMerge?: () => void;
}

export function TabContent({ activeTab, gameState, onClaimTask, onToggleAutoMerge }: TabContentProps) {
  if (activeTab === 'tasks') {
    // 计算任务进度
    const getDailyTaskProgress = (task: Omit<Task, 'completed' | 'progress'>): number => {
      switch (task.type) {
        case 'click':
          return Math.min(gameState.taskStats.totalClicks, task.target);
        case 'collect':
          return Math.min(gameState.taskStats.totalCoinsCollected, task.target);
        case 'merge':
          return Math.min(gameState.taskStats.totalMerges, task.target);
        default:
          return 0;
      }
    };

    const getAchievementProgress = (task: Omit<Task, 'completed' | 'progress'>): number => {
      switch (task.type) {
        case 'unlock':
          return Math.min(gameState.unlockedLevels.length, task.target);
        case 'capacity':
          return Math.min(gameState.maxDogs, task.target);
        case 'level':
          return Math.min(gameState.userLevel, task.target);
        default:
          return 0;
      }
    };

    const dailyTasksWithProgress = DAILY_TASKS.map(task => ({
      ...task,
      progress: getDailyTaskProgress(task),
      completed: gameState.completedTasks.includes(task.id),
    }));

    const achievementTasksWithProgress = ACHIEVEMENT_TASKS.map(task => ({
      ...task,
      progress: getAchievementProgress(task),
      completed: gameState.completedTasks.includes(task.id),
    }));

    return (
      <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 h-full flex flex-col">
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-6">
            {/* 每日任务 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-purple-700">📅 每日任务</h3>
                <span className="text-xs text-gray-500">每日刷新</span>
              </div>
              <div className="space-y-3">
                {dailyTasksWithProgress.map((task) => {
                  const progressPercent = (task.progress / task.target) * 100;
                  const canClaim = task.progress >= task.target && !task.completed;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border-2 ${
                        task.completed
                          ? 'bg-gray-100 border-gray-300'
                          : canClaim
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-lg'
                          : 'bg-white border-purple-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{task.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-800">{task.title}</h4>
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>进度</span>
                              <span>{task.progress}/{task.target}</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-bold text-amber-600">💩 {formatNumber(task.reward.coins)}</span>
                              {task.reward.exp && (
                                <span className="text-blue-600">⭐ {task.reward.exp} EXP</span>
                              )}
                            </div>
                            {canClaim && (
                              <Button
                                size="sm"
                                onClick={() => onClaimTask?.(task.id)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500"
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

            {/* 成就任务 */}
            <div>
              <h3 className="text-lg font-bold text-purple-700 mb-3">🏆 成就任务</h3>
              <div className="space-y-3">
                {achievementTasksWithProgress.map((task) => {
                  const progressPercent = (task.progress / task.target) * 100;
                  const canClaim = task.progress >= task.target && !task.completed;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-xl border-2 ${
                        task.completed
                          ? 'bg-gray-100 border-gray-300'
                          : canClaim
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400 shadow-lg'
                          : 'bg-white border-purple-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{task.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-800">{task.title}</h4>
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>进度</span>
                              <span>{task.progress}/{task.target}</span>
                            </div>
                            <Progress value={progressPercent} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="font-bold text-amber-600">💩 {formatNumber(task.reward.coins)}</span>
                              {task.reward.exp && (
                                <span className="text-blue-600">⭐ {task.reward.exp} EXP</span>
                              )}
                            </div>
                            {canClaim && (
                              <Button
                                size="sm"
                                onClick={() => onClaimTask?.(task.id)}
                                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500"
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
        </ScrollArea>
      </div>
    );
  }

  if (activeTab === 'settings') {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
        <ScrollArea className="h-full">
          <div className="space-y-4">
            {/* 账号信息 */}
            <div className="p-4 bg-white rounded-xl border-2 border-blue-200 shadow-sm">
              <div className="font-bold text-lg mb-3">👤 账号信息</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">用户等级</span>
                  <span className="font-bold text-purple-600">Lv.{gameState.userLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">狗狗容量</span>
                  <span className="font-bold text-blue-600">{gameState.dogs.length}/{gameState.maxDogs}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">已解锁品种</span>
                  <span className="font-bold text-green-600">{gameState.unlockedLevels.length} 种</span>
                </div>
              </div>
            </div>

            {/* 游戏设置 */}
            <div className="p-4 bg-white rounded-xl border-2 border-purple-200 shadow-sm">
              <div className="font-bold text-lg mb-3">⚙️ 游戏设置</div>
              <div className="space-y-3">
                {/* 自动合成 */}
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">✨ 自动合成</div>
                    <div className="text-xs text-gray-500">
                      {gameState.userLevel >= 20 ? '自动合成相同等级的狗狗' : '20级解锁'}
                    </div>
                  </div>
                  <button
                    onClick={onToggleAutoMerge}
                    disabled={gameState.userLevel < 20}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      gameState.autoMergeEnabled ? 'bg-green-500' : 'bg-gray-300'
                    } ${gameState.userLevel < 20 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        gameState.autoMergeEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* 音效设置 */}
            <div className="p-4 bg-white rounded-xl border-2 border-orange-200 shadow-sm">
              <div className="font-bold text-lg mb-3">🔊 音效设置</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">🎵 背景音乐</div>
                    <div className="text-xs text-gray-500">开启/关闭背景音乐</div>
                  </div>
                  <Volume2 className="w-6 h-6 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-800">🔔 音效</div>
                    <div className="text-xs text-gray-500">开启/关闭游戏音效</div>
                  </div>
                  <VolumeX className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-500 mt-2">🚧 音效系统即将上线</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return null;
}
