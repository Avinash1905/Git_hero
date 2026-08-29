/**
 * SectorTagFilter
 * Multi-tag selector filtering levels by puzzle mechanics and Git concepts.
 */

export class SectorTagFilter {
  constructor() {
    this.tags = [
      { id: 'all', label: 'All Sectors' },
      { id: 'branching', label: 'Branching' },
      { id: 'merging', label: 'Merging' },
      { id: 'rebasing', label: 'Rebasing' },
      { id: 'laser', label: 'Lasers' },
      { id: 'portal', label: 'Portals' },
      { id: 'stash', label: 'Stashing' },
      { id: 'plumbing', label: 'Plumbing' }
    ];
    this.activeTag = 'all';
  }

  filterLevels(levels = [], tag = 'all') {
    if (!tag || tag === 'all') return levels;
    const clean = tag.toLowerCase();
    return levels.filter(lvl => {
      const concept = (lvl.concept || '').toLowerCase();
      const desc = (lvl.description || '').toLowerCase();
      return concept.includes(clean) || desc.includes(clean);
    });
  }

  renderHtml(activeTag = 'all', onSelectTag = 'handleSelectSectorTag') {
    const buttons = this.tags.map(t => `
      <button 
        type="button" 
        onclick="${onSelectTag}('${t.id}')"
        class="px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer ${activeTag === t.id ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'}"
      >
        ${t.label}
      </button>
    `).join('');

    return `
      <div class="flex flex-wrap gap-2">
        ${buttons}
      </div>
    `;
  }
}

export const sectorTagFilter = new SectorTagFilter();
