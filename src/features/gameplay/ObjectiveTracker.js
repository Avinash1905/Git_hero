// GitHero HUD Objective Tracker
// Tracks live objective milestones and stage readiness during gameplay.

export class ObjectiveTracker {
  /**
   * Evaluate dynamic objectives from state
   * @param {Object} state 
   * @returns {Array<{ text: string, completed: boolean, icon: string }>}
   */
  static getEvaluatedObjectives(state) {
    if (!state) return [];

    const objectives = [];

    // 1. Box staging objective
    objectives.push({
      text: 'Push or Pull box onto target goal coordinate',
      completed: !!state.isGoalReached,
      icon: state.isGoalReached ? 'check_circle' : 'inventory_2'
    });

    // 2. Commit staging objective
    objectives.push({
      text: 'Execute git commit in terminal to register victory',
      completed: !!state.isCommitted,
      icon: state.isCommitted ? 'verified' : 'terminal'
    });

    return objectives;
  }

  /**
   * Render dynamic HUD objective widget
   * @param {Object} state 
   * @returns {string} HTML markup
   */
  static renderTrackerWidget(state) {
    const objectives = this.getEvaluatedObjectives(state);

    const items = objectives.map(obj => `
      <div class="flex items-center gap-2 text-xs ${obj.completed ? 'text-primary' : 'text-on-surface-variant'}">
        <span class="material-symbols-Outlined text-sm ${obj.completed ? 'text-primary' : 'text-outline'}">${obj.icon}</span>
        <span class="${obj.completed ? 'line-through text-on-surface-variant font-medium' : 'text-on-surface'}">${obj.text}</span>
      </div>
    `).join('');

    return `
      <div class="bg-surface-container-low/90 backdrop-blur p-3 rounded-lg border border-outline-variant/30 space-y-2">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
            <span class="material-symbols-Outlined text-xs">flag</span>
            Directives
          </span>
          <span class="text-xs font-mono ${state?.isGoalReached ? 'text-primary font-bold animate-pulse' : 'text-on-surface-variant'}">
            ${state?.isGoalReached ? 'GOAL STAGED • COMMIT READY' : 'IN PROGRESS'}
          </span>
        </div>
        <div class="space-y-1.5">
          ${items}
        </div>
      </div>
    `;
  }
}
