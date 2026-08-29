/**
 * WorldCard & StatusChip Components
 */

export function renderWorldCard({
  worldNumber = 1,
  worldName = 'Foundations of Git',
  completedCount = 0,
  totalLevels = 13,
  isUnlocked = true,
  percentage = 0,
  stars = 0,
  onSelect = ''
}) {
  return `
    <div 
      data-world-card="${worldNumber}" 
      class="glass-panel p-5 rounded-2xl border ${isUnlocked ? 'border-primary/40 hover:border-primary cursor-pointer hover:shadow-[0_0_20px_#4edea320]' : 'border-outline-variant/20 opacity-50 cursor-not-allowed'} transition-all flex flex-col justify-between group"
      ${onSelect}
    >
      <div class="flex items-center justify-between mb-3">
        <span class="text-terminal-label font-terminal-label text-[10px] uppercase px-2 py-0.5 rounded ${isUnlocked ? 'bg-primary/20 text-primary border border-primary/30 font-bold' : 'bg-surface-container-high text-on-surface-variant'}">
          Sector ${String(worldNumber).padStart(2, '0')}
        </span>
        <div class="flex items-center gap-1 text-xs font-terminal-code text-on-surface-variant">
          <span class="material-symbols-outlined text-[16px]">${percentage === 100 ? 'verified' : (isUnlocked ? 'lock_open' : 'lock')}</span>
          <span>${percentage}%</span>
        </div>
      </div>

      <div>
        <h3 class="text-headline-sm font-bold text-on-surface text-base group-hover:text-primary transition-colors">
          ${worldName}
        </h3>
        <p class="text-[11px] text-on-surface-variant font-terminal-code mt-0.5">
          ${completedCount}/${totalLevels} Sectors Mastered
        </p>
      </div>

      <div class="mt-4 pt-3 border-t border-surface-variant/30 font-terminal-code">
        <div class="w-full bg-surface-container-lowest h-1.5 rounded-full overflow-hidden mb-1.5">
          <div class="bg-primary h-full rounded-full transition-all duration-300" style="width: ${percentage}%"></div>
        </div>
        <div class="flex justify-between items-center text-[10px] text-on-surface-variant">
          <span class="text-tertiary flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">star</span>
            ${stars} Stars
          </span>
          <span class="text-secondary font-bold">World ${worldNumber}</span>
        </div>
      </div>
    </div>
  `;
}

export function renderStatusChip({
  label = '',
  status = 'ONLINE', // 'ONLINE' | 'OFFLINE' | 'STAGED' | 'MODIFIED' | 'COMMITTED'
  className = ''
}) {
  let dotColor = 'bg-primary';
  let badgeColor = 'bg-primary/10 text-primary border-primary/30';

  if (status === 'OFFLINE' || status === 'ERROR') {
    dotColor = 'bg-error';
    badgeColor = 'bg-error/10 text-error border-error/30';
  } else if (status === 'MODIFIED' || status === 'WARNING') {
    dotColor = 'bg-tertiary';
    badgeColor = 'bg-tertiary/10 text-tertiary border-tertiary/30';
  } else if (status === 'COMMITTED') {
    dotColor = 'bg-secondary';
    badgeColor = 'bg-secondary/10 text-secondary border-secondary/30';
  }

  return `
    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-terminal-label border ${badgeColor} ${className}">
      <span class="w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse"></span>
      <span class="font-bold uppercase tracking-wider">${label || status}</span>
    </span>
  `;
}
