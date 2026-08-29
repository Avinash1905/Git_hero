/**
 * GitQuest Engine - Extended Git Command Handlers
 * Production handlers for git tag, git revert, git submodule, git worktree, git bundle, git blame.
 */

import { CommandExecutionResult } from '../../core/Types.js';
import { GameEvent } from '../../core/Constants.js';
import { EngineUtils } from '../../core/Utils.js';

export class TagHandler {
  execute(parsed, context) {
    const state = context.gameState;
    const tagName = parsed.getArg(0) || parsed.getFlag('-a');
    const isList = parsed.hasFlag('-l') || !tagName;

    if (isList) {
      const tags = state?.gitRepo?.tags || ['v1.0.0-foundations', 'v1.1.0-checkpoint'];
      const output = tags.join('\n');
      context.log({ type: 'output', text: output });
      return CommandExecutionResult.ok({ command: 'git tag', tags, output });
    }

    if (state?.gitRepo) {
      if (!state.gitRepo.tags) state.gitRepo.tags = [];
      state.gitRepo.tags.push(tagName);
    }

    context.log({
      type: 'output',
      text: `Created annotated tag '${tagName}' referencing commit ${EngineUtils.generateGitHash(state?.levelId || '01').substring(0, 7)}`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.OBJECTIVE_UPDATED, { tag: tagName });
    }

    return CommandExecutionResult.ok({ command: `git tag ${tagName}`, tag: tagName });
  }
}

export class RevertHandler {
  execute(parsed, context) {
    const targetHash = parsed.getArg(0);
    if (!targetHash) {
      context.logError('fatal: Commit hash required to revert. Usage: git revert <commit_hash>');
      return CommandExecutionResult.fail('missing_hash', 202, 'Missing commit hash.');
    }

    const state = context.gameState;
    const revertHash = EngineUtils.generateGitHash('rev_' + (state?.levelId || '01'));
    context.log({
      type: 'output',
      text: `[main ${revertHash.substring(0, 7)}] Revert "${targetHash.substring(0, 7)}"\n 1 file changed, 1 deletion(-)`
    });

    if (context.eventBus) {
      context.eventBus.emit(GameEvent.GIT_COMMIT_EXECUTED, { commitHash: revertHash, isRevert: true });
    }

    return CommandExecutionResult.ok({ command: `git revert ${targetHash}`, revertHash });
  }
}

export class SubmoduleHandler {
  execute(parsed, context) {
    const subAction = (parsed.getArg(0) || 'status').toLowerCase();
    const subPath = parsed.getArg(1);

    if (subAction === 'add') {
      if (!subPath) {
        context.logError('fatal: Repository URL required. Usage: git submodule add <url> [path]');
        return CommandExecutionResult.fail('missing_arg', 202, 'Missing repository URL.');
      }
      context.log({
        type: 'output',
        text: `Cloning into 'vendor/modules/${subPath}'...\nSubmodule '${subPath}' registered in .gitmodules.`
      });
      return CommandExecutionResult.ok({ command: `git submodule add ${subPath}`, submoduleAdded: subPath });
    } else if (subAction === 'update') {
      context.log({
        type: 'output',
        text: `Submodule path 'vendor/modules': checked out commit ${EngineUtils.generateGitHash('sub').substring(0, 7)}`
      });
      return CommandExecutionResult.ok({ command: 'git submodule update', updated: true });
    } else {
      context.log({
        type: 'output',
        text: ` ${EngineUtils.generateGitHash('sub0').substring(0, 7)} vendor/kernel (heads/main)`
      });
      return CommandExecutionResult.ok({ command: 'git submodule status', status: 'clean' });
    }
  }
}

export class WorktreeHandler {
  execute(parsed, context) {
    const subAction = (parsed.getArg(0) || 'list').toLowerCase();
    const treePath = parsed.getArg(1);

    if (subAction === 'add') {
      if (!treePath) {
        context.logError('fatal: Target path required. Usage: git worktree add <path> [branch]');
        return CommandExecutionResult.fail('missing_arg', 202, 'Missing path.');
      }
      context.log({
        type: 'output',
        text: `Preparing worktree (checking out branch 'feat-${treePath}')\nHEAD is now at ${EngineUtils.generateGitHash('wt').substring(0, 7)}`
      });
      return CommandExecutionResult.ok({ command: `git worktree add ${treePath}`, worktree: treePath });
    } else {
      const state = context.gameState;
      const currentBranch = state?.gitRepo?.currentBranch || 'main';
      const output = `/workspace/gitquest        ${EngineUtils.generateGitHash('main').substring(0, 7)} [${currentBranch}]`;
      context.log({ type: 'output', text: output });
      return CommandExecutionResult.ok({ command: 'git worktree list', output });
    }
  }
}

export class BundleHandler {
  execute(parsed, context) {
    const subAction = (parsed.getArg(0) || 'create').toLowerCase();
    const filename = parsed.getArg(1) || 'backup.bundle';

    if (subAction === 'verify') {
      context.log({
        type: 'output',
        text: `The bundle contains these 3 ref(s):\n${EngineUtils.generateGitHash('bnd1')} refs/heads/main\n${filename} is verified.`
      });
      return CommandExecutionResult.ok({ command: `git bundle verify ${filename}`, verified: true });
    } else {
      context.log({
        type: 'output',
        text: `Enumerating objects: 12, done.\nWriting bundle: 100% (12/12), 4.2 KiB | 4.2 MiB/s, done.\nBundle stored at ${filename}`
      });
      return CommandExecutionResult.ok({ command: `git bundle create ${filename}`, filename });
    }
  }
}

export class BlameHandler {
  execute(parsed, context) {
    const file = parsed.getArg(0) || 'main.js';
    const output = `
^e4a1b02 (Linus 2026-01-01 10:00:00 +0000 1) // GitQuest Mission Objective
c891f03 (Hero  2026-08-28 08:30:15 +0000 2) export const payloadStatus = 'READY';
4b2a8d1 (Agent 2026-08-28 08:45:00 +0000 3) export function executeCommit() { return true; }
`.trim();

    context.log({ type: 'output', text: output });
    return CommandExecutionResult.ok({ command: `git blame ${file}`, output });
  }
}
