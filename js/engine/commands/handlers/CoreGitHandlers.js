/**
 * GitQuest Engine - Core Git Command Handlers
 * Handlers for git status, git push, git pull, git commit, git switch.
 */

import { CommandExecutionResult } from '../../core/Types.js';
import { GameEvent, Direction } from '../../core/Constants.js';
import { EngineUtils } from '../../core/Utils.js';

export class StatusHandler {
  execute(parsed, context) {
    const state = context.gameState;
    if (state) state.statusCount = (state.statusCount || 0) + 1;

    const onGoal = state ? state.checkGoal() : false;
    const branchName = state?.gitRepo?.currentBranch || `level-${state?.levelId || '07'}`;
    const desc = state?.levelDef?.description || 'Move the box to the goal';

    const boxStatus = onGoal ? 'ON GOAL (READY TO COMMIT)' : 'NOT ON GOAL';
    const progress = onGoal
      ? '100% (Changes staged)'
      : `${Math.min(90, Math.floor(((state?.moves || 0) * 12) + 20))}%`;

    context.logStatus(branchName, desc, boxStatus, progress);

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_STATUS_CHECKED, { onGoal, branchName });
    }

    return CommandExecutionResult.ok({
      command: 'git status',
      output: `On branch ${branchName}\nStatus: ${boxStatus}`,
      onGoal
    });
  }
}

export class PushHandler {
  execute(parsed, context) {
    const engine = context.gridEngine;
    if (!engine) {
      return CommandExecutionResult.fail('no_engine', 1, 'GridEngine not initialized.');
    }

    const res = engine.gitPush();
    if (res.success) {
      if (res.pushed) {
        context.log({
          type: 'push',
          detail: '→ Pushing box...',
          result: res.onGoal ? '✓ Box moved onto goal! Ready to commit.' : '✓ Box moved'
        });
      } else {
        context.log({
          type: 'push',
          detail: '→ Player moved forward',
          result: '✓ Position synced'
        });
      }
      return CommandExecutionResult.ok({
        command: 'git push',
        pushed: res.pushed,
        onGoal: res.onGoal
      });
    } else {
      const errText = res.reason === 'blocked_box'
        ? 'fatal: Push rejected. Path blocked by firewall or obstacle.'
        : 'fatal: Cannot push into perimeter wall.';
      context.logError(errText);
      return CommandExecutionResult.fail(res.reason, 105, errText);
    }
  }
}

export class PullHandler {
  execute(parsed, context) {
    const engine = context.gridEngine;
    if (!engine) {
      return CommandExecutionResult.fail('no_engine', 1, 'GridEngine not initialized.');
    }

    const dirArg = (parsed.getArg(0) || '').toLowerCase();
    const dirMap = {
      left: 'to the left',
      right: 'to the right',
      up: 'upward',
      down: 'downward'
    };

    const res = dirArg ? engine.pullDirection(dirArg) : engine.gitPull();

    if (res.success) {
      const dirDesc = dirMap[res.direction] || 'toward player';
      context.log({
        type: 'pull',
        detail: `Pulling payload ${dirDesc}...`,
        result: res.onGoal ? `✓ Pulled object ${dirDesc}. Payload on goal!` : `✓ Pulled object ${dirDesc}.`
      });
      return CommandExecutionResult.ok({
        command: `git pull ${dirArg}`.trim(),
        pulled: true,
        direction: res.direction,
        onGoal: res.onGoal
      });
    } else {
      const errText = res.reason === 'obstructed_pull_path'
        ? '✕ Pull blocked. Path obstructed by wall or perimeter boundary.'
        : '✕ Nothing to pull in that direction.';
      context.logError(errText);
      return CommandExecutionResult.fail(res.reason, 106, errText);
    }
  }
}

export class CommitHandler {
  execute(parsed, context) {
    const state = context.gameState;
    const onGoal = state ? state.checkGoal() : false;

    if (onGoal) {
      const commitHash = EngineUtils.generateGitHash(state?.levelId || '01');
      const branch = state?.gitRepo?.currentBranch || `level-${state?.levelId || '07'}`;
      const msg = parsed.getFlag('-m') || `Solve level ${state?.levelId || '07'}: ${state?.levelDef?.name || 'Solved'}`;

      context.log({
        type: 'commit_success',
        commitHash,
        branch,
        message: msg,
        filesChanged: '1 file changed, 1 insertion(+)'
      });

      if (state) state.isCommitted = true;

      if (context.eventBus) {
        context.eventBus.emit(GameEvent.GIT_COMMIT_EXECUTED, { commitHash, branch, message: msg });
        context.eventBus.emit(GameEvent.LEVEL_COMPLETED, { levelId: state?.levelId });
      }

      return CommandExecutionResult.ok({
        command: 'git commit',
        commitHash,
        branch,
        message: msg,
        levelComplete: true
      });
    } else {
      const errText = `error: cannot commit. Working tree dirty:\n  Box is NOT ON GOAL. Move payload to goal node first.`;
      context.logError(errText);
      return CommandExecutionResult.fail('dirty_tree', 204, errText);
    }
  }
}

export class SwitchHandler {
  execute(parsed, context) {
    const targetLvl = parsed.getArg(0);
    if (!targetLvl) {
      context.logError('fatal: missing level argument. Usage: git switch <level_id>');
      return CommandExecutionResult.fail('missing_arg', 202, 'Missing level argument.');
    }

    const normLvl = String(targetLvl).padStart(2, '0');
    context.log({
      type: 'output',
      text: `Switched to branch 'level-${normLvl}'`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_SWITCH_EXECUTED, { targetLevel: normLvl });
    }

    return CommandExecutionResult.ok({
      command: `git switch ${normLvl}`,
      switchedLevel: normLvl
    });
  }
}
