/**
 * GitQuest Engine - Hierarchical Pathfinding (HPA*) & Flow Field Vectors
 * Instantaneous cluster-based navigation and Dijkstra vector flow fields for large-scale multi-agent simulation.
 */

import { Vector2D } from '../core/Types.js';

export class FlowFieldCell {
  constructor(x, y, cost = 1) {
    this.x = x;
    this.y = y;
    this.cost = cost;
    this.distance = Infinity;
    this.vector = { dx: 0, dy: 0 };
  }
}

export class FlowFieldPathfinder {
  constructor(tileMap) {
    this.tileMap = tileMap;
    this.grid = new Map(); // "x,y" -> FlowFieldCell
    this._initGrid();
  }

  _initGrid() {
    for (let y = 0; y < this.tileMap.height; y++) {
      for (let x = 0; x < this.tileMap.width; x++) {
        const isWall = this.tileMap.isWall(x, y);
        this.grid.set(`${x},${y}`, new FlowFieldCell(x, y, isWall ? 255 : 1));
      }
    }
  }

  generateField(targetCoord) {
    // 1. Reset distances
    for (const cell of this.grid.values()) {
      cell.distance = Infinity;
      cell.vector = { dx: 0, dy: 0 };
    }

    // 2. Dijkstra BFS from target
    const startCell = this.grid.get(`${targetCoord.x},${targetCoord.y}`);
    if (!startCell) return;
    startCell.distance = 0;

    const queue = [startCell];
    const deltas = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 }
    ];

    while (queue.length > 0) {
      const curr = queue.shift();

      for (const d of deltas) {
        const nx = curr.x + d.dx;
        const ny = curr.y + d.dy;
        const neighbor = this.grid.get(`${nx},${ny}`);

        if (neighbor && neighbor.cost < 255) {
          const newDist = curr.distance + neighbor.cost;
          if (newDist < neighbor.distance) {
            neighbor.distance = newDist;
            queue.push(neighbor);
          }
        }
      }
    }

    // 3. Compute vector field pointing toward lowest distance neighbor
    for (const cell of this.grid.values()) {
      if (cell.cost === 255 || cell.distance === 0) continue;

      let lowestDist = cell.distance;
      let bestDir = { dx: 0, dy: 0 };

      for (const d of deltas) {
        const neighbor = this.grid.get(`${cell.x + d.dx},${cell.y + d.dy}`);
        if (neighbor && neighbor.distance < lowestDist) {
          lowestDist = neighbor.distance;
          bestDir = { dx: d.dx, dy: d.dy };
        }
      }

      cell.vector = bestDir;
    }
  }

  getVectorAt(x, y) {
    return this.grid.get(`${x},${y}`)?.vector || { dx: 0, dy: 0 };
  }
}

export class HierarchicalCluster {
  constructor(clusterId, minX, minY, size = 6) {
    this.clusterId = clusterId;
    this.minX = minX;
    this.minY = minY;
    this.size = size;
    this.maxX = minX + size - 1;
    this.maxY = minY + size - 1;
    this.portals = []; // Array<{ x, y, toClusterId }>
  }

  contains(x, y) {
    return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
  }
}

export class HierarchicalPathFinder {
  constructor(tileMap, clusterSize = 6) {
    this.tileMap = tileMap;
    this.clusterSize = clusterSize;
    this.clusters = new Map(); // id -> HierarchicalCluster
    this._buildClusters();
  }

  _buildClusters() {
    const numX = Math.ceil(this.tileMap.width / this.clusterSize);
    const numY = Math.ceil(this.tileMap.height / this.clusterSize);

    for (let cy = 0; cy < numY; cy++) {
      for (let cx = 0; cx < numX; cx++) {
        const id = `c_${cx}_${cy}`;
        const cluster = new HierarchicalCluster(id, cx * this.clusterSize, cy * this.clusterSize, this.clusterSize);
        this.clusters.set(id, cluster);
      }
    }
  }

  getClusterAt(x, y) {
    for (const c of this.clusters.values()) {
      if (c.contains(x, y)) return c;
    }
    return null;
  }
}
