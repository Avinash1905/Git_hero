/**
 * GitQuest Game Engine - Multi-Stage Objective Engine
 * Evaluates multi-phase level goals, conditional objectives,
 * move par rating scoring, secret bonus triggers, and star rewards.
 */

import { GameEvent } from '../core/Constants.js';

export const ObjectiveType = {
  REACH_GOAL: 'REACH_GOAL',
  COMMIT_PAYLOAD: 'COMMIT_PAYLOAD',
  MOVE_PAR: 'MOVE_PAR',
  TRIGGER_SWITCH: 'TRIGGER_SWITCH',
  COLLECT_KEYCARDS: 'COLLECT_KEYCARDS',
  NO_HAZARD_DAMAGE: 'NO_HAZARD_DAMAGE',
  BRANCH_MATCH: 'BRANCH_MATCH',
  TIME_LIMIT: 'TIME_LIMIT'
};

export class StageObjective {
  constructor(id, title, type = ObjectiveType.REACH_GOAL, target = {}, isOptional = false) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.target = target;
    this.isOptional = isOptional;
    this.isCompleted = false;
    this.progress = 0;
    this.maxProgress = target.count || 1;
  }

  evaluate(gameState) {
    if (this.isCompleted) return true;

    switch (this.type) {
      case ObjectiveType.REACH_GOAL: {
        const onGoal = gameState.checkGoal ? gameState.checkGoal() : false;
        this.isCompleted = onGoal;
        break;
      }
      case ObjectiveType.COMMIT_PAYLOAD: {
        this.isCompleted = Boolean(gameState.isCommitted);
        break;
      }
      case ObjectiveType.MOVE_PAR: {
        const moves = gameState.moves || 0;
        const maxMoves = this.target.maxMoves || 20;
        this.isCompleted = moves <= maxMoves && Boolean(gameState.isCommitted);
        break;
      }
      case ObjectiveType.TRIGGER_SWITCH: {
        const swCount = gameState.activatedSwitches ? gameState.activatedSwitches.size : 0;
        this.progress = swCount;
        this.isCompleted = this.progress >= this.maxProgress;
        break;
      }
      case ObjectiveType.COLLECT_KEYCARDS: {
        const keycardCount = gameState.collectedKeycards ? gameState.collectedKeycards.size : 0;
        this.progress = keycardCount;
        this.isCompleted = this.progress >= this.maxProgress;
        break;
      }
      case ObjectiveType.BRANCH_MATCH: {
        const curBranch = gameState.gitRepo?.currentBranch || '';
        this.isCompleted = curBranch === this.target.expectedBranch;
        break;
      }
      case ObjectiveType.NO_HAZARD_DAMAGE: {
        const damageTaken = gameState.hazardHits || 0;
        this.isCompleted = damageTaken === 0 && Boolean(gameState.isCommitted);
        break;
      }
    }

    return this.isCompleted;
  }
}

export class MultiStageObjectiveEngine {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.objectives = new Map();
    this.activeStage = 1;
    this.maxStages = 3;
    this.completedCount = 0;
  }

  registerObjective(obj) {
    this.objectives.set(obj.id, obj);
  }

  evaluateAll(gameState) {
    let allRequiredDone = true;
    let newlyCompleted = [];

    for (const obj of this.objectives.values()) {
      const wasDone = obj.isCompleted;
      const isDone = obj.evaluate(gameState);

      if (!wasDone && isDone) {
        newlyCompleted.push(obj);
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.OBJECTIVE_COMPLETED, {
            objectiveId: obj.id,
            title: obj.title
          });
        }
      }

      if (!obj.isOptional && !isDone) {
        allRequiredDone = false;
      }
    }

    return {
      allRequiredDone,
      completedObjectives: Array.from(this.objectives.values()).filter(o => o.isCompleted),
      pendingObjectives: Array.from(this.objectives.values()).filter(o => !o.isCompleted),
      newlyCompleted
    };
  }

  calculateStarRating(gameState, levelDef) {
    let stars = 1; // 1 star for basic completion
    if (!gameState.isCommitted) return 0;

    const parMoves = levelDef.parMoves || (levelDef.gridSize * 3);
    if ((gameState.moves || 0) <= parMoves) {
      stars++;
    }

    // Check optional objectives
    const optionalCompleted = Array.from(this.objectives.values())
      .filter(o => o.isOptional && o.isCompleted).length;

    if (optionalCompleted > 0 || (gameState.moves || 0) <= Math.floor(parMoves * 0.75)) {
      stars++;
    }

    return Math.min(3, stars);
  }

  clear() {
    this.objectives.clear();
    this.activeStage = 1;
  }
}
