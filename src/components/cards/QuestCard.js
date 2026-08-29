/**
 * QuestCard & StreakCard Components
 */

export function renderQuestCard({
  title = '',
  description = '',
  rewardXp = 500,
  progress = 0,
  maxProgress = 1,
  completed = false,
  icon = 'flag'
}) {
  const pct = Math.min(100, Math.round((progress / maxProgress) * 100));

  return `
    <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between hover:border-primary/40 transition-colors">
      <div class="flex items-start justify-between gap-3 mb-2">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg ${completed ? 'bg-primary/20 text-primary' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center">
            <span class="material-symbols-outlined text-[18px]">${completed ? 'verified' : icon}</span>
          </div>
          <div>
            <h4 class="font-headline-sm font-bold text-sm text-on-surface">${title}</h4>
            <p class="text-[11px] text-on-surface-variant font-terminal-code">${description}</p>
          </div>
        </div>
        <span class="text-xs font-bold text-primary font-terminal-code whitespace-nowrap">+${rewardXp} XP</span>
      </div>

      <div class="mt-2 pt-2 border-t border-surface-variant/30">
        <div class="flex justify-between items-center text-[10px] font-terminal-code text-on-surface-variant mb-1">
          <span>${progress}/${maxProgress}</span>
          <span>${completed ? 'Completed' : `${pct}%`}</span>
        </div>
        <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden">
          <div class="bg-primary h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
        </div>
      </div>
    </div>
  `;
}

export function renderStreakCard({
  streakDays = 1,
  lastActive = 'Today',
  multiplier = '1.0x'
}) {
  return `
    <div class="glass-panel p-5 rounded-xl border border-tertiary/30 bg-tertiary/5 flex items-center justify-between shadow-lg">
      <div class="flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-tertiary/20 text-tertiary flex items-center justify-center shadow-md">
          <span class="material-symbols-outlined text-2xl" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
        </div>
        <div>
          <span class="text-[10px] text-tertiary font-terminal-label uppercase font-bold tracking-wider">Active Multiplier: ${multiplier}</span>
          <div class="text-xl font-headline-md font-bold text-on-surface mt-0.5">${streakDays} Day Streak</div>
          <p class="text-[11px] text-on-surface-variant font-terminal-code">Maintained ${lastActive}</p>
        </div>
      </div>

      <div class="text-right">
        <span class="text-xs font-terminal-code text-tertiary font-bold">+25% XP Bonus</span>
      </div>
    </div>
  `;
}
