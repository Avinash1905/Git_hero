/**
 * TelemetryService
 * Records anonymized developer session telemetry: execution counts, keystroke cadence,
 * level replay rates, and command errors for performance analytics.
 */

export class TelemetryService {
  constructor() {
    this.sessionStartTime = Date.now();
    this.events = [];
    this.stats = {
      totalMoves: 0,
      totalPushes: 0,
      totalPulls: 0,
      totalCommands: 0,
      totalErrors: 0,
      levelsAttempted: new Set(),
      levelsCompleted: new Set()
    };
  }

  logEvent(category, action, label = '', value = 0) {
    const entry = {
      timestamp: Date.now(),
      category,
      action,
      label,
      value
    };
    this.events.push(entry);

    if (action === 'MOVE') this.stats.totalMoves++;
    if (action === 'PUSH') this.stats.totalPushes++;
    if (action === 'PULL') this.stats.totalPulls++;
    if (action === 'COMMAND') this.stats.totalCommands++;
    if (action === 'ERROR') this.stats.totalErrors++;
    if (category === 'LEVEL_START' && label) this.stats.levelsAttempted.add(label);
    if (category === 'LEVEL_WIN' && label) this.stats.levelsCompleted.add(label);
  }

  getSummary() {
    const durationSeconds = Math.round((Date.now() - this.sessionStartTime) / 1000);
    return {
      sessionDurationSeconds: durationSeconds,
      totalMoves: this.stats.totalMoves,
      totalPushes: this.stats.totalPushes,
      totalPulls: this.stats.totalPulls,
      totalCommands: this.stats.totalCommands,
      totalErrors: this.stats.totalErrors,
      levelsAttemptedCount: this.stats.levelsAttempted.size,
      levelsCompletedCount: this.stats.levelsCompleted.size,
      commandEfficiency: this.stats.totalCommands > 0 ? (this.stats.totalMoves / this.stats.totalCommands).toFixed(2) : '1.0'
    };
  }

  reset() {
    this.events = [];
    this.sessionStartTime = Date.now();
    this.stats = {
      totalMoves: 0,
      totalPushes: 0,
      totalPulls: 0,
      totalCommands: 0,
      totalErrors: 0,
      levelsAttempted: new Set(),
      levelsCompleted: new Set()
    };
  }
}

export const telemetryService = new TelemetryService();
