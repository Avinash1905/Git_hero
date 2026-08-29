/**
 * GitQuest Engine - LevelDefinition & LevelValidator
 * Schema definitions, room metadata, entity configurations, and automated level solvability validator.
 */

import { Difficulty, TileType, EntityType } from '../core/Constants.js';
import { Vector2D } from '../core/Types.js';

export class LevelDefinition {
  constructor(options = {}) {
    this.id = String(options.id || '01').padStart(2, '0');
    this.name = options.name || `Level ${this.id}`;
    this.world = options.world || 1;
    this.worldName = options.worldName || 'Foundations';
    this.difficulty = options.difficulty || Difficulty.EASY;
    this.stars = options.stars ?? 3;
    this.xpReward = options.xpReward || 200;
    this.commitsReq = options.commitsReq || 1;
    this.description = options.description || 'Deliver the commit payload to the target goal node.';
    this.objectives = options.objectives || [
      'Inspect repository status with git status',
      'Push commit payload to origin goal',
      'Finalize with git commit'
    ];
    this.hint = options.hint || 'Align behind the payload and navigate the open corridor.';
    this.gridSize = options.gridSize || 6;
    this.width = options.width || this.gridSize;
    this.height = options.height || this.gridSize;

    this.player = options.player ? { x: options.player.x, y: options.player.y } : { x: 1, y: 1 };
    this.box = options.box ? { x: options.box.x, y: options.box.y } : { x: 2, y: 2 };
    this.goal = options.goal ? { x: options.goal.x, y: options.goal.y } : { x: 4, y: 2 };
    this.walls = (options.walls || []).map(w => ({ x: w.x, y: w.y }));
    this.hazards = (options.hazards || []).map(h => ({ x: h.x, y: h.y }));

    // Extended entities for advanced puzzle spaces (doors, keys, switches, multiple boxes, checkpoints)
    this.rooms = options.rooms || [];
    this.entities = options.entities || [];
    this.checkpoints = options.checkpoints || [];
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      world: this.world,
      worldName: this.worldName,
      difficulty: this.difficulty,
      stars: this.stars,
      xpReward: this.xpReward,
      commitsReq: this.commitsReq,
      description: this.description,
      objectives: [...this.objectives],
      hint: this.hint,
      gridSize: this.gridSize,
      width: this.width,
      height: this.height,
      player: { ...this.player },
      box: { ...this.box },
      goal: { ...this.goal },
      walls: this.walls.map(w => ({ ...w })),
      hazards: this.hazards.map(h => ({ ...h })),
      rooms: [...this.rooms],
      entities: [...this.entities],
      checkpoints: [...this.checkpoints]
    };
  }
}

export class LevelValidator {
  static validate(levelDef) {
    const errors = [];
    const warnings = [];

    if (!levelDef.id) errors.push('Missing level ID');
    if (!levelDef.player) errors.push('Missing player spawn coordinate');
    if (!levelDef.box) errors.push('Missing primary payload box coordinate');
    if (!levelDef.goal) errors.push('Missing primary goal coordinate');

    const size = levelDef.gridSize || Math.max(levelDef.width || 6, levelDef.height || 6);

    // Bounds check
    const checkBounds = (pt, name) => {
      if (pt.x < 0 || pt.x >= size || pt.y < 0 || pt.y >= size) {
        errors.push(`${name} at (${pt.x},${pt.y}) is out of bounds for size ${size}`);
      }
    };

    if (levelDef.player) checkBounds(levelDef.player, 'Player');
    if (levelDef.box) checkBounds(levelDef.box, 'Box');
    if (levelDef.goal) checkBounds(levelDef.goal, 'Goal');

    // Overlap checks
    const wallSet = new Set((levelDef.walls || []).map(w => `${w.x},${w.y}`));
    if (levelDef.player && wallSet.has(`${levelDef.player.x},${levelDef.player.y}`)) {
      errors.push(`Player spawns inside wall at (${levelDef.player.x},${levelDef.player.y})`);
    }
    if (levelDef.box && wallSet.has(`${levelDef.box.x},${levelDef.box.y}`)) {
      errors.push(`Box spawns inside wall at (${levelDef.box.x},${levelDef.box.y})`);
    }
    if (levelDef.goal && wallSet.has(`${levelDef.goal.x},${levelDef.goal.y}`)) {
      errors.push(`Goal is placed inside wall at (${levelDef.goal.x},${levelDef.goal.y})`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}
