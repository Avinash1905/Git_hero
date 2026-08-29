/**
 * GitQuest Frontend - Telemetry Dispatch Service
 * Collects gameplay move telemetry, command execution latency,
 * puzzle solvability metrics, error logs, and batch report dispatchers.
 */

export class TelemetryDispatchService {
  constructor(endpointUrl = '/api/telemetry', batchSize = 10, flushIntervalMs = 15000) {
    this.endpointUrl = endpointUrl;
    this.batchSize = batchSize;
    this.flushIntervalMs = flushIntervalMs;
    this.buffer = [];
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    this.timerId = null;
    this.startPeriodicFlush();
  }

  recordEvent(eventName, payload = {}) {
    const eventRecord = {
      sessionId: this.sessionId,
      eventName,
      timestamp: Date.now(),
      payload: { ...payload }
    };

    this.buffer.push(eventRecord);
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  recordMove(levelId, moveCount, command) {
    this.recordEvent('PLAYER_MOVE', { levelId, moveCount, command });
  }

  recordLevelStart(levelId) {
    this.recordEvent('LEVEL_START', { levelId, startTime: Date.now() });
  }

  recordLevelComplete(levelId, stars, moves, totalTimeMs) {
    this.recordEvent('LEVEL_COMPLETE', { levelId, stars, moves, totalTimeMs });
  }

  recordCommandError(command, errorReason) {
    this.recordEvent('COMMAND_ERROR', { command, errorReason });
  }

  async flush() {
    if (this.buffer.length === 0) return { flushed: 0 };

    const batch = [...this.buffer];
    this.buffer = [];

    // In browser client environment, dispatch via fetch if available
    if (typeof fetch !== 'undefined') {
      try {
        await fetch(this.endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch })
        });
      } catch (err) {
        // Queue back if failed
        this.buffer.unshift(...batch);
        return { flushed: 0, error: err.message };
      }
    }

    return { flushed: batch.length };
  }

  startPeriodicFlush() {
    if (typeof setInterval !== 'undefined' && !this.timerId) {
      this.timerId = setInterval(() => this.flush(), this.flushIntervalMs);
    }
  }

  destroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.flush();
  }
}
