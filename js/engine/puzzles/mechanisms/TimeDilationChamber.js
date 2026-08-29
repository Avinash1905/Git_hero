/**
 * GitQuest Game Engine - Time Dilation Chamber Mechanism
 * Simulates temporal dilation anomalies, chronosphere zones,
 * state history recording crystals, and time-loop rewind barriers.
 */

import { Vector2D } from '../../core/MathUtils.js';
import { GameEvent } from '../../core/Constants.js';

export const DilationMode = {
  NORMAL: 1.0,
  FAST_FORWARD: 2.0,
  SLOW_MOTION: 0.5,
  STASIS: 0.0,
  REVERSE: -1.0
};

export class TimeChamberZone {
  constructor(id, bounds, mode = DilationMode.SLOW_MOTION, maxEchoSteps = 10) {
    this.id = id;
    this.bounds = {
      minX: bounds.minX,
      minY: bounds.minY,
      maxX: bounds.maxX,
      maxY: bounds.maxY
    };
    this.mode = mode;
    this.maxEchoSteps = maxEchoSteps;
    this.isActive = true;
    this.echoBuffer = []; // Recorded past states within zone
  }

  contains(pos) {
    return (
      pos.x >= this.bounds.minX &&
      pos.x <= this.bounds.maxX &&
      pos.y >= this.bounds.minY &&
      pos.y <= this.bounds.maxY
    );
  }

  recordSnapshot(snapshot) {
    if (!this.isActive) return;
    this.echoBuffer.push({ ...snapshot, timestamp: Date.now() });
    if (this.echoBuffer.length > this.maxEchoSteps) {
      this.echoBuffer.shift();
    }
  }

  getOldestSnapshot() {
    return this.echoBuffer.length > 0 ? this.echoBuffer[0] : null;
  }

  popRecentSnapshot() {
    return this.echoBuffer.pop() || null;
  }
}

export class TimeDilationChamber {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.chambers = new Map();
    this.temporalCrystals = new Map();
    this.timelineEchoes = [];
  }

  registerChamber(chamber) {
    this.chambers.set(chamber.id, chamber);
  }

  registerTemporalCrystal(crystalId, position, rewindCount = 3) {
    this.temporalCrystals.set(crystalId, {
      id: crystalId,
      position: new Vector2D(position.x, position.y),
      rewindCount,
      isHarvested: false
    });
  }

  getDilationAt(pos) {
    for (const chamber of this.chambers.values()) {
      if (chamber.isActive && chamber.contains(pos)) {
        return chamber.mode;
      }
    }
    return DilationMode.NORMAL;
  }

  step(playerPos, boxPos) {
    for (const chamber of this.chambers.values()) {
      if (chamber.isActive) {
        chamber.recordSnapshot({
          player: { x: playerPos.x, y: playerPos.y },
          box: { x: boxPos.x, y: boxPos.y }
        });
      }
    }
  }

  triggerCrystal(crystalId, currentGameState) {
    const crystal = this.temporalCrystals.get(crystalId);
    if (!crystal || crystal.isHarvested || crystal.rewindCount <= 0) {
      return null;
    }

    crystal.rewindCount--;
    if (crystal.rewindCount <= 0) {
      crystal.isHarvested = true;
    }

    if (this.eventBus) {
      this.eventBus.emit(GameEvent.OBJECTIVE_UPDATED, {
        crystalId,
        remainingRewinds: crystal.rewindCount
      });
    }

    // Return chronological rewind signal
    return {
      success: true,
      rewindSteps: 3,
      crystalId
    };
  }

  exportState() {
    return {
      chambers: Array.from(this.chambers.values()).map(c => ({
        id: c.id,
        isActive: c.isActive,
        mode: c.mode,
        echoBuffer: c.echoBuffer
      })),
      crystals: Array.from(this.temporalCrystals.values()).map(cr => ({
        id: cr.id,
        rewindCount: cr.rewindCount,
        isHarvested: cr.isHarvested
      }))
    };
  }

  restoreState(state) {
    if (!state) return;
    if (state.chambers) {
      for (const c of state.chambers) {
        const chamber = this.chambers.get(c.id);
        if (chamber) {
          chamber.isActive = c.isActive;
          chamber.mode = c.mode;
          chamber.echoBuffer = c.echoBuffer || [];
        }
      }
    }
    if (state.crystals) {
      for (const cr of state.crystals) {
        const crystal = this.temporalCrystals.get(cr.id);
        if (crystal) {
          crystal.rewindCount = cr.rewindCount;
          crystal.isHarvested = cr.isHarvested;
        }
      }
    }
  }
}
