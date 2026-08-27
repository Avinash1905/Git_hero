/**
 * GitQuest Backend Service: Session Replay Verification & Level Analytics
 */

export class ReplayService {
  constructor() {
    this.replays = new Map(); // sessionId -> replayData
  }

  saveReplay(sessionId, levelId, moveHistory, commandLog) {
    const replay = {
      sessionId,
      levelId,
      timestamp: new Date().toISOString(),
      movesCount: moveHistory ? moveHistory.length : 0,
      moveHistory: moveHistory || [],
      commandLog: commandLog || []
    };
    this.replays.set(sessionId, replay);
    return replay;
  }

  getReplay(sessionId) {
    return this.replays.get(sessionId) || null;
  }
}

export class AnalyticsService {
  constructor() {
    this.levelStats = new Map(); // levelId -> { attempts, completions, totalSeconds }
  }

  recordAttempt(levelId) {
    const stat = this._getOrCreate(levelId);
    stat.attempts++;
  }

  recordCompletion(levelId, elapsedSec) {
    const stat = this._getOrCreate(levelId);
    stat.completions++;
    stat.totalSeconds += elapsedSec;
  }

  getLevelAnalytics(levelId) {
    const stat = this._getOrCreate(levelId);
    const passRate = stat.attempts > 0 ? (stat.completions / stat.attempts) * 100 : 0;
    const avgTime = stat.completions > 0 ? stat.totalSeconds / stat.completions : 0;
    return {
      levelId,
      attempts: stat.attempts,
      completions: stat.completions,
      passRate: Number(passRate.toFixed(1)),
      averageClearTimeSec: Number(avgTime.toFixed(1))
    };
  }

  _getOrCreate(levelId) {
    if (!this.levelStats.has(levelId)) {
      this.levelStats.set(levelId, { attempts: 0, completions: 0, totalSeconds: 0 });
    }
    return this.levelStats.get(levelId);
  }
}

export const replayService = new ReplayService();
export const analyticsService = new AnalyticsService();
