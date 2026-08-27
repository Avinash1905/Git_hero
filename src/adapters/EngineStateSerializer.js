// GitHero Engine State Serializer & Timeline Replayer
// Handles deterministic state snapshotting, delta diffing, replay execution, and checkpoint packaging.

export class EngineStateSerializer {
  /**
   * Serialize game state into compact immutable snapshot
   * @param {Object} state 
   * @returns {Object}
   */
  static serializeSnapshot(state) {
    if (!state) return null;

    return {
      version: 1,
      timestamp: Date.now(),
      levelId: state.levelId || '01',
      moves: state.moves || 0,
      pushCount: state.pushCount || 0,
      pullCount: state.pullCount || 0,
      commandsCount: state.commandsCount || 0,
      elapsedSeconds: state.elapsedSeconds || 0,
      score: state.score || 0,
      stars: state.stars || 0,
      isGoalReached: !!state.isGoalReached,
      isCommitted: !!state.isCommitted,
      gridSize: state.gridSize || 8,
      player: state.player ? { ...state.player } : { x: 0, y: 0, facing: 'down' },
      box: state.box ? { ...state.box } : { x: 0, y: 0 },
      boxes: Array.isArray(state.boxes) ? state.boxes.map(b => ({ ...b })) : [],
      goal: state.goal ? { ...state.goal } : { x: 0, y: 0 },
      goals: Array.isArray(state.goals) ? state.goals.map(g => ({ ...g })) : [],
      walls: Array.isArray(state.walls) ? state.walls.map(w => ({ ...w })) : [],
      hazards: Array.isArray(state.hazards) ? state.hazards.map(h => ({ ...h })) : [],
      doors: Array.isArray(state.doors) ? state.doors.map(d => ({ ...d })) : [],
      switches: Array.isArray(state.switches) ? state.switches.map(s => ({ ...s })) : [],
      portals: Array.isArray(state.portals) ? state.portals.map(p => ({ ...p })) : [],
      lasers: Array.isArray(state.lasers) ? state.lasers.map(l => ({ ...l })) : [],
      mirrors: Array.isArray(state.mirrors) ? state.mirrors.map(m => ({ ...m })) : [],
      activeBranch: state.activeBranch || 'main',
      headCommit: state.headCommit || 'root',
      stagedPayload: !!state.stagedPayload
    };
  }

  /**
   * Compare two consecutive snapshots to generate delta changes
   * @param {Object} prevSnapshot 
   * @param {Object} nextSnapshot 
   * @returns {Object} delta object
   */
  static computeDelta(prevSnapshot, nextSnapshot) {
    if (!prevSnapshot || !nextSnapshot) return null;

    const delta = {
      movesDiff: nextSnapshot.moves - prevSnapshot.moves,
      timeDiff: nextSnapshot.elapsedSeconds - prevSnapshot.elapsedSeconds,
      playerMoved: prevSnapshot.player.x !== nextSnapshot.player.x || prevSnapshot.player.y !== nextSnapshot.player.y,
      playerDirectionChanged: prevSnapshot.player.facing !== nextSnapshot.player.facing,
      boxMoved: prevSnapshot.box.x !== nextSnapshot.box.x || prevSnapshot.box.y !== nextSnapshot.box.y,
      goalReachedChanged: prevSnapshot.isGoalReached !== nextSnapshot.isGoalReached,
      committedChanged: prevSnapshot.isCommitted !== nextSnapshot.isCommitted,
      branchChanged: prevSnapshot.activeBranch !== nextSnapshot.activeBranch
    };

    return delta;
  }

  /**
   * Replay timeline session step-by-step
   */
  static createTimelineReplayer(snapshots = []) {
    let currentIndex = 0;

    return {
      getTotalSteps: () => snapshots.length,
      getCurrentIndex: () => currentIndex,
      getCurrentSnapshot: () => snapshots[currentIndex] || null,
      hasNext: () => currentIndex < snapshots.length - 1,
      hasPrev: () => currentIndex > 0,
      stepForward: () => {
        if (currentIndex < snapshots.length - 1) {
          currentIndex++;
          return snapshots[currentIndex];
        }
        return null;
      },
      stepBackward: () => {
        if (currentIndex > 0) {
          currentIndex--;
          return snapshots[currentIndex];
        }
        return null;
      },
      jumpToStep: (index) => {
        if (index >= 0 && index < snapshots.length) {
          currentIndex = index;
          return snapshots[currentIndex];
        }
        return null;
      },
      reset: () => {
        currentIndex = 0;
        return snapshots[0] || null;
      }
    };
  }

  /**
   * Export game session to JSON package
   * @param {string} levelId 
   * @param {Array} history 
   * @param {Object} finalStats 
   * @returns {string} JSON string
   */
  static exportSessionRecording(levelId, history = [], finalStats = {}) {
    const recording = {
      magic: 'GITQUEST_REC_V1',
      exportedAt: new Date().toISOString(),
      levelId,
      stepCount: history.length,
      finalStats,
      timeline: history.map(snap => this.serializeSnapshot(snap))
    };
    return JSON.stringify(recording, null, 2);
  }
}
