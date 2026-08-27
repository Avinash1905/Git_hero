/**
 * LevelStore
 * Reactive domain store for all 250 levels, filter criteria, and unlocked progression map.
 */

import { Store } from './Store.js';
import { levelService } from '../services/levelService.js';
import { progressService } from '../services/progressService.js';
import { LevelDataAdapter } from '../adapters/LevelDataAdapter.js';

export class LevelStore extends Store {
  constructor() {
    super({
      levels: [], // All 250 levels
      progress: {}, // levelId -> { status, stars, bestMoves, bestTime }
      selectedLevelId: '01',
      activeWorldFilter: 1, // 1..20
      difficultyFilter: 'ALL',
      searchQuery: '',
      isLoading: false,
      error: null
    });
  }

  /**
   * Load all 250 levels and player progress from backend
   */
  async loadLevelsAndProgress() {
    this.setState({ isLoading: true, error: null }, 'LEVELS_LOAD_START');
    try {
      const [levels, userProgress] = await Promise.all([
        levelService.getAllLevels(),
        progressService.getProgress()
      ]);

      // Adapt levels with player unlock state
      const adaptedLevels = levels.map((lvl) => {
        return LevelDataAdapter.adaptToLevelModel(lvl, lvl.id, userProgress);
      });

      this.setState({
        levels: adaptedLevels,
        progress: userProgress,
        isLoading: false
      }, 'LEVELS_LOAD_SUCCESS');
    } catch (err) {
      console.error('[LevelStore] Failed to load levels:', err);
      this.setState({ isLoading: false, error: err.message }, 'LEVELS_LOAD_ERROR');
    }
  }

  setSelectedLevelId(levelId) {
    this.setState({ selectedLevelId: LevelDataAdapter.normalizeLevelId(levelId) }, 'SET_SELECTED_LEVEL');
  }

  setWorldFilter(worldNum) {
    this.setState({ activeWorldFilter: Number(worldNum) || 1 }, 'SET_WORLD_FILTER');
  }

  setDifficultyFilter(diff) {
    this.setState({ difficultyFilter: diff || 'ALL' }, 'SET_DIFFICULTY_FILTER');
  }

  setSearchQuery(query) {
    this.setState({ searchQuery: String(query || '').toLowerCase() }, 'SET_SEARCH_QUERY');
  }

  /**
   * Unlock next sequential level upon completion
   * @param {string|number} completedLevelId
   * @param {Object} stats
   */
  completeLevel(completedLevelId, stats) {
    const normId = LevelDataAdapter.normalizeLevelId(completedLevelId);
    const num = LevelDataAdapter.parseLevelNumber(normId);
    const nextId = LevelDataAdapter.normalizeLevelId(num + 1);

    this.setState((prev) => {
      const updatedProgress = {
        ...prev.progress,
        [normId]: {
          status: 'COMPLETED',
          completed: true,
          stars: stats.stars || 3,
          bestMoves: stats.moves || 0,
          bestTime: stats.time || 0
        },
        [nextId]: {
          status: 'UNLOCKED',
          completed: false,
          stars: 0
        }
      };

      const updatedLevels = prev.levels.map((lvl) => {
        if (lvl.id === normId) {
          return { ...lvl, status: 'COMPLETED', completed: true, stars: stats.stars || 3 };
        }
        if (lvl.id === nextId) {
          return { ...lvl, status: 'UNLOCKED', unlocked: true };
        }
        return lvl;
      });

      return {
        progress: updatedProgress,
        levels: updatedLevels
      };
    }, 'LEVEL_COMPLETED');
  }
}

export const levelStore = new LevelStore();
