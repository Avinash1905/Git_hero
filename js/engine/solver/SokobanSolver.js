/**
 * GitQuest Engine - Sokoban State Space Solver
 * Automated BFS/IDA* puzzle solver finding optimal push/pull routes, par moves, and validation paths.
 */

import { Vector2D } from '../core/Types.js';
import { DeadlockDetector } from './DeadlockDetector.js';

export class SolverState {
  constructor(playerX, playerY, boxX, boxY, moves = 0, path = [], commands = []) {
    this.playerX = playerX;
    this.playerY = playerY;
    this.boxX = boxX;
    this.boxY = boxY;
    this.moves = moves;
    this.path = path;
    this.commands = commands;
  }

  get key() {
    return `${this.playerX},${this.playerY}|${this.boxX},${this.boxY}`;
  }
}

export class SokobanSolver {
  constructor(tileMap, maxStates = 50000) {
    this.tileMap = tileMap;
    this.maxStates = maxStates;
  }

  solve(playerSpawn, boxSpawn, goalCoord, options = {}) {
    const start = new SolverState(playerSpawn.x, playerSpawn.y, boxSpawn.x, boxSpawn.y, 0, [], []);
    const goal = Vector2D.from(goalCoord);
    const allowPull = options.allowPull !== false;

    const deadlockDetector = new DeadlockDetector(this.tileMap, [goal]);

    if (start.boxX === goal.x && start.boxY === goal.y) {
      return { solved: true, moves: 0, path: [], commands: [] };
    }

    const queue = [start];
    const visited = new Set([start.key]);

    const dirs = [
      { dx: 0, dy: -1, name: 'up', pullName: 'down' },
      { dx: 0, dy: 1, name: 'down', pullName: 'up' },
      { dx: -1, dy: 0, name: 'left', pullName: 'right' },
      { dx: 1, dy: 0, name: 'right', pullName: 'left' }
    ];

    let explored = 0;

    while (queue.length > 0 && explored < this.maxStates) {
      explored++;
      const current = queue.shift();

      if (current.boxX === goal.x && current.boxY === goal.y) {
        return {
          solved: true,
          moves: current.moves,
          path: current.path,
          commands: current.commands,
          exploredStates: explored
        };
      }

      // Try 4-way player movement & pushes
      for (const d of dirs) {
        const nextPx = current.playerX + d.dx;
        const nextPy = current.playerY + d.dy;

        if (this.tileMap.isWall(nextPx, nextPy)) continue;

        // 1. Moving into empty space
        if (nextPx !== current.boxX || nextPy !== current.boxY) {
          const nextState = new SolverState(
            nextPx,
            nextPy,
            current.boxX,
            current.boxY,
            current.moves + 1,
            [...current.path, { type: 'move', dir: d.name }],
            [...current.commands, `git ${d.name}`]
          );

          if (!visited.has(nextState.key)) {
            visited.add(nextState.key);
            queue.push(nextState);
          }
        } else {
          // 2. Pushing the box
          const nextBx = current.boxX + d.dx;
          const nextBy = current.boxY + d.dy;

          if (this.tileMap.isWall(nextBx, nextBy)) continue;

          // Deadlock pruning
          if (deadlockDetector.isDeadSquare(nextBx, nextBy)) continue;
          if (deadlockDetector.is2x2Freeze([], nextBx, nextBy)) continue;

          const nextState = new SolverState(
            nextPx,
            nextPy,
            nextBx,
            nextBy,
            current.moves + 1,
            [...current.path, { type: 'push', dir: d.name }],
            [...current.commands, `git ${d.name}`]
          );

          if (!visited.has(nextState.key)) {
            visited.add(nextState.key);
            queue.push(nextState);
          }
        }

        // 3. Directional Pull mechanic
        if (allowPull) {
          const pullTargetBx = current.playerX + d.dx;
          const pullTargetBy = current.playerY + d.dy;
          const backPx = current.playerX - d.dx;
          const backPy = current.playerY - d.dy;

          // If box is in direction d and backward player tile is open
          if (current.boxX === pullTargetBx && current.boxY === pullTargetBy) {
            if (!this.tileMap.isWall(backPx, backPy)) {
              const pulledBx = current.playerX;
              const pulledBy = current.playerY;

              if (!deadlockDetector.isDeadSquare(pulledBx, pulledBy) || (pulledBx === goal.x && pulledBy === goal.y)) {
                const nextState = new SolverState(
                  backPx,
                  backPy,
                  pulledBx,
                  pulledBy,
                  current.moves + 1,
                  [...current.path, { type: 'pull', dir: d.name }],
                  [...current.commands, `git pull ${d.name}`]
                );

                if (!visited.has(nextState.key)) {
                  visited.add(nextState.key);
                  queue.push(nextState);
                }
              }
            }
          }
        }
      }
    }

    return { solved: false, exploredStates: explored, reason: 'unsolvable_or_limit_reached' };
  }
}
