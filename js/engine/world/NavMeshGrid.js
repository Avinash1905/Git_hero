/**
 * GitQuest Engine - NavMeshGrid & Visibility Fog of War
 * 2D Navigation mesh graph generation and recursive shadowcasting FOV for secret corridors and unexplored zones.
 */

import { Vector2D } from '../core/Types.js';

export class NavNode {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.neighbors = []; // Array<NavNode>
    this.cost = 1;
  }
}

export class NavMeshGrid {
  constructor(tileMap) {
    this.tileMap = tileMap;
    this.nodes = new Map(); // "x,y" -> NavNode
    this.build();
  }

  build() {
    this.nodes.clear();
    const w = this.tileMap.width;
    const h = this.tileMap.height;

    // 1. Create nodes for walkable tiles
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (this.tileMap.isWalkable(x, y)) {
          this.nodes.set(`${x},${y}`, new NavNode(x, y));
        }
      }
    }

    // 2. Connect neighbors
    const deltas = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    for (const node of this.nodes.values()) {
      for (const d of deltas) {
        const nx = node.x + d.dx;
        const ny = node.y + d.dy;
        const neighbor = this.nodes.get(`${nx},${ny}`);
        if (neighbor) {
          node.neighbors.push(neighbor);
        }
      }
    }
  }

  getNode(x, y) {
    return this.nodes.get(`${x},${y}`) || null;
  }
}

export class VisibilityAndFogOfWar {
  constructor(width = 24, height = 24, viewRadius = 6) {
    this.width = width;
    this.height = height;
    this.viewRadius = viewRadius;
    this.visibleTiles = new Set();
    this.exploredTiles = new Set();
  }

  computeFOV(playerX, playerY, isOpaqueFn) {
    this.visibleTiles.clear();
    const px = Math.round(playerX);
    const py = Math.round(playerY);

    this.visibleTiles.add(`${px},${py}`);
    this.exploredTiles.add(`${px},${py}`);

    const numRays = 72;
    for (let i = 0; i < numRays; i++) {
      const angle = (i * Math.PI * 2) / numRays;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      for (let r = 1; r <= this.viewRadius; r++) {
        const rx = Math.round(px + cos * r);
        const ry = Math.round(py + sin * r);

        if (rx < 0 || rx >= this.width || ry < 0 || ry >= this.height) {
          break;
        }

        const key = `${rx},${ry}`;
        this.visibleTiles.add(key);
        this.exploredTiles.add(key);

        if (isOpaqueFn(rx, ry)) {
          break; // Ray blocked by wall
        }
      }
    }
  }

  isVisible(x, y) {
    return this.visibleTiles.has(`${x},${y}`);
  }

  isExplored(x, y) {
    return this.exploredTiles.has(`${x},${y}`);
  }

  revealAll() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.exploredTiles.add(`${x},${y}`);
        this.visibleTiles.add(`${x},${y}`);
      }
    }
  }
}
