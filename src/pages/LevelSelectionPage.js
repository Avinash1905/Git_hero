/**
 * LevelSelectionPage
 * Screen controller for browsing, searching, and selecting levels across all 250 levels.
 */

import { levelStore } from '../state/LevelStore.js';
import { LevelSelector } from '../features/levels/LevelSelector.js';

export function renderLevelSelectionPage() {
  const { levels, progress, activeWorldFilter, difficultyFilter, searchQuery } = levelStore.getState();

  return LevelSelector.renderSelectorHtml(levels, {
    world: activeWorldFilter,
    difficulty: difficultyFilter,
    search: searchQuery
  }, progress);
}
