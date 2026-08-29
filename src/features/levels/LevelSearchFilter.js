// GitHero Level Search & Multi-Facet Filter Engine
// Performs fast client-side query filtering across the 250 level catalog.

export class LevelSearchFilter {
  /**
   * Filter levels based on query criteria
   * @param {Array} levels 
   * @param {Object} progressMap 
   * @param {Object} filterOptions 
   * @returns {Array} filtered levels
   */
  static filterLevels(levels = [], progressMap = {}, filterOptions = {}) {
    const {
      world = 'ALL',
      difficulty = 'ALL',
      status = 'ALL', // 'ALL' | 'UNLOCKED' | 'COMPLETED' | 'LOCKED'
      searchQuery = '',
      tag = 'ALL'
    } = filterOptions;

    const normalizedQuery = (searchQuery || '').trim().toLowerCase();

    return levels.filter(lvl => {
      // 1. World filter
      if (world !== 'ALL' && String(lvl.world) !== String(world)) {
        return false;
      }

      // 2. Difficulty filter
      if (difficulty !== 'ALL' && lvl.difficulty !== difficulty) {
        return false;
      }

      // 3. Status filter
      const isCompleted = !!progressMap[lvl.id]?.completed;
      const isUnlocked = progressMap[lvl.id]?.unlocked !== false; // Level 1 is true by default

      if (status === 'COMPLETED' && !isCompleted) return false;
      if (status === 'UNLOCKED' && (!isUnlocked || isCompleted)) return false;
      if (status === 'LOCKED' && isUnlocked) return false;

      // 4. Mechanic tag filter
      if (tag !== 'ALL') {
        const tags = lvl.tags || [];
        if (!tags.includes(tag)) return false;
      }

      // 5. Search keyword filter
      if (normalizedQuery) {
        const idMatch = String(lvl.id).toLowerCase().includes(normalizedQuery);
        const nameMatch = (lvl.name || '').toLowerCase().includes(normalizedQuery);
        const descMatch = (lvl.description || '').toLowerCase().includes(normalizedQuery);
        const worldMatch = `world ${lvl.world}`.includes(normalizedQuery);
        if (!idMatch && !nameMatch && !descMatch && !worldMatch) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Render filter toolbar HTML
   * @param {Object} activeFilters 
   * @returns {string} HTML markup
   */
  static renderFilterToolbar(activeFilters = {}) {
    const {
      world = 'ALL',
      difficulty = 'ALL',
      status = 'ALL',
      searchQuery = ''
    } = activeFilters;

    const difficulties = ['ALL', 'EASY', 'MEDIUM', 'HARD', 'EXPERT', 'MASTER'];
    const statuses = [
      { id: 'ALL', label: 'All Levels' },
      { id: 'UNLOCKED', label: 'In Progress' },
      { id: 'COMPLETED', label: 'Completed' },
      { id: 'LOCKED', label: 'Locked' }
    ];

    const diffOptions = difficulties.map(d => `
      <option value="${d}" ${difficulty === d ? 'selected' : ''}>${d === 'ALL' ? 'All Difficulties' : d}</option>
    `).join('');

    const statusOptions = statuses.map(s => `
      <option value="${s.id}" ${status === s.id ? 'selected' : ''}>${s.label}</option>
    `).join('');

    return `
      <div class="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col md:flex-row gap-3 items-center justify-between shadow-md">
        <!-- Search Input -->
        <div class="relative w-full md:w-72">
          <span class="material-symbols-Outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            id="levels-search-input" 
            placeholder="Search level #, name, concept..." 
            value="${searchQuery}" 
            class="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-9 pr-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none"
          />
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select id="filter-difficulty" class="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none">
            ${diffOptions}
          </select>

          <select id="filter-status" class="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:border-primary focus:outline-none">
            ${statusOptions}
          </select>
        </div>
      </div>
    `;
  }
}
