/**
 * GitQuest Engine - Dungeon & Procedural Puzzle Generator
 * Deterministic Binary Space Partitioning (BSP) generator producing solvable multi-room Git environments.
 */

import { TileMap } from './TileMap.js';
import { Room } from './Room.js';
import { BoundingBox, Vector2D } from '../core/Types.js';

class BSPNode {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = null;
    this.right = null;
    this.room = null;
  }

  isLeaf() {
    return !this.left && !this.right;
  }

  split(minSize = 6, rng) {
    if (!this.isLeaf()) return false;

    let splitHorizontal = rng() > 0.5;
    if (this.width > this.height && this.width / this.height >= 1.25) {
      splitHorizontal = false;
    } else if (this.height > this.width && this.height / this.width >= 1.25) {
      splitHorizontal = true;
    }

    const max = (splitHorizontal ? this.height : this.width) - minSize;
    if (max <= minSize) return false;

    const splitPos = Math.floor(rng() * (max - minSize + 1)) + minSize;

    if (splitHorizontal) {
      this.left = new BSPNode(this.x, this.y, this.width, splitPos);
      this.right = new BSPNode(this.x, this.y + splitPos, this.width, this.height - splitPos);
    } else {
      this.left = new BSPNode(this.x, this.y, splitPos, this.height);
      this.right = new BSPNode(this.x + splitPos, this.y, this.width - splitPos, this.height);
    }

    return true;
  }
}

export class DungeonGenerator {
  constructor(width = 24, height = 24, seed = 12345) {
    this.width = width;
    this.height = height;
    this.seed = seed;
  }

  _seededRng() {
    let s = this.seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  generate() {
    const rng = this._seededRng();
    const tileMap = new TileMap(this.width, this.height, 'wall');
    const root = new BSPNode(1, 1, this.width - 2, this.height - 2);

    const nodes = [root];
    for (let i = 0; i < 3; i++) {
      const len = nodes.length;
      for (let j = 0; j < len; j++) {
        const node = nodes[j];
        if (node.split(6, rng)) {
          nodes.push(node.left, node.right);
        }
      }
    }

    const leaves = [];
    const collectLeaves = (n) => {
      if (n.isLeaf()) leaves.push(n);
      else {
        if (n.left) collectLeaves(n.left);
        if (n.right) collectLeaves(n.right);
      }
    };
    collectLeaves(root);

    // Carve rooms in leaves
    const rooms = [];
    for (let idx = 0; idx < leaves.length; idx++) {
      const leaf = leaves[idx];
      const rw = Math.max(4, Math.floor(leaf.width * (0.7 + rng() * 0.2)));
      const rh = Math.max(4, Math.floor(leaf.height * (0.7 + rng() * 0.2)));
      const rx = leaf.x + Math.floor((leaf.width - rw) / 2);
      const ry = leaf.y + Math.floor((leaf.height - rh) / 2);

      tileMap.fillRect(rx, ry, rx + rw - 1, ry + rh - 1, 'floor');
      const room = new Room({
        id: `room_${idx}`,
        name: `Sector ${String.fromCharCode(65 + idx)}`,
        bounds: new BoundingBox(rx, ry, rx + rw - 1, ry + rh - 1),
        spawnPoint: { x: rx + 1, y: ry + 1 }
      });
      rooms.push(room);
      leaf.room = room;
    }

    // Connect adjacent rooms with corridors
    for (let i = 0; i < rooms.length - 1; i++) {
      const r1 = rooms[i];
      const r2 = rooms[i + 1];

      const c1x = Math.floor((r1.bounds.minX + r1.bounds.maxX) / 2);
      const c1y = Math.floor((r1.bounds.minY + r1.bounds.maxY) / 2);
      const c2x = Math.floor((r2.bounds.minX + r2.bounds.maxX) / 2);
      const c2y = Math.floor((r2.bounds.minY + r2.bounds.maxY) / 2);

      // Horizontal tunnel then vertical tunnel
      const startX = Math.min(c1x, c2x);
      const endX = Math.max(c1x, c2x);
      for (let x = startX; x <= endX; x++) {
        tileMap.setTile(x, c1y, 'floor');
      }

      const startY = Math.min(c1y, c2y);
      const endY = Math.max(c1y, c2y);
      for (let y = startY; y <= endY; y++) {
        tileMap.setTile(c2x, y, 'floor');
      }
    }

    return {
      tileMap,
      rooms,
      playerSpawn: rooms[0]?.spawnPoint || { x: 2, y: 2 },
      goalCoord: rooms[rooms.length - 1]?.spawnPoint || { x: this.width - 3, y: this.height - 3 }
    };
  }
}
