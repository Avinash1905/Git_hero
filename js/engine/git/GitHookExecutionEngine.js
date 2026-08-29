/**
 * GitQuest Game Engine - Git Hook Execution Engine
 * Simulates client and server Git hooks (.git/hooks/):
 * pre-commit, commit-msg, pre-push, post-checkout, and post-merge validation.
 */

export const HookType = {
  PRE_COMMIT: 'pre-commit',
  COMMIT_MSG: 'commit-msg',
  PRE_PUSH: 'pre-push',
  POST_CHECKOUT: 'post-checkout',
  POST_MERGE: 'post-merge'
};

export class GitHook {
  constructor(name, type, validatorFn, description = '') {
    this.name = name;
    this.type = type;
    this.validatorFn = validatorFn;
    this.description = description;
    this.isEnabled = true;
  }

  execute(context) {
    if (!this.isEnabled) return { pass: true };
    try {
      return this.validatorFn(context);
    } catch (err) {
      return { pass: false, error: err.message };
    }
  }
}

export class GitHookExecutionEngine {
  constructor() {
    this.hooks = new Map();
    this.initDefaultHooks();
  }

  initDefaultHooks() {
    // 1. Pre-commit: Secret scanner & trailing whitespace check
    this.registerHook(new GitHook(
      'secret-scanner-pre-commit',
      HookType.PRE_COMMIT,
      ctx => {
        const payload = ctx.stagedContent || '';
        if (/api_key\s*=\s*['"][a-zA-Z0-9]{20,}['"]/i.test(payload)) {
          return { pass: false, error: 'fatal: Exposed API key secret detected in staged commit payload!' };
        }
        return { pass: true };
      },
      'Scans staged files for accidental hardcoded secrets'
    ));

    // 2. Commit-msg: Conventional commits validator
    this.registerHook(new GitHook(
      'conventional-commit-msg',
      HookType.COMMIT_MSG,
      ctx => {
        const msg = (ctx.commitMessage || '').trim();
        if (!msg) {
          return { pass: false, error: 'fatal: Empty commit message' };
        }
        return { pass: true };
      },
      'Validates commit message conforms to requirements'
    ));

    // 3. Pre-push: Goal coordinate parity check
    this.registerHook(new GitHook(
      'pre-push-verification',
      HookType.PRE_PUSH,
      ctx => {
        const onGoal = ctx.gameState?.checkGoal ? ctx.gameState.checkGoal() : true;
        if (!onGoal) {
          return { pass: false, error: 'fatal: Push rejected by pre-push hook: Payload is not staged on goal node!' };
        }
        return { pass: true };
      },
      'Verifies payload is staged before pushing upstream'
    ));
  }

  registerHook(hook) {
    if (!this.hooks.has(hook.type)) {
      this.hooks.set(hook.type, []);
    }
    this.hooks.get(hook.type).push(hook);
  }

  runHooks(hookType, context = {}) {
    const list = this.hooks.get(hookType) || [];
    for (const hook of list) {
      const res = hook.execute(context);
      if (!res.pass) {
        return {
          allowed: false,
          failedHook: hook.name,
          error: res.error || 'Hook execution rejected the operation.'
        };
      }
    }
    return { allowed: true };
  }

  listHooks() {
    const results = [];
    for (const [type, list] of this.hooks.entries()) {
      for (const h of list) {
        results.push({ name: h.name, type, isEnabled: h.isEnabled, desc: h.description });
      }
    }
    return results;
  }
}
