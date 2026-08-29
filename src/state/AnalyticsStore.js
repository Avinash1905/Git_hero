/**
 * AnalyticsStore
 * State store aggregating session metrics, move counts, and level telemetry data.
 */

import { Store } from './Store.js';

export class AnalyticsStore extends Store {
  constructor() {
    super({
      totalMoves: 0,
      totalCommits: 0,
      totalResets: 0,
      sessionsCompleted: 0,
      recentErrors: []
    });
  }

  recordMove() {
    this.setState({ totalMoves: this.state.totalMoves + 1 });
  }

  recordCommit() {
    this.setState({ totalCommits: this.state.totalCommits + 1 });
  }

  recordReset() {
    this.setState({ totalResets: this.state.totalResets + 1 });
  }

  recordError(errorMsg) {
    const list = [...this.state.recentErrors, { msg: errorMsg, timestamp: Date.now() }].slice(-10);
    this.setState({ recentErrors: list });
  }
}

export const analyticsStore = new AnalyticsStore();
