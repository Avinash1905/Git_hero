/**
 * GhostTelemetryRecorder
 * Frame-accurate telemetry recording engine capturing player inputs,
 * position coordinates, time offsets, and branch states for ghost sharing.
 */

export class GhostTelemetryRecorder {
  constructor() {
    this.isRecording = false;
    this.startTime = 0;
    this.events = [];
  }

  startRecording(levelId) {
    this.isRecording = true;
    this.startTime = Date.now();
    this.levelId = levelId;
    this.events = [];
  }

  recordTick(playerPos, currentBranch, action = 'move') {
    if (!this.isRecording) return;
    const timeOffset = Date.now() - this.startTime;
    this.events.push({
      t: timeOffset,
      x: playerPos.x,
      y: playerPos.y,
      b: currentBranch,
      a: action
    });
  }

  stopRecording(isVictory = false) {
    this.isRecording = false;
    const totalDuration = (Date.now() - this.startTime) / 1000;
    return {
      levelId: this.levelId,
      isVictory,
      durationSeconds: Math.round(totalDuration * 10) / 10,
      totalEvents: this.events.length,
      telemetry: this.events
    };
  }
}

export const ghostTelemetryRecorder = new GhostTelemetryRecorder();
