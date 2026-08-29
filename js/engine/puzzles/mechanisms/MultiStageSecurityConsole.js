/**
 * GitQuest Game Engine - Multi-Stage Security Console Mechanism
 * Simulates terminal access keycards, multi-step Git cryptographic signatures,
 * command sequence locks, and security mainframe overrides.
 */

import { Vector2D } from '../../core/MathUtils.js';
import { GameEvent } from '../../core/Constants.js';

export const SecurityStageStatus = {
  LOCKED: 'LOCKED',
  IN_PROGRESS: 'IN_PROGRESS',
  BYPASSED: 'BYPASSED',
  VERIFIED: 'VERIFIED',
  ALARM: 'ALARM'
};

export class SecurityStage {
  constructor(stageNumber, requiredCommand, requiredArg = null, requiredKeycard = null) {
    this.stageNumber = stageNumber;
    this.requiredCommand = requiredCommand.toLowerCase();
    this.requiredArg = requiredArg ? requiredArg.toLowerCase() : null;
    this.requiredKeycard = requiredKeycard;
    this.isSatisfied = false;
  }

  evaluate(commandStr, userKeycards = new Set()) {
    if (this.requiredKeycard && !userKeycards.has(this.requiredKeycard)) {
      return { success: false, reason: `Missing keycard: ${this.requiredKeycard}` };
    }

    const tokens = commandStr.trim().toLowerCase().split(/\s+/);
    const cmd = tokens[0] === 'git' ? `git ${tokens[1] || ''}` : tokens[0];

    if (cmd !== this.requiredCommand) {
      return { success: false, reason: `Invalid sequence. Expected: ${this.requiredCommand}` };
    }

    if (this.requiredArg) {
      const remaining = tokens.slice(2).join(' ');
      if (!remaining.includes(this.requiredArg)) {
        return { success: false, reason: `Missing argument. Expected: ${this.requiredArg}` };
      }
    }

    this.isSatisfied = true;
    return { success: true };
  }
}

export class MultiStageSecurityConsole {
  constructor(consoleId, position, stages = [], targetGateId = null, eventBus = null) {
    this.consoleId = consoleId;
    this.position = new Vector2D(position.x, position.y);
    this.stages = stages;
    this.currentStageIndex = 0;
    this.targetGateId = targetGateId;
    this.eventBus = eventBus;
    this.isUnlocked = false;
    this.alarmTriggered = false;
    this.keycardInventory = new Set();
  }

  addKeycard(keycardId) {
    this.keycardInventory.add(keycardId);
  }

  hasKeycard(keycardId) {
    return this.keycardInventory.has(keycardId);
  }

  get currentStage() {
    return this.currentStageIndex < this.stages.length
      ? this.stages[this.currentStageIndex]
      : null;
  }

  get progressPercentage() {
    if (this.stages.length === 0) return 100;
    return (this.currentStageIndex / this.stages.length) * 100;
  }

  submitCommand(commandStr) {
    if (this.isUnlocked) {
      return { success: true, message: 'Console already fully unlocked.' };
    }

    const stage = this.currentStage;
    if (!stage) {
      this.isUnlocked = true;
      return { success: true, message: 'All security stages cleared.' };
    }

    const result = stage.evaluate(commandStr, this.keycardInventory);
    if (result.success) {
      this.currentStageIndex++;
      if (this.currentStageIndex >= this.stages.length) {
        this.isUnlocked = true;
        if (this.eventBus) {
          this.eventBus.emit(GameEvent.DOOR_UNLOCKED, {
            consoleId: this.consoleId,
            gateId: this.targetGateId
          });
        }
        return {
          success: true,
          cleared: true,
          unlockedGate: this.targetGateId,
          message: `Security Console ${this.consoleId} fully unlocked! Mainframe gate open.`
        };
      } else {
        return {
          success: true,
          cleared: false,
          stageAdvanced: this.currentStageIndex,
          totalStages: this.stages.length,
          message: `Stage ${stage.stageNumber} verified. Proceed to stage ${this.currentStageIndex + 1}.`
        };
      }
    } else {
      return {
        success: false,
        reason: result.reason,
        currentStage: this.currentStageIndex + 1
      };
    }
  }

  exportState() {
    return {
      consoleId: this.consoleId,
      currentStageIndex: this.currentStageIndex,
      isUnlocked: this.isUnlocked,
      alarmTriggered: this.alarmTriggered,
      keycards: Array.from(this.keycardInventory)
    };
  }

  restoreState(state) {
    if (!state) return;
    this.currentStageIndex = state.currentStageIndex || 0;
    this.isUnlocked = !!state.isUnlocked;
    this.alarmTriggered = !!state.alarmTriggered;
    this.keycardInventory = new Set(state.keycards || []);
  }
}
