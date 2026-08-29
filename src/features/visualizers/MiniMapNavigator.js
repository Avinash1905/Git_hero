/**
 * GitQuest Frontend - MiniMap Navigator
 * Real-time minimap display showing dungeon rooms, player locator radar,
 * objective beacons, and fog-of-war exploration.
 */

export class MiniMapNavigator {
  constructor(options = {}) {
    this.containerId = options.containerId || 'gitquest-minimap';
    this.mapWidth = options.mapWidth || 160;
    this.mapHeight = options.mapHeight || 160;
    this.fogOfWar = options.fogOfWar !== false;
    this.discoveredCells = new Set();
  }

  revealArea(playerX, playerY, visionRadius = 2) {
    for (let dx = -visionRadius; dx <= visionRadius; dx++) {
      for (let dy = -visionRadius; dy <= visionRadius; dy++) {
        if (dx * dx + dy * dy <= visionRadius * visionRadius + 0.5) {
          this.discoveredCells.add(`${playerX + dx},${playerY + dy}`);
        }
      }
    }
  }

  renderMinimapSvg(levelDef, currentGameState = {}) {
    if (!levelDef) return '<svg class="minimap-svg"></svg>';

    const size = levelDef.gridSize || 8;
    const cellSize = this.mapWidth / size;
    const walls = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));
    const hazards = new Set((levelDef.hazards || []).map(h => `${h.x},${h.y}`));

    const player = currentGameState.player || levelDef.player || { x: 0, y: 0 };
    const box = currentGameState.box || levelDef.box || { x: 0, y: 0 };
    const goal = levelDef.goal || { x: size - 1, y: size - 1 };

    this.revealArea(player.x, player.y, 3);

    let cellsSvg = '';

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const key = `${x},${y}`;
        const isDiscovered = !this.fogOfWar || this.discoveredCells.has(key);

        const px = x * cellSize;
        const py = y * cellSize;

        if (!isDiscovered) {
          cellsSvg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#030712" stroke="#111827" stroke-width="0.5"/>`;
          continue;
        }

        if (walls.has(key)) {
          cellsSvg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#475569" stroke="#334155" stroke-width="0.5"/>`;
        } else if (hazards.has(key)) {
          cellsSvg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" stroke-width="0.5"/>`;
        } else {
          cellsSvg += `<rect x="${px}" y="${py}" width="${cellSize}" height="${cellSize}" fill="#0f172a" stroke="#1e293b" stroke-width="0.5"/>`;
        }
      }
    }

    // Goal beacon
    const goalX = goal.x * cellSize + cellSize / 2;
    const goalY = goal.y * cellSize + cellSize / 2;
    const goalSvg = `
      <g class="minimap-goal">
        <circle cx="${goalX}" cy="${goalY}" r="${cellSize * 0.4}" fill="#10b981" stroke="#34d399" stroke-width="1"/>
        <circle cx="${goalX}" cy="${goalY}" r="${cellSize * 0.7}" fill="none" stroke="#10b981" stroke-width="0.5" opacity="0.6"/>
      </g>
    `;

    // Box beacon
    const boxX = box.x * cellSize + cellSize / 2;
    const boxY = box.y * cellSize + cellSize / 2;
    const boxSvg = `
      <rect x="${boxX - cellSize * 0.3}" y="${boxY - cellSize * 0.3}" width="${cellSize * 0.6}" height="${cellSize * 0.6}" rx="1" fill="#f59e0b" stroke="#fbbf24" stroke-width="1"/>
    `;

    // Player beacon with radar pulse
    const playerX = player.x * cellSize + cellSize / 2;
    const playerY = player.y * cellSize + cellSize / 2;
    const playerSvg = `
      <g class="minimap-player">
        <circle cx="${playerX}" cy="${playerY}" r="${cellSize * 0.35}" fill="#38bdf8" stroke="#ffffff" stroke-width="1.5"/>
        <circle cx="${playerX}" cy="${playerY}" r="${cellSize * 0.6}" fill="none" stroke="#38bdf8" stroke-width="1" stroke-dasharray="2,2" class="radar-pulse"/>
      </g>
    `;

    return `
      <div class="minimap-wrapper" style="width:${this.mapWidth}px; height:${this.mapHeight}px; border-radius:8px; overflow:hidden; border:1px solid rgba(56, 189, 248, 0.3); background:#090d16;">
        <svg viewBox="0 0 ${this.mapWidth} ${this.mapHeight}" width="100%" height="100%">
          <defs>
            <radialGradient id="minimap-radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.1"/>
              <stop offset="100%" stop-color="#090d16" stop-opacity="0.8"/>
            </radialGradient>
          </defs>
          <g class="minimap-cells">${cellsSvg}</g>
          ${goalSvg}
          ${boxSvg}
          ${playerSvg}
        </svg>
      </div>
    `;
  }

  resetFog() {
    this.discoveredCells.clear();
  }
}
