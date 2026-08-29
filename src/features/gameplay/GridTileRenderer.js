/**
 * GridTileRenderer
 * Generates semantic HTML tiles for the puzzle arena matching the Stitch design system.
 * Renders floor grid, perimeter & inner walls, hazards, switches, doors, the target goal node,
 * the pushable box, and the player hero sprite.
 */

export class GridTileRenderer {
  /**
   * Generate grid cells HTML
   * @param {import('../../adapters/EngineStateMapper.js').FrontendGameplayState} gameState
   * @returns {string}
   */
  static renderGridHtml(gameState) {
    if (!gameState || !gameState.grid) return '';

    const { width, height } = gameState.grid;
    const player = gameState.player;
    const box = gameState.box;
    const goal = gameState.goal;

    const wallsSet = new Set(gameState.grid.walls.map(w => `${w.x},${w.y}`));
    const hazardsSet = new Set(gameState.grid.hazards.map(h => `${h.x},${h.y}`));
    const switchesMap = new Map(gameState.grid.switches.map(s => [`${s.x},${s.y}`, s]));
    const doorsMap = new Map(gameState.grid.doors.map(d => [`${d.x},${d.y}`, d]));

    let tilesHtml = '';

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const key = `${x},${y}`;
        const isWall = wallsSet.has(key);
        const isHazard = hazardsSet.has(key);
        const switchObj = switchesMap.get(key);
        const doorObj = doorsMap.get(key);
        const isPlayer = player.x === x && player.y === y;
        const isBox = box.x === x && box.y === y;
        const isGoal = goal.x === x && goal.y === y;

        // Base cell style
        let cellClasses = 'relative flex items-center justify-center transition-all duration-150 select-none';
        let contentHtml = '';

        if (isWall) {
          cellClasses += ' bg-surface-container-high border border-outline-variant/30 shadow-inner rounded-sm';
          contentHtml = `
            <div class="w-full h-full bg-surface-bright/20 flex items-center justify-center">
              <span class="w-1.5 h-1.5 rounded-full bg-outline-variant/40"></span>
            </div>
          `;
        } else {
          // Normal floor tile
          cellClasses += ' bg-surface-container-lowest border border-outline-variant/10 rounded-sm hover:border-primary/20';

          if (isHazard) {
            contentHtml += `
              <div class="absolute inset-0 bg-error/15 flex items-center justify-center animate-pulse">
                <span class="material-symbols-outlined text-error/60 text-xs">warning</span>
              </div>
            `;
          }

          if (isGoal) {
            const isFilled = isBox;
            contentHtml += `
              <div class="absolute inset-1 rounded border-2 border-dashed ${isFilled ? 'border-primary bg-primary/20 shadow-[0_0_15px_#4edea350]' : 'border-primary/60 bg-primary/5 animate-pulse'} flex items-center justify-center">
                <span class="material-symbols-outlined text-[16px] text-primary">flag</span>
              </div>
            `;
          }

          if (switchObj) {
            contentHtml += `
              <div class="absolute inset-2 rounded-full ${switchObj.active ? 'bg-tertiary shadow-[0_0_10px_#ffb95f]' : 'bg-surface-variant border border-tertiary/40'} flex items-center justify-center">
                <span class="w-1.5 h-1.5 rounded-full bg-on-surface"></span>
              </div>
            `;
          }

          if (doorObj) {
            contentHtml += `
              <div class="absolute inset-0.5 rounded ${doorObj.open ? 'border border-dashed border-secondary/40 opacity-40' : 'bg-secondary/40 border border-secondary shadow-md'} flex items-center justify-center">
                <span class="material-symbols-outlined text-[14px] text-secondary">${doorObj.open ? 'lock_open' : 'lock'}</span>
              </div>
            `;
          }

          if (isBox) {
            const onGoal = box.isOnGoal;
            contentHtml += `
              <div class="absolute inset-1 rounded-lg ${onGoal ? 'bg-primary text-on-primary shadow-[0_0_20px_#4edea380]' : 'bg-surface-variant border border-primary/60 text-primary shadow-lg'} flex flex-col items-center justify-center font-terminal-label font-bold text-[10px] z-10 transition-transform duration-150 scale-95">
                <span class="material-symbols-outlined text-[18px]">${onGoal ? 'task_alt' : 'inventory_2'}</span>
                <span class="tracking-tighter uppercase text-[8px]">${onGoal ? 'STAGED' : 'COMMIT'}</span>
              </div>
            `;
          }

          if (isPlayer) {
            const dir = player.direction || 'up';
            let rotation = '0deg';
            if (dir === 'right') rotation = '90deg';
            if (dir === 'down') rotation = '180deg';
            if (dir === 'left') rotation = '270deg';

            contentHtml += `
              <div class="absolute inset-0.5 z-20 flex items-center justify-center transition-all duration-150">
                <div class="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary shadow-[0_0_15px_#4edea3] flex items-center justify-center transform transition-transform" style="transform: rotate(${rotation});">
                  <span class="material-symbols-outlined text-primary text-[20px]">navigation</span>
                </div>
              </div>
            `;
          }
        }

        tilesHtml += `<div class="${cellClasses}" data-cell-x="${x}" data-cell-y="${y}">${contentHtml}</div>`;
      }
    }

    return `
      <div 
        id="game-puzzle-grid" 
        class="grid gap-1 bg-surface-container-high/40 p-2 rounded-xl border border-outline-variant/30 shadow-2xl mx-auto"
        style="grid-template-columns: repeat(${width}, minmax(0, 1fr)); width: min(100%, ${width * 54}px); aspect-ratio: ${width} / ${height};"
      >
        ${tilesHtml}
      </div>
    `;
  }
}
