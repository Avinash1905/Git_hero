/**
 * TelemetryAnalyticsPipeline
 * Client-side metrics queue and analytics aggregator measuring frame rates,
 * turn latencies, error frequencies, and mission completion funnels.
 */

export class TelemetryAnalyticsPipeline {
  constructor() {
    this.buffer = [];
    this.maxBufferSize = 50;
  }

  logEvent(category, name, data = {}) {
    const entry = {
      category,
      name,
      data,
      timestamp: Date.now()
    };
    this.buffer.push(entry);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
    return entry;
  }

  getMetricsSummary() {
    const errorCount = this.buffer.filter(e => e.category === 'error').length;
    const commandCount = this.buffer.filter(e => e.category === 'command').length;
    const levelSolves = this.buffer.filter(e => e.category === 'gameplay' && e.name === 'level_completed').length;

    return {
      totalEvents: this.buffer.length,
      errorCount,
      commandCount,
      levelSolves
    };
  }

  flush() {
    const events = [...this.buffer];
    this.buffer = [];
    return events;
  }
}

export const telemetryAnalyticsPipeline = new TelemetryAnalyticsPipeline();
