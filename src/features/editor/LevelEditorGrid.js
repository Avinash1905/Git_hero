/**
 * LevelEditorGrid & LevelEditorToolbar
 * Interactive puzzle designer allowing developers to place entities on a grid
 * and test custom level mechanics.
 */

export class LevelEditorToolbar {
  static renderToolbarHtml(activeTool = 'wall') {
    const tools = [
      { id: 'wall', label: 'Wall', icon: 'square' },
      { id: 'player', label: 'Hero Spawn', icon: 'navigation' },
      { id: 'box', label: 'Pushable Box', icon: 'inventory_2' },
      { id: 'goal', label: 'Goal Node', icon: 'flag' },
      { id: 'hazard', label: 'Hazard', icon: 'warning' },
      { id: 'eraser', label: 'Eraser', icon: 'ink_eraser' }
    ];

    const buttons = tools.map((t) => `
      <button 
        data-tool="${t.id}"
        class="px-3 py-2 rounded-lg text-xs font-terminal-label flex items-center gap-1.5 transition-colors cursor-pointer ${activeTool === t.id ? 'bg-primary text-on-primary font-bold shadow-md' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}"
      >
        <span class="material-symbols-outlined text-[16px]">${t.icon}</span>
        <span>${t.label}</span>
      </button>
    `).join('');

    return `
      <div class="flex flex-wrap items-center gap-2 p-2 bg-surface-container-lowest/80 rounded-xl border border-outline-variant/30">
        ${buttons}
      </div>
    `;
  }
}

export class LevelEditorGrid {
  /**
   * Render editor interactive grid cells
   * @param {Object} levelDef
   * @returns {string}
   */
  static renderGridHtml(levelDef) {
    const width = levelDef.width || levelDef.gridSize || 6;
    const height = levelDef.height || levelDef.gridSize || 6;

    const wallsSet = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));
    const hazardsSet = new Set((levelDef.hazards || []).map(h => `${h.x},${h.y}`));

    let cellsHtml = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = `${x},${y}`;
        const isWall = wallsSet.has(key);
        const isHazard = hazardsSet.has(key);
        const isPlayer = levelDef.player?.x === x && levelDef.player?.y === y;
        const isBox = levelDef.box?.x === x && levelDef.box?.y === y;
        const isGoal = levelDef.goal?.x === x && levelDef.goal?.y === y;

        let content = '';
        let cellClass = 'bg-surface-container-lowest/70 hover:bg-surface-container-high/60 border border-outline-variant/15';

        if (isWall) {
          cellClass = 'bg-surface-container-highest border border-outline-variant/40';
          content = '<span class="text-[10px] text-outline-variant select-none">#</span>';
        } else if (isHazard) {
          cellClass = 'bg-error/20 border border-error/40 text-error';
          content = '<span class="material-symbols-outlined text-[18px]">warning</span>';
        } else if (isPlayer) {
          cellClass = 'bg-primary/20 border border-primary text-primary';
          content = '<span class="material-symbols-outlined text-[18px]">navigation</span>';
        } else if (isBox) {
          cellClass = 'bg-secondary/20 border border-secondary text-secondary';
          content = '<span class="material-symbols-outlined text-[18px]">inventory_2</span>';
        } else if (isGoal) {
          cellClass = 'bg-tertiary/20 border border-tertiary text-tertiary';
          content = '<span class="material-symbols-outlined text-[18px]">flag</span>';
        }

        cellsHtml += `
          <div 
            data-editor-x="${x}" 
            data-editor-y="${y}" 
            class="w-12 h-12 flex items-center justify-center rounded-md cursor-pointer transition-all ${cellClass}"
          >
            ${content}
          </div>
        `;
      }
    }

    return `
      <div 
        id="level-editor-grid" 
        class="grid gap-1 p-3 bg-surface-container-lowest/90 rounded-xl border border-outline-variant/40 shadow-xl"
        style="grid-template-columns: repeat(${width}, minmax(0, 1fr));"
      >
        ${cellsHtml}
      </div>
    `;
  }
}
