/**
 * GitQuest Engine - Dynamic Hint Generator
 * Analyzes live player state against optimal solver trajectory to generate context-aware hints.
 */

import { SokobanSolver } from './SokobanSolver.js';
import { Vector2D } from '../core/Types.js';

export class HintGenerator {
  constructor(tileMap) {
    this.tileMap = tileMap;
    this.solver = new SokobanSolver(tileMap, 20000);
  }

  generateHint(playerCoord, boxCoord, goalCoord) {
    const p = Vector2D.from(playerCoord);
    const b = Vector2D.from(boxCoord);
    const g = Vector2D.from(goalCoord);

    if (b.x === g.x && b.y === g.y) {
      return {
        type: 'commit',
        hint: 'Payload is already on goal! Type git commit to finalize and complete the level.',
        recommendedCommand: 'git commit'
      };
    }

    const solution = this.solver.solve(p, b, g);
    if (!solution.solved || solution.commands.length === 0) {
      return {
        type: 'general',
        hint: 'Look for open bypass corridors to maneuver behind the payload without pushing it into a wall corner.',
        recommendedCommand: 'git status'
      };
    }

    const nextCmd = solution.commands[0];
    const nextAction = solution.path[0];

    let actionDesc = '';
    if (nextAction.type === 'push') {
      actionDesc = `Push the payload ${nextAction.dir}ward toward the open lane.`;
    } else if (nextAction.type === 'pull') {
      actionDesc = `Execute git pull ${nextAction.dir} to drag the payload out of the dead end.`;
    } else {
      actionDesc = `Step ${nextAction.dir} to reposition yourself for the next maneuver.`;
    }

    return {
      type: 'step',
      hint: actionDesc,
      recommendedCommand: nextCmd,
      stepsRemaining: solution.moves
    };
  }
}
