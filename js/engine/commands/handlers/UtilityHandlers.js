/**
 * GitQuest Engine - Movement & Utility Command Handlers
 * Handlers for git left/right/up/down, clear, help, inspect, hint, undo.
 */

import { CommandExecutionResult } from '../../core/Types.js';
import { GameEvent } from '../../core/Constants.js';

export class MovementHandler {
  constructor(direction) {
    this.direction = direction;
  }

  execute(parsed, context) {
    const engine = context.gridEngine;
    if (!engine) {
      return CommandExecutionResult.fail('no_engine', 1, 'GridEngine not initialized.');
    }

    const res = engine.moveDirection(this.direction);
    if (res.success) {
      context.log({
        type: 'movement',
        detail: `Moving player ${this.direction}...`,
        result: `✓ Player moved ${this.direction}.`
      });
      return CommandExecutionResult.ok({
        command: `git ${this.direction}`,
        direction: this.direction,
        pushed: res.pushed,
        onGoal: res.onGoal
      });
    } else {
      context.logError('✕ Movement blocked\nObstacle detected.');
      return CommandExecutionResult.fail(res.reason, 101, 'Movement blocked.');
    }
  }
}

export class HelpHandler {
  execute(parsed, context) {
    const helpText = `GitQuest Supported Commands:
  git left            - Move player left
  git right           - Move player right
  git up              - Move player up
  git down            - Move player down
  git push            - Push the payload box forward
  git pull            - Pull the payload box toward player
  git pull left       - Pull object on the left toward player
  git pull right      - Pull object on the right toward player
  git pull up         - Pull object above toward player
  git pull down       - Pull object below toward player
  git status          - Check current branch, stage status & objective
  git commit          - Commit and finalize solved level
  git switch <lvl>    - Switch to another level (e.g. git switch 08)
  git branch <name>   - Create or switch to branch
  git merge <branch>  - Merge specified branch into HEAD
  git rebase <branch> - Rebase current branch onto target
  git stash           - Temporarily stash active payload
  git stash pop       - Restore stashed payload
  git cherry-pick <h> - Cherry pick commit node
  git diff            - Inspect changes in working tree
  git log             - View commit history tree
  undo                - Undo previous movement or push
  clear               - Clear terminal screen`;

    context.log({ type: 'output', text: helpText });
    return CommandExecutionResult.ok({ command: 'help', output: helpText });
  }
}

export class ClearHandler {
  execute(parsed, context) {
    context.outputLogs = [];
    return CommandExecutionResult.ok({ command: 'clear', cleared: true });
  }
}

export class UndoHandler {
  execute(parsed, context) {
    const engine = context.gridEngine;
    if (!engine) {
      return CommandExecutionResult.fail('no_engine', 1, 'GridEngine not initialized.');
    }

    const res = engine.undo();
    if (res) {
      context.log({ type: 'output', text: '← Reverted to previous game state.' });
      return CommandExecutionResult.ok({ command: 'undo', undone: true });
    } else {
      context.logError('No previous state to undo.');
      return CommandExecutionResult.fail('no_history', 301, 'No previous state in history.');
    }
  }
}

export class HintHandler {
  execute(parsed, context) {
    const state = context.gameState;
    const hint = state?.levelDef?.hint || 'Analyze the corridor and position yourself behind the payload.';
    context.log({ type: 'output', text: `💡 Hint: ${hint}` });
    return CommandExecutionResult.ok({ command: 'hint', hint });
  }
}
