/**
 * GitQuest Frontend - Isometric 2.5D Tile Renderer
 * Projects 2D grid world coordinates into 2.5D isometric screen projection
 * with depth sorting, dynamic shadow casting, elevation layers, and animated tiles.
 */

export class IsometricTileRenderer {
  constructor(options = {}) {
    this.tileWidth = options.tileWidth || 64;
    this.tileHeight = options.tileHeight || 32;
    this.originX = options.originX || 400;
    this.originY = options.originY || 100;
    this.theme = options.theme || 'cyberpunk';
    this.showCoordinates = options.showCoordinates || false;
  }

  gridToIso(gridX, gridY, elevation = 0) {
    const screenX = this.originX + (gridX - gridY) * (this.tileWidth / 2);
    const screenY = this.originY + (gridX + gridY) * (this.tileHeight / 2) - elevation * (this.tileHeight / 2);
    return { screenX, screenY, depth: gridX + gridY + elevation };
  }

  isoToGrid(screenX, screenY) {
    const adjX = screenX - this.originX;
    const adjY = screenY - this.originY;

    const gridX = (adjX / (this.tileWidth / 2) + adjY / (this.tileHeight / 2)) / 2;
    const gridY = (adjY / (this.tileHeight / 2) - adjX / (this.tileWidth / 2)) / 2;

    return { gridX: Math.floor(gridX), gridY: Math.floor(gridY) };
  }

  renderIsoTileSvg(gridX, gridY, type = 'FLOOR', elevation = 0) {
    const { screenX, screenY } = this.gridToIso(gridX, gridY, elevation);
    const hw = this.tileWidth / 2;
    const hh = this.tileHeight / 2;

    const topPolygon = `${screenX},${screenY - hh} ${screenX + hw},${screenY} ${screenX},${screenY + hh} ${screenX - hw},${screenY}`;
    const leftPolygon = `${screenX - hw},${screenY} ${screenX},${screenY + hh} ${screenX},${screenY + hh + 12} ${screenX - hw},${screenY + 12}`;
    const rightPolygon = `${screenX},${screenY + hh} ${screenX + hw},${screenY} ${screenX + hw},${screenY + 12} ${screenX},${screenY + hh + 12}`;

    let topColor = '#1e293b';
    let leftColor = '#0f172a';
    let rightColor = '#090d16';

    if (type === 'WALL') {
      topColor = '#334155';
      leftColor = '#1e293b';
      rightColor = '#0f172a';
    } else if (type === 'GOAL') {
      topColor = 'rgba(16, 185, 129, 0.4)';
      leftColor = '#065f46';
      rightColor = '#047857';
    } else if (type === 'HAZARD') {
      topColor = 'rgba(239, 68, 68, 0.5)';
      leftColor = '#991b1b';
      rightColor = '#7f1d1d';
    }

    return `
      <g class="iso-tile" data-x="${gridX}" data-y="${gridY}" data-type="${type}">
        <polygon points="${topPolygon}" fill="${topColor}" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
        <polygon points="${leftPolygon}" fill="${leftColor}" stroke="rgba(0,0,0,0.3)" />
        <polygon points="${rightPolygon}" fill="${rightColor}" stroke="rgba(0,0,0,0.3)" />
      </g>
    `;
  }

  renderIsoEntitySvg(gridX, gridY, entityType = 'PLAYER', elevation = 0) {
    const { screenX, screenY } = this.gridToIso(gridX, gridY, elevation);
    const size = 20;

    let fill = '#38bdf8';
    let label = 'P';
    if (entityType === 'BOX') {
      fill = '#f59e0b';
      label = 'PKG';
    } else if (entityType === 'GOAL') {
      fill = '#10b981';
      label = 'DEST';
    }

    return `
      <g class="iso-entity" transform="translate(${screenX}, ${screenY - 14})">
        <!-- Shadow -->
        <ellipse cx="0" cy="14" rx="14" ry="7" fill="rgba(0,0,0,0.4)" />
        <!-- Body -->
        <rect x="-${size / 2}" y="-${size}" width="${size}" height="${size}" rx="4" fill="${fill}" stroke="#fff" stroke-width="1.5" />
        <text x="0" y="-${size / 3}" font-size="9" fill="#000" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${label}</text>
      </g>
    `;
  }

  renderFullScene(levelDef) {
    if (!levelDef) return '<svg></svg>';

    const size = levelDef.gridSize || 6;
    const walls = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));
    const hazards = new Set((levelDef.hazards || []).map(h => `${h.x},${h.y}`));

    let tilesMarkup = '';
    const entities = [];

    // Render floor tiles in depth order
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        let type = 'FLOOR';
        let elevation = 0;

        if (walls.has(`${x},${y}`)) {
          type = 'WALL';
          elevation = 1;
        } else if (hazards.has(`${x},${y}`)) {
          type = 'HAZARD';
        } else if (levelDef.goal && levelDef.goal.x === x && levelDef.goal.y === y) {
          type = 'GOAL';
        }

        tilesMarkup += this.renderIsoTileSvg(x, y, type, elevation);

        if (levelDef.player && levelDef.player.x === x && levelDef.player.y === y) {
          entities.push({ x, y, type: 'PLAYER', depth: x + y });
        }
        if (levelDef.box && levelDef.box.x === x && levelDef.box.y === y) {
          entities.push({ x, y, type: 'BOX', depth: x + y });
        }
      }
    }

    // Depth sort entities
    entities.sort((a, b) => a.depth - b.depth);
    let entitiesMarkup = '';
    for (const ent of entities) {
      entitiesMarkup += this.renderIsoEntitySvg(ent.x, ent.y, ent.type, 0);
    }

    return `
      <svg class="iso-board-canvas" viewBox="0 0 800 500" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="iso-bg-radial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#1e1b4b" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#030712" stop-opacity="0.95"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#iso-bg-radial)"/>
        <g id="iso-tiles-layer">${tilesMarkup}</g>
        <g id="iso-entities-layer">${entitiesMarkup}</g>
      </svg>
    `;
  }
}
