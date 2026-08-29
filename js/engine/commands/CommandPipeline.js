/**
 * GitQuest Engine - Command Context, Registry & Pipeline
 * Execution context, middleware pipeline, and dynamic command handler registry.
 */

import { CommandExecutionResult } from '../core/Types.js';
import { GameEvent } from '../core/Constants.js';
import { CommandParser } from './CommandParser.js';

export class CommandContext {
  constructor(options = {}) {
    this.engine = options.engine || null;
    this.gameState = options.gameState || null;
    this.gridEngine = options.gridEngine || null;
    this.world = options.world || null;
    this.entityManager = options.entityManager || null;
    this.eventBus = options.eventBus || null;
    this.player = options.player || null;
    this.parsedCommand = options.parsedCommand || null;
    this.outputLogs = [];
  }

  log(entry) {
    this.outputLogs.push(entry);
  }

  logError(text) {
    this.outputLogs.push({ type: 'error', text });
  }

  logStatus(branch, objective, boxStatus, progress) {
    this.outputLogs.push({
      type: 'status',
      branch,
      objective,
      boxStatus,
      progress
    });
  }
}

export class CommandRegistry {
  constructor() {
    this.handlers = new Map(); // key -> handler instance or function
  }

  _makeKey(keyword, subCommand = '') {
    return `${keyword.toLowerCase()}:${(subCommand || '').toLowerCase()}`;
  }

  register(keyword, subCommand, handler) {
    const key = this._makeKey(keyword, subCommand);
    this.handlers.set(key, handler);
  }

  get(keyword, subCommand = '') {
    const specificKey = this._makeKey(keyword, subCommand);
    if (this.handlers.has(specificKey)) {
      return this.handlers.get(specificKey);
    }
    // Fallback to top-level keyword handler
    const topKey = this._makeKey(keyword, '');
    return this.handlers.get(topKey) || null;
  }

  has(keyword, subCommand = '') {
    return Boolean(this.get(keyword, subCommand));
  }
}

export class CommandPipeline {
  constructor(registry = new CommandRegistry(), eventBus = null) {
    this.registry = registry;
    this.eventBus = eventBus;
    this.middlewares = [];
  }

  use(middlewareFn) {
    this.middlewares.push(middlewareFn);
    return this;
  }

  execute(rawCommand, context) {
    const parsed = CommandParser.parse(rawCommand);
    context.parsedCommand = parsed;

    if (!parsed.isValid) {
      context.logError(parsed.errorMessage || 'Invalid command syntax.');
      return CommandExecutionResult.fail('invalid_syntax', 201, parsed.errorMessage, {
        logs: context.outputLogs
      });
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.COMMAND_EXECUTED, {
        raw: rawCommand,
        parsed
      });
    }

    // Run middlewares
    for (const mw of this.middlewares) {
      const mwRes = mw(parsed, context);
      if (mwRes && !mwRes.success) {
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.COMMAND_FAILED, { command: rawCommand, reason: mwRes.reason });
        }
        return mwRes;
      }
    }

    const handler = this.registry.get(parsed.keyword, parsed.subCommand);
    if (!handler) {
      context.logError(`command not found: ${parsed.raw}. Type 'help' for available commands.`);
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.COMMAND_INVALID, { command: rawCommand });
      }
      return CommandExecutionResult.fail('unknown_command', 201, `Unknown command: ${parsed.raw}`, {
        logs: context.outputLogs
      });
    }

    try {
      const result = handler.execute(parsed, context);
      if (result.success && this.eventBus) {
        this.eventBus.emit(GameEvent.COMMAND_SUCCEEDED, { command: rawCommand, result });
      } else if (!result.success && this.eventBus) {
        this.eventBus.emit(GameEvent.COMMAND_FAILED, { command: rawCommand, result });
      }
      result.logs = [...context.outputLogs, ...(result.logs || [])];
      return result;
    } catch (err) {
      console.error('[CommandPipeline] Execution error:', err);
      context.logError(`fatal: internal execution error: ${err.message}`);
      return CommandExecutionResult.fail('engine_error', 500, err.message, {
        logs: context.outputLogs
      });
    }
  }
}
