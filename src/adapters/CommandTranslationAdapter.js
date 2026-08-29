/**
 * CommandTranslationAdapter
 * Sanitizes, validates, and routes player CLI commands to the existing engine command pipeline.
 * Formats command output responses for the terminal UI without modifying engine execution logic.
 */

export class CommandTranslationAdapter {
  /**
   * Normalize and clean raw input text
   * @param {string} rawInput
   * @returns {string}
   */
  static sanitize(rawInput) {
    if (typeof rawInput !== 'string') return '';
    return rawInput.trim().replace(/\s+/g, ' ');
  }

  /**
   * Check if a command is syntactically a Git command
   * @param {string} commandText
   * @returns {boolean}
   */
  static isGitCommand(commandText) {
    const sanitized = this.sanitize(commandText).toLowerCase();
    return sanitized.startsWith('git ') || sanitized === 'git';
  }

  /**
   * Parse token breakdown for autocomplete and syntax highlighting
   * @param {string} commandText
   * @returns {{verb: string, subcommand: string, args: string[], raw: string}}
   */
  static parseTokens(commandText) {
    const raw = this.sanitize(commandText);
    const parts = raw.split(' ');
    const verb = (parts[0] || '').toLowerCase();
    const subcommand = (parts[1] || '').toLowerCase();
    const args = parts.slice(2);

    return {
      verb,
      subcommand,
      args,
      raw
    };
  }

  /**
   * Execute command against the engine and transform output to frontend log entry
   * @param {Object} engine - The active engine instance
   * @param {string} rawCommand - Raw command string
   * @returns {{success: boolean, type: string, log: Object, rawResult: any}}
   */
  static dispatchCommand(engine, rawCommand) {
    const cleanCmd = this.sanitize(rawCommand);
    if (!cleanCmd) {
      return {
        success: false,
        type: 'empty',
        log: null,
        rawResult: null
      };
    }

    const tokens = this.parseTokens(cleanCmd);

    try {
      // Execute through engine's command pipeline or CLI
      let result;
      if (typeof engine.executeCommand === 'function') {
        result = engine.executeCommand(cleanCmd);
      } else if (typeof engine.execute === 'function') {
        result = engine.execute(cleanCmd);
      } else {
        throw new Error('Engine does not expose command execution capability.');
      }

      const logEntry = this.formatEngineResult(cleanCmd, tokens, result, engine);
      return {
        success: Boolean(result?.success !== false),
        type: logEntry.type,
        log: logEntry,
        rawResult: result
      };
    } catch (err) {
      return {
        success: false,
        type: 'error',
        log: {
          type: 'error',
          text: `fatal: ${err.message || 'Execution fault in command pipeline'}`,
          timestamp: Date.now()
        },
        rawResult: err
      };
    }
  }

  /**
   * Format raw engine return values into UI-renderable log objects
   * @param {string} command
   * @param {Object} tokens
   * @param {any} result
   * @param {Object} engine
   * @returns {Object}
   */
  static formatEngineResult(command, tokens, result, engine) {
    const baseLog = {
      command,
      timestamp: Date.now()
    };

    // If result is already structured
    if (result && typeof result === 'object') {
      if (tokens.subcommand === 'status' || result.type === 'status') {
        const branch = engine.gitRepo?.currentBranch || result.branch || 'main';
        const boxStatus = engine.isGoalReached ? 'STAGED ON TARGET (READY FOR COMMIT)' : 'MODIFIED IN WORKING TREE';
        const progress = `${engine.moves || 0} moves | ${engine.pushCount || 0} pushes`;

        return {
          ...baseLog,
          type: 'status',
          branch,
          objective: engine.levelDef?.objective || 'Deliver all repository assets to the staging branch.',
          boxStatus,
          progress,
          text: result.text || `On branch ${branch}\nChanges not staged for commit:\n  (use "git push" to update target)`
        };
      }

      if (tokens.subcommand === 'commit' || result.type === 'commit_success' || result.committed) {
        return {
          ...baseLog,
          type: 'commit_success',
          branch: engine.gitRepo?.currentBranch || 'main',
          commitHash: result.commitHash || Math.random().toString(16).substring(2, 9),
          message: result.message || 'feat(arena): reach target staging goal',
          filesChanged: '1 file changed, 1 insertion(+)',
          text: result.text || `[${engine.gitRepo?.currentBranch || 'main'}] Commit created successfully.`
        };
      }

      if (tokens.subcommand === 'push' || result.pushed) {
        return {
          ...baseLog,
          type: 'push',
          detail: 'Pushing local commits to remote origin...',
          result: result.onGoal ? 'To origin/main -> Object placed onto goal node!' : 'Everything up-to-date. Entity repositioned.',
          text: result.text || 'Push completed successfully.'
        };
      }

      if (tokens.subcommand === 'pull' || result.pulled) {
        return {
          ...baseLog,
          type: 'pull',
          detail: `Fast-forward pull from direction ${result.direction || 'adjacent'}`,
          result: result.onGoal ? 'Target moved to goal node.' : 'Merge made by the recursive strategy.',
          text: result.text || 'Pull completed successfully.'
        };
      }

      if (result.success === false || result.error) {
        return {
          ...baseLog,
          type: 'error',
          text: result.reason || result.error || 'Command rejected by engine state validation.'
        };
      }

      return {
        ...baseLog,
        type: 'output',
        text: String(result.text || result.message || JSON.stringify(result))
      };
    }

    return {
      ...baseLog,
      type: 'output',
      text: String(result || '')
    };
  }
}
