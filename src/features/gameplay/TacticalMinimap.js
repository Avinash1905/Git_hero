// GitHero Tactical Minimap
// Renders high-level overview radar for large complex puzzle sectors.

export class TacticalMinimap {
  /**
   * Render SVG Minimap markup
   * @param {Object} state 
   * @param {number} sizePx 
   * @returns {string} SVG markup
   */
  static renderMinimap(state, sizePx = 120) {
    if (!state) return '';

    const gridSize = state.gridSize || 8;
    const cellSize = sizePx / gridSize;

    const walls = (state.walls || []).map(w => `
      <rect x="${w.x * cellSize}" y="${w.y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#2a3548" />
    `).join('');

    const hazards = (state.hazards || []).map(h => `
      <rect x="${h.x * cellSize}" y="${h.y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#ff5555" opacity="0.6" />
    `).join('');

    const goals = (state.goals || (state.goal ? [state.goal] : [])).map(g => `
      <rect x="${g.x * cellSize}" y="${g.y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#ffb95f" opacity="0.8" />
    `).join('');

    const boxes = (state.boxes || (state.box ? [state.box] : [])).map(b => `
      <circle cx="${b.x * cellSize + cellSize / 2}" cy="${b.y * cellSize + cellSize / 2}" r="${cellSize / 2.5}" fill="#adc6ff" />
    `).join('');

    const player = state.player ? `
      <circle cx="${state.player.x * cellSize + cellSize / 2}" cy="${state.player.y * cellSize + cellSize / 2}" r="${cellSize / 2.2}" fill="#4edea3" stroke="#ffffff" stroke-width="1.5" />
    ` : '';

    return `
      <div class="p-2 bg-surface-container-low rounded-lg border border-outline-variant/30 inline-block shadow-lg">
        <div class="flex items-center justify-between mb-1 text-xs text-on-surface-variant">
          <span class="font-mono font-bold text-xs flex items-center gap-1">
            <span class="material-symbols-Outlined text-xs text-primary">radar</span>
            SECTOR RADAR
          </span>
          <span class="font-mono">${gridSize}x${gridSize}</span>
        </div>
        <svg width="${sizePx}" height="${sizePx}" viewBox="0 0 ${sizePx} ${sizePx}" class="bg-surface-container-lowest rounded border border-outline-variant/20">
          ${walls}
          ${hazards}
          ${goals}
          ${boxes}
          ${player}
        </svg>
      </div>
    `;
  }
}
