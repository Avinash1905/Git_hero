// GitHero Level Detail Inspector
// Renders comprehensive level briefing, objectives, mechanic tags, and hints.

import { LevelMetadata } from '../features/levels/LevelMetadata.js';

export class LevelDetailInspector {
  /**
   * Render rich level detail briefing card
   * @param {Object} levelData 
   * @param {Object} progressData 
   * @returns {string} HTML markup
   */
  static renderBriefingCard(levelData, progressData = {}) {
    if (!levelData) {
      return `<div class="p-6 text-center text-on-surface-variant">No level selected.</div>`;
    }

    const {
      id = '01',
      name = 'Sector Entrance',
      world = 1,
      difficulty = 'EASY',
      stars = 3,
      xpReward = 100,
      description = '',
      objectives = [],
      hint = '',
      tags = []
    } = levelData;

    const isCompleted = !!progressData.completed;
    const earnedStars = progressData.stars || 0;
    const bestScore = progressData.bestScore || 0;
    const bestMoves = progressData.bestMoves || '--';

    const diffColors = {
      EASY: 'bg-primary/20 text-primary border-primary/30',
      MEDIUM: 'bg-secondary/20 text-secondary border-secondary/30',
      HARD: 'bg-tertiary/20 text-tertiary border-tertiary/30',
      EXPERT: 'bg-error/20 text-error border-error/30',
      MASTER: 'bg-primary-fixed/20 text-primary-fixed border-primary-fixed/30'
    };

    const diffBadge = diffColors[difficulty] || diffColors.EASY;

    const objectivesList = objectives.map((obj, i) => `
      <div class="flex items-start gap-2.5 text-xs text-on-surface">
        <span class="material-symbols-Outlined text-primary text-sm mt-0.5">${isCompleted ? 'task_alt' : 'radio_button_unchecked'}</span>
        <span>${obj}</span>
      </div>
    `).join('');

    const starIcons = Array.from({ length: 3 }).map((_, i) => `
      <span class="material-symbols-Outlined text-lg ${i < earnedStars ? 'text-tertiary font-variation-fill' : 'text-outline-variant'}">star</span>
    `).join('');

    return `
      <div class="bg-surface-container rounded-xl border border-outline-variant/30 overflow-hidden shadow-xl">
        <!-- Header Banner -->
        <div class="p-5 bg-surface-container-high border-b border-outline-variant/30 flex justify-between items-start">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 text-xs font-mono font-bold rounded ${diffBadge} border">${difficulty}</span>
              <span class="text-xs font-mono text-on-surface-variant">WORLD ${world} • LEVEL ${id}</span>
            </div>
            <h2 class="text-lg font-bold text-on-surface">${name}</h2>
          </div>
          <div class="flex items-center gap-1 bg-surface-container-lowest px-2.5 py-1 rounded-full border border-outline-variant/20">
            ${starIcons}
          </div>
        </div>

        <!-- Content Body -->
        <div class="p-5 space-y-4">
          <!-- Description -->
          <p class="text-xs text-on-surface-variant leading-relaxed">${description || 'Complete the Git branch objectives to advance through this sector.'}</p>

          <!-- Objectives -->
          <div>
            <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span class="material-symbols-Outlined text-secondary text-sm">checklist</span>
              Mission Objectives
            </h4>
            <div class="space-y-2 bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
              ${objectivesList || '<p class="text-xs text-on-surface-variant">Stage payload on target coordinate and commit.</p>'}
            </div>
          </div>

          <!-- Tactical Hint -->
          ${hint ? `
            <div class="p-3 bg-secondary/10 rounded-lg border border-secondary/30 flex items-start gap-2.5">
              <span class="material-symbols-Outlined text-secondary text-base mt-0.5">lightbulb</span>
              <div>
                <span class="text-xs font-bold text-secondary uppercase tracking-wider block">Tactical Intel</span>
                <span class="text-xs text-on-surface-variant">${hint}</span>
              </div>
            </div>
          ` : ''}

          <!-- Performance Records -->
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span class="text-xs text-on-surface-variant block">Reward</span>
              <span class="text-sm font-bold text-primary font-mono">+${xpReward} XP</span>
            </div>
            <div class="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span class="text-xs text-on-surface-variant block">Best Score</span>
              <span class="text-sm font-bold text-on-surface font-mono">${bestScore}</span>
            </div>
            <div class="p-2.5 bg-surface-container-low rounded-lg border border-outline-variant/20">
              <span class="text-xs text-on-surface-variant block">Best Moves</span>
              <span class="text-sm font-bold text-on-surface font-mono">${bestMoves}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
