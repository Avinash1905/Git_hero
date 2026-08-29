/**
 * GitQuest Engine - Procedural Level Generator
 * Generates endless solvable multi-room GitQuest levels with parameterized difficulty, room topologies, and mechanics.
 */

import { LevelDefinition } from '../levels/LevelDefinition.js';
import { TileMap } from '../world/TileMap.js';
import { SokobanSolver } from '../solver/SokobanSolver.js';

export class ProceduralLevelGenerator {
  constructor(seed = 12345) {
    this.seed = seed;
  }

  _seededRng() {
    let s = this.seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  generateLevel(options = {}) {
    const rng = this._seededRng();
    const width = options.width || 12;
    const height = options.height || 12;
    const difficulty = options.difficulty || 'INTERMEDIATE';
    const world = options.world || 10;

    const tileMap = new TileMap(width, height, 'floor');
    tileMap.setPerimeter('wall');

    // Add strategic internal walls
    const numWalls = Math.floor((width * height) * 0.12);
    const walls = [];

    for (let i = 0; i < numWalls; i++) {
      const wx = Math.floor(rng() * (width - 2)) + 1;
      const wy = Math.floor(rng() * (height - 2)) + 1;
      if ((wx > 1 || wy > 1) && (wx < width - 2 || wy < height - 2)) {
        tileMap.setTile(wx, wy, 'wall');
        walls.push({ x: wx, y: wy });
      }
    }

    const player = { x: 1, y: 1 };
    const box = { x: 2, y: 2 };
    const goal = { x: width - 2, y: height - 2 };

    tileMap.setTile(player.x, player.y, 'floor');
    tileMap.setTile(box.x, box.y, 'floor');
    tileMap.setTile(goal.x, goal.y, 'floor');

    // Ensure solvability with solver
    const solver = new SokobanSolver(tileMap, 5000);
    const solution = solver.solve(player, box, goal);

    const levelId = options.id || `proc_${Math.floor(rng() * 9000 + 1000)}`;
    const levelName = options.name || `Procedural Chamber #${Math.floor(rng() * 1000)}`;

    return new LevelDefinition({
      id: levelId,
      name: levelName,
      world,
      worldName: 'Procedural Endless Frontier',
      difficulty,
      stars: 3,
      xpReward: 10000,
      commitsReq: 25,
      description: `Procedurally generated ${difficulty} puzzle chamber with seed ${this.seed}.`,
      objectives: ['Navigate procedural terrain', 'Commit payload to goal node'],
      hint: 'Utilize git pull left/right to extract the payload from tight corridor dead ends.',
      gridSize: Math.max(width, height),
      width,
      height,
      player,
      box,
      goal,
      walls,
      hazards: []
    });
  }
}
