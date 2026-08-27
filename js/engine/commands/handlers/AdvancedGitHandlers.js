/**
 * GitQuest Engine - Advanced Git Command Handlers
 * Handlers for branch, merge, rebase, stash, reset, cherry-pick, diff, log, fetch, tag.
 */

import { CommandExecutionResult } from '../../core/Types.js';
import { GameEvent } from '../../core/Constants.js';
import { EngineUtils } from '../../core/Utils.js';

export class BranchHandler {
  execute(parsed, context) {
    const branchName = parsed.getArg(0);
    const state = context.gameState;

    if (!branchName) {
      // List branches
      const current = state?.gitRepo?.currentBranch || `level-${state?.levelId || '07'}`;
      const branches = state?.gitRepo?.branches || [current, 'main'];
      const output = branches.map(b => (b === current ? `* ${b}` : `  ${b}`)).join('\n');
      context.log({ type: 'output', text: output });
      return CommandExecutionResult.ok({ command: 'git branch', output });
    }

    // Create new branch
    if (state?.gitRepo) {
      state.gitRepo.createBranch(branchName);
    }
    context.log({ type: 'output', text: `Created branch '${branchName}'` });
    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_BRANCH_CREATED, { branchName });
    }
    return CommandExecutionResult.ok({ command: `git branch ${branchName}`, branchName });
  }
}

export class MergeHandler {
  execute(parsed, context) {
    const targetBranch = parsed.getArg(0);
    if (!targetBranch) {
      context.logError('fatal: No branch specified to merge. Usage: git merge <branch>');
      return CommandExecutionResult.fail('missing_arg', 202, 'No branch specified.');
    }

    const state = context.gameState;
    const currentBranch = state?.gitRepo?.currentBranch || 'main';

    // Check for conflict node in world
    const hasConflict = context.entityManager
      ? context.entityManager.getByType('conflict_node').some(c => !c.isResolved)
      : false;

    if (hasConflict) {
      context.logError(`CONFLICT (content): Merge conflict in main.js\nAutomatic merge failed; fix conflicts and then commit the result.`);
      if (context.eventBus) {
        context.eventBus.emit(GameEvent.GIT_MERGE_CONFLICT, { targetBranch });
      }
      return CommandExecutionResult.fail('merge_conflict', 205, 'Merge conflict detected.');
    }

    context.log({
      type: 'output',
      text: `Updating ${currentBranch}..\nFast-forward merge with '${targetBranch}' complete.`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_MERGE_SUCCEEDED, { source: targetBranch, target: currentBranch });
    }

    return CommandExecutionResult.ok({ command: `git merge ${targetBranch}`, fastForward: true });
  }
}

export class RebaseHandler {
  execute(parsed, context) {
    const upstreamBranch = parsed.getArg(0);
    if (!upstreamBranch) {
      context.logError('fatal: No upstream branch specified for rebase. Usage: git rebase <upstream>');
      return CommandExecutionResult.fail('missing_arg', 202, 'No upstream branch.');
    }

    context.log({
      type: 'output',
      text: `First, rewinding head to replay your work on top of '${upstreamBranch}'...\nApplying commit patches... Done.`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_REBASE_COMPLETED, { upstream: upstreamBranch });
    }

    return CommandExecutionResult.ok({ command: `git rebase ${upstreamBranch}`, rebased: true });
  }
}

export class StashHandler {
  execute(parsed, context) {
    const sub = (parsed.getArg(0) || '').toLowerCase();
    const state = context.gameState;

    if (sub === 'pop') {
      if (state?.stashPayload) {
        state.stashPayload = null;
        context.log({ type: 'output', text: 'On branch main: Restored working tree changes from stash@{0}.' });
        if (context.eventBus) {
          context.eventBus.emit(GameEvent.GIT_STASH_POPPED, {});
        }
        return CommandExecutionResult.ok({ command: 'git stash pop', popped: true });
      } else {
        context.logError('error: No stash entries found.');
        return CommandExecutionResult.fail('no_stash', 203, 'No stash entries found.');
      }
    } else {
      // Stash current box
      if (state) {
        state.stashPayload = { x: state.box.x, y: state.box.y };
      }
      context.log({ type: 'output', text: 'Saved working directory and index state WIP on main: Stashed state.' });
      if (context.eventBus) {
        context.eventBus.emit(GameEvent.GIT_STASH_PUSHED, {});
      }
      return CommandExecutionResult.ok({ command: 'git stash', stashed: true });
    }
  }
}

export class CherryPickHandler {
  execute(parsed, context) {
    const commitHash = parsed.getArg(0);
    if (!commitHash) {
      context.logError('fatal: commit hash required. Usage: git cherry-pick <commit_hash>');
      return CommandExecutionResult.fail('missing_hash', 202, 'Missing commit hash.');
    }

    context.log({
      type: 'output',
      text: `[main ${commitHash.substring(0, 7)}] Cherry-picked commit successfully applied.`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_CHERRY_PICKED, { commitHash });
    }

    return CommandExecutionResult.ok({ command: `git cherry-pick ${commitHash}`, commitHash });
  }
}

export class DiffHandler {
  execute(parsed, context) {
    const state = context.gameState;
    const onGoal = state ? state.checkGoal() : false;
    const diffText = onGoal
      ? `diff --git a/payload.js b/payload.js\n--- a/payload.js\n+++ b/payload.js\n@@ -1 +1 @@\n-status: pending\n+status: aligned_on_goal`
      : `diff --git a/payload.js b/payload.js\n--- a/payload.js\n+++ b/payload.js\n@@ -1 +1 @@\n-status: dirty\n+status: navigating_corridor`;

    context.log({ type: 'output', text: diffText });
    return CommandExecutionResult.ok({ command: 'git diff', diff: diffText });
  }
}

export class LogHandler {
  execute(parsed, context) {
    const state = context.gameState;
    const commitHash = EngineUtils.generateGitHash(state?.levelId || '01');
    const logText = `* ${commitHash} (HEAD -> level-${state?.levelId || '07'})\n| Author: GitQuest Player <player@gitquest.dev>\n| Date:   ${new Date().toISOString()}\n|\n|     Solve checkpoint in ${state?.levelDef?.name || 'Level'}\n* e4a1b02 Foundations Initial Genesis`;

    context.log({ type: 'output', text: logText });
    return CommandExecutionResult.ok({ command: 'git log', log: logText });
  }
}
