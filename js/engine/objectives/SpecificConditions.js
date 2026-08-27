/**
 * GitQuest Engine - Specific Condition Evaluators
 * Evaluates location triggers, command histories, box alignments, git states, and par metrics.
 */

import { Condition } from './Condition.js';
import { Vector2D } from '../core/Types.js';

export class LocationCondition extends Condition {
  constructor(targetCoord, options = {}) {
    super(options);
    this.targetCoord = Vector2D.from(targetCoord);
    this.targetRoomId = options.targetRoomId || null;
  }

  evaluate(engineState, context = {}) {
    const player = engineState?.player;
    if (!player) return false;

    if (this.targetRoomId && engineState.activeRoomId !== this.targetRoomId) {
      return false;
    }

    if (player.x === this.targetCoord.x && player.y === this.targetCoord.y) {
      this.isMet = true;
      return true;
    }

    return false;
  }
}

export class CommandCondition extends Condition {
  constructor(expectedCommand, options = {}) {
    super(options);
    this.expectedCommand = expectedCommand.trim().toLowerCase();
    this.minCount = options.minCount || 1;
    this.currentCount = 0;
  }

  evaluate(engineState, context = {}) {
    if (context.executedCommand) {
      const executed = String(context.executedCommand).trim().toLowerCase();
      if (executed === this.expectedCommand || executed.startsWith(this.expectedCommand)) {
        this.currentCount++;
      }
    }

    this.isMet = this.currentCount >= this.minCount;
    return this.isMet;
  }

  reset() {
    super.reset();
    this.currentCount = 0;
  }
}

export class EntityStateCondition extends Condition {
  constructor(entityId, expectedProperty, expectedValue, options = {}) {
    super(options);
    this.entityId = entityId;
    this.expectedProperty = expectedProperty;
    this.expectedValue = expectedValue;
  }

  evaluate(engineState, context = {}) {
    const entity = context.entityManager ? context.entityManager.get(this.entityId) : null;
    if (!entity) return false;

    const actual = entity[this.expectedProperty] ?? entity.properties?.[this.expectedProperty];
    this.isMet = actual === this.expectedValue;
    return this.isMet;
  }
}

export class BoxOnGoalCondition extends Condition {
  constructor(boxCoord = null, goalCoord = null, options = {}) {
    super(options);
    this.boxCoord = boxCoord ? Vector2D.from(boxCoord) : null;
    this.goalCoord = goalCoord ? Vector2D.from(goalCoord) : null;
  }

  evaluate(engineState, context = {}) {
    if (engineState?.checkGoal) {
      this.isMet = Boolean(engineState.checkGoal());
      return this.isMet;
    }
    if (engineState?.box && engineState?.goal) {
      this.isMet = engineState.box.x === engineState.goal.x && engineState.box.y === engineState.goal.y;
      return this.isMet;
    }
    return false;
  }
}

export class MultiBoxCondition extends Condition {
  constructor(targets = [], options = {}) {
    super(options);
    this.targets = targets; // Array<{ boxId, goalCoord: {x,y} }>
  }

  evaluate(engineState, context = {}) {
    if (!context.entityManager) return false;

    for (const target of this.targets) {
      const box = context.entityManager.get(target.boxId);
      if (!box) return false;
      if (box.position.x !== target.goalCoord.x || box.position.y !== target.goalCoord.y) {
        this.isMet = false;
        return false;
      }
    }

    this.isMet = true;
    return true;
  }
}

export class GitStateCondition extends Condition {
  constructor(predicateFn, options = {}) {
    super(options);
    this.predicateFn = predicateFn;
  }

  evaluate(engineState, context = {}) {
    if (typeof this.predicateFn === 'function') {
      this.isMet = Boolean(this.predicateFn(engineState, context));
      return this.isMet;
    }
    return false;
  }
}

export class MetricCondition extends Condition {
  constructor(metricName, maxLimit, options = {}) {
    super(options);
    this.metricName = metricName; // 'moves', 'commands', 'time'
    this.maxLimit = maxLimit;
  }

  evaluate(engineState, context = {}) {
    const val = engineState?.[this.metricName] ?? 0;
    this.isMet = val <= this.maxLimit;
    return this.isMet;
  }
}
