// GitHero Telemetry & Analytics Reactive Store
// Records fine-grained gameplay metrics, input latencies, and command usage frequencies.

import { Store } from './Store.js';

export class TelemetryStore extends Store {
  constructor() {
    super({
      totalMoves: 0,
      totalPushes: 0,
      totalPulls: 0,
      totalCommands: 0,
      levelsCompleted: 0,
      commandFrequency: {},
      sessionStartTime: Date.now()
    });
  }

  /**
   * Record player movement event
   * @param {string} direction 
   */
  recordMove(direction) {
    this.setState({
      totalMoves: this.getState().totalMoves + 1
    });
  }

  /**
   * Record box push event
   */
  recordPush() {
    this.setState({
      totalPushes: this.getState().totalPushes + 1
    });
  }

  /**
   * Record directional pull event
   */
  recordPull() {
    this.setState({
      totalPulls: this.getState().totalPulls + 1
    });
  }

  /**
   * Record terminal command submission
   * @param {string} command 
   */
  recordCommand(command = '') {
    const root = command.trim().split(' ')[0] || 'unknown';
    const freqs = { ...this.getState().commandFrequency };
    freqs[root] = (freqs[root] || 0) + 1;

    this.setState({
      totalCommands: this.getState().totalCommands + 1,
      commandFrequency: freqs
    });
  }

  /**
   * Record successful level completion
   */
  recordLevelCompletion() {
    this.setState({
      levelsCompleted: this.getState().levelsCompleted + 1
    });
  }
}

// Global Telemetry Store Singleton
export const telemetryStore = new TelemetryStore();
