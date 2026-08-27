/**
 * GitHero Objective Engine
 * Dynamically evaluates multi-stage puzzle objectives (status inspections, box positioning, git commits).
 */

export class ObjectiveEngine {
  static evaluate(gameState) {
    const levelDef = gameState.levelDef;
    if (!levelDef || !levelDef.objectives) {
      return [
        { label: 'Stage changes onto target partition', completed: gameState.isGoalReached },
        { label: 'Finalize commit with git commit', completed: gameState.isCommitted }
      ];
    }

    const onGoal = gameState.checkGoal();

    return levelDef.objectives.map((objText, idx) => {
      let isDone = false;

      if (idx === 0) {
        // First objective: inspect status or start
        isDone = gameState.statusCount > 0 || gameState.moves > 0;
      } else if (idx === 1) {
        // Second objective: position box / activate switch
        isDone = onGoal;
      } else if (idx === 2) {
        // Third objective: commit / finish
        isDone = gameState.isCommitted;
      } else {
        isDone = gameState.isCommitted;
      }

      return {
        label: objText,
        completed: isDone
      };
    });
  }

  static areAllCompleted(objectives) {
    return objectives.length > 0 && objectives.every(o => o.completed);
  }
}
