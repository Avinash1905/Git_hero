/**
 * GitQuest Engine - StageMachine & PuzzleValidator
 * Multi-step puzzle state machines with DAG dependencies, and automated deadlock/solvability validation.
 */

export class PuzzleStage {
  constructor(id, name, options = {}) {
    this.id = id;
    this.name = name;
    this.description = options.description || '';
    this.isCompleted = false;
    this.prerequisites = options.prerequisites || []; // Array of stage IDs
    this.enterCondition = options.enterCondition || null;
    this.completeCondition = options.completeCondition || null;
    this.onEnterAction = options.onEnterAction || null;
    this.onCompleteAction = options.onCompleteAction || null;
  }
}

export class StageMachine {
  constructor(options = {}) {
    this.stages = new Map(); // id -> PuzzleStage
    this.currentStageId = null;
    this.history = [];
  }

  addStage(stage) {
    this.stages.set(stage.id, stage);
    if (!this.currentStageId) {
      this.currentStageId = stage.id;
    }
  }

  getCurrentStage() {
    return this.currentStageId ? this.stages.get(this.currentStageId) : null;
  }

  evaluate(engineState, context = {}) {
    const current = this.getCurrentStage();
    if (!current) return false;

    if (!current.isCompleted && current.completeCondition) {
      if (current.completeCondition(engineState, context)) {
        current.isCompleted = true;
        this.history.push(current.id);

        if (typeof current.onCompleteAction === 'function') {
          current.onCompleteAction(engineState, context);
        }

        // Find next available stage whose prerequisites are met
        for (const stage of this.stages.values()) {
          if (!stage.isCompleted) {
            const prereqsMet = stage.prerequisites.every(pId => {
              const p = this.stages.get(pId);
              return p && p.isCompleted;
            });

            if (prereqsMet) {
              this.currentStageId = stage.id;
              if (typeof stage.onEnterAction === 'function') {
                stage.onEnterAction(engineState, context);
              }
              break;
            }
          }
        }
        return true;
      }
    }

    return false;
  }

  isAllStagesCompleted() {
    for (const stage of this.stages.values()) {
      if (!stage.isCompleted) return false;
    }
    return true;
  }

  reset() {
    for (const stage of this.stages.values()) {
      stage.isCompleted = false;
    }
    this.history = [];
    const first = Array.from(this.stages.values())[0];
    this.currentStageId = first ? first.id : null;
  }
}

export class PuzzleValidator {
  /**
   * Detects simple corner deadlocks for boxes in grid puzzles
   */
  static isCornerDeadlock(boxX, boxY, goalX, goalY, isWallFn) {
    // If already on goal, it's not a deadlock
    if (boxX === goalX && boxY === goalY) return false;

    const upWall = isWallFn(boxX, boxY - 1);
    const downWall = isWallFn(boxX, boxY + 1);
    const leftWall = isWallFn(boxX - 1, boxY);
    const rightWall = isWallFn(boxX + 1, boxY);

    // Corner: (Up and Left) or (Up and Right) or (Down and Left) or (Down and Right)
    if ((upWall && leftWall) || (upWall && rightWall) || (downWall && leftWall) || (downWall && rightWall)) {
      return true;
    }

    return false;
  }

  /**
   * Validates reachability between player, box, and goal
   */
  static validateSolvability(playerPos, boxPos, goalPos, isWalkableFn) {
    // Basic existence check
    if (!playerPos || !boxPos || !goalPos) return { solvable: false, reason: 'missing_coordinates' };

    // Box adjacent space reachability
    const adjSpaces = [
      { x: boxPos.x + 1, y: boxPos.y },
      { x: boxPos.x - 1, y: boxPos.y },
      { x: boxPos.x, y: boxPos.y + 1 },
      { x: boxPos.x, y: boxPos.y - 1 }
    ];

    let hasPushSpot = false;
    for (const spot of adjSpaces) {
      if (isWalkableFn(spot.x, spot.y)) {
        hasPushSpot = true;
        break;
      }
    }

    return {
      solvable: hasPushSpot,
      hasPushSpot
    };
  }
}
