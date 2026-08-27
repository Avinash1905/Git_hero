/**
 * LevelCardGrid
 * Reusable level selector grid for 250 sectors with star badges, lock/unlock state,
 * difficulty chips, and launch click handlers.
 */

export class LevelCardGrid {
  renderHtml(levels = [], progressMap = {}, options = {}) {
    const { onLaunch = 'handleLaunchLevel', onInspect = 'handleInspectLevel' } = options;

    const cards = levels.map(lvl => {
      const idStr = (lvl.id || '01').toString().padStart(2, '0');
      const prog = progressMap[idStr] || progressMap[lvl.id] || null;
      const isUnlocked = prog?.isUnlocked !== false && (Number(idStr) === 1 || !!prog);
      const isCompleted = prog?.isCompleted || false;
      const stars = prog?.stars || 0;

      const starIcons = [1, 2, 3].map(s => `
        <span class="material-symbols-outlined text-[13px] ${s <= stars ? 'text-amber-400' : 'text-outline-variant/30'}">star</span>
      `).join('');

      return `
        <div 
          onclick="${isUnlocked ? `${onInspect}('${idStr}')` : ''}"
          class="p-3 rounded-2xl border ${isCompleted ? 'border-primary/40 bg-surface-container-low' : isUnlocked ? 'border-outline-variant/30 bg-surface-container-lowest hover:border-primary/50 cursor-pointer' : 'border-outline-variant/10 bg-surface-container-lowest/30 opacity-40 cursor-not-allowed'} flex flex-col justify-between space-y-2 transition-all group"
        >
          <div class="flex items-center justify-between">
            <span class="font-mono text-xs font-bold ${isUnlocked ? 'text-primary' : 'text-on-surface-variant'}">#${idStr}</span>
            <div class="flex items-center gap-0.5">
              ${starIcons}
            </div>
          </div>

          <div class="space-y-0.5">
            <div class="font-mono text-xs font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">${lvl.title || `Sector ${idStr}`}</div>
            <div class="text-[10px] text-on-surface-variant line-clamp-1">${lvl.concept || 'Branching & Staging'}</div>
          </div>

          <div class="pt-1 border-t border-outline-variant/10 flex items-center justify-between text-[10px] font-mono">
            <span class="text-on-surface-variant">${lvl.difficulty || 'Normal'}</span>
            ${isUnlocked ? (isCompleted ? '<span class="text-primary font-bold">SOLVED</span>' : '<span class="text-on-surface-variant">READY</span>') : '<span class="material-symbols-outlined text-[14px]">lock</span>'}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        ${cards}
      </div>
    `;
  }
}

export const levelCardGrid = new LevelCardGrid();
