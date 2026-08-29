/**
 * GitQuest Engine - Objective & ObjectiveManager
 * Multi-objective tracking, progress calculation, and dependency evaluation.
 */

import { ObjectiveStatus, GameEvent } from '../core/Constants.js';
import { AndCondition } from './Condition.js';

export class Objective {
  constructor(options = {}) {
    this.id = options.id || 'obj_default';
    this.title = options.title || options.description || 'Complete objective';
    this.description = options.description || this.title;
    this.status = options.status || ObjectiveStatus.PENDING;
    this.condition = options.condition || null;
    this.isOptional = Boolean(options.isOptional);
    this.xpReward = options.xpReward || 50;
    this.dependencies = options.dependencies || []; // Array of objective IDs that must complete first
    this.progressPercent = 0;
  }

  evaluate(engineState, context = {}) {
    if (this.status === ObjectiveStatus.COMPLETED) return true;

    // Check dependencies
    if (context.objectiveManager) {
      for (const depId of this.dependencies) {
        const dep = context.objectiveManager.get(depId);
        if (!dep || dep.status !== ObjectiveStatus.COMPLETED) {
          this.status = ObjectiveStatus.PENDING;
          return false;
        }
      }
    }

    if (this.status === ObjectiveStatus.PENDING) {
      this.status = ObjectiveStatus.ACTIVE;
    }

    if (!this.condition) return false;

    const met = this.condition.evaluate(engineState, context);
    if (met) {
      this.status = ObjectiveStatus.COMPLETED;
      this.progressPercent = 100;
      return true;
    }

    return false;
  }

  reset() {
    this.status = ObjectiveStatus.PENDING;
    this.progressPercent = 0;
    if (this.condition) this.condition.reset();
  }
}

export class ObjectiveManager {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.objectives = new Map(); // id -> Objective
    this.isAllRequiredComplete = false;
  }

  setEventBus(eventBus) {
    this.eventBus = eventBus;
  }

  add(objective) {
    if (!objective || !objective.id) return;
    this.objectives.set(objective.id, objective);
  }

  get(id) {
    return this.objectives.get(id) || null;
  }

  getAll() {
    return Array.from(this.objectives.values());
  }

  getRequired() {
    return this.getAll().filter(o => !o.isOptional);
  }

  getCompleted() {
    return this.getAll().filter(o => o.status === ObjectiveStatus.COMPLETED);
  }

  evaluateAll(engineState, context = {}) {
    const fullContext = { ...context, objectiveManager: this };
    let requiredCount = 0;
    let requiredDone = 0;

    for (const obj of this.objectives.values()) {
      const wasCompleted = obj.status === ObjectiveStatus.COMPLETED;
      const nowCompleted = obj.evaluate(engineState, fullContext);

      if (!obj.isOptional) {
        requiredCount++;
        if (nowCompleted) requiredDone++;
      }

      if (!wasCompleted && nowCompleted) {
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.OBJECTIVE_COMPLETED, {
            objectiveId: obj.id,
            title: obj.title,
            xpReward: obj.xpReward
          });
        }
      }
    }

    const allComplete = requiredCount > 0 && requiredDone === requiredCount;
    if (allComplete && !this.isAllRequiredComplete) {
      this.isAllRequiredComplete = true;
      if (this.eventBus) {
        this.eventBus.emit(GameEvent.STAGE_COMPLETED, {});
      }
    }

    return {
      allComplete,
      requiredCount,
      requiredDone,
      progressPercent: requiredCount > 0 ? Math.round((requiredDone / requiredCount) * 100) : 100
    };
  }

  reset() {
    for (const obj of this.objectives.values()) {
      obj.reset();
    }
    this.isAllRequiredComplete = false;
  }

  clear() {
    this.objectives.clear();
    this.isAllRequiredComplete = false;
  }
}
