/**
 * GitQuest Engine - Session Replay Recorder & Playback Engine
 * Deterministic frame-by-frame & command session recording for level sharing, speedruns, and debugging.
 */

import { EngineUtils } from '../core/Utils.js';

export class ReplayFrame {
  constructor(tick, command, playerState, boxState, timestamp) {
    this.tick = tick;
    this.command = command;
    this.playerState = playerState;
    this.boxState = boxState;
    this.timestamp = timestamp;
  }
}

export class ReplayRecorder {
  constructor(levelId, seed = 0) {
    this.id = EngineUtils.generateUUID();
    this.levelId = levelId;
    this.seed = seed;
    this.startTime = Date.now();
    this.frames = []; // Array<ReplayFrame>
    this.isRecording = true;
  }

  recordAction(tick, command, player, box) {
    if (!this.isRecording) return;
    const frame = new ReplayFrame(
      tick,
      command,
      { x: player.x, y: player.y, dir: player.dir },
      { x: box.x, y: box.y },
      Date.now() - this.startTime
    );
    this.frames.push(frame);
  }

  stop() {
    this.isRecording = false;
    return this.serialize();
  }

  serialize() {
    return {
      replayId: this.id,
      version: '2.4.0',
      levelId: this.levelId,
      seed: this.seed,
      totalFrames: this.frames.length,
      durationMs: Date.now() - this.startTime,
      frames: this.frames
    };
  }

  static deserialize(json) {
    const recorder = new ReplayRecorder(json.levelId, json.seed);
    recorder.id = json.replayId;
    recorder.frames = json.frames || [];
    recorder.isRecording = false;
    return recorder;
  }
}

export class ReplayPlayer {
  constructor(replayData, engine) {
    this.replay = replayData;
    this.engine = engine;
    this.currentFrameIndex = 0;
    this.isPlaying = false;
    this.playbackSpeed = 1.0;
  }

  start() {
    this.currentFrameIndex = 0;
    this.isPlaying = true;
    this.engine.loadLevel(this.replay.levelId);
  }

  step() {
    if (this.currentFrameIndex >= this.replay.frames.length) {
      this.isPlaying = false;
      return null;
    }

    const frame = this.replay.frames[this.currentFrameIndex];
    if (frame.command) {
      this.engine.executeCommand(frame.command);
    }
    this.currentFrameIndex++;
    return frame;
  }

  isFinished() {
    return this.currentFrameIndex >= this.replay.frames.length;
  }
}
