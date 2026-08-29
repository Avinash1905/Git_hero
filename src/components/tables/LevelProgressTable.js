/**
 * LevelProgressTable
 * Tabular presentation of 250 levels with world grouping, completion indicators, and direct launch actions.
 */

import { DataTable } from './DataTable.js';

export class LevelProgressTable {
  /**
   * Render levels table from catalog and progress
   * @param {Array<Object>} levels
   * @param {Object} progressMap
   * @returns {string}
   */
  static render(levels = [], progressMap = {}) {
    const columns = [
      { key: 'numberBadge', label: 'Sector', sortable: true, align: 'center' },
      { key: 'nameAndDesc', label: 'Mission Title', sortable: true },
      { key: 'worldLabel', label: 'World', sortable: true },
      { key: 'difficultyBadge', label: 'Difficulty', align: 'center' },
      { key: 'statusBadge', label: 'Status', align: 'center' },
      { key: 'starsHtml', label: 'Stars', align: 'center' },
      { key: 'actionButton', label: 'Action', align: 'right' }
    ];

    const data = levels.map((lvl) => {
      const prog = progressMap[lvl.id] || progressMap[String(lvl.number).padStart(2, '0')] || {};
      const isCompleted = Boolean(prog.completed || prog.status === 'COMPLETED');
      const isUnlocked = lvl.number === 1 || isCompleted || Boolean(prog.unlocked || prog.status === 'UNLOCKED');
      const stars = prog.stars || 0;

      let statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-terminal-label uppercase bg-surface-container-high text-on-surface-variant">LOCKED</span>`;
      if (isCompleted) {
        statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-terminal-label uppercase bg-primary text-on-primary font-bold">CLEARED</span>`;
      } else if (isUnlocked) {
        statusBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-terminal-label uppercase bg-primary/20 text-primary border border-primary/30 font-bold">READY</span>`;
      }

      let diffColor = 'text-primary';
      if (lvl.difficulty === 'MEDIUM') diffColor = 'text-secondary';
      if (lvl.difficulty === 'HARD') diffColor = 'text-tertiary';
      if (lvl.difficulty === 'EXPERT') diffColor = 'text-error';

      const starsHtml = [1, 2, 3].map(s => `
        <span class="material-symbols-outlined text-[13px] ${s <= stars ? 'text-tertiary' : 'text-outline-variant/30'}" style="font-variation-settings: 'FILL' ${s <= stars ? 1 : 0};">star</span>
      `).join('');

      return {
        numberBadge: `<span class="font-bold text-on-surface">#${lvl.number}</span>`,
        nameAndDesc: `
          <div>
            <div class="font-bold text-on-surface">${lvl.name}</div>
            <div class="text-[10px] text-on-surface-variant line-clamp-1">${lvl.description || ''}</div>
          </div>
        `,
        worldLabel: `<span class="text-on-surface-variant text-[11px]">World ${lvl.world || 1}</span>`,
        difficultyBadge: `<span class="text-[10px] font-terminal-label font-bold ${diffColor}">${lvl.difficulty || 'EASY'}</span>`,
        statusBadge,
        starsHtml: `<div class="flex items-center justify-center gap-0.5">${starsHtml}</div>`,
        actionButton: isUnlocked ? `
          <button 
            data-level-id="${lvl.id}" 
            data-unlocked="true"
            class="px-3 py-1 rounded-lg bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-[11px] font-bold uppercase transition-all shadow cursor-pointer inline-flex items-center gap-1"
          >
            <span>Launch</span>
            <span class="material-symbols-outlined text-[14px]">play_arrow</span>
          </button>
        ` : `
          <button disabled class="px-3 py-1 rounded-lg bg-surface-container-high text-on-surface-variant/40 font-terminal-label text-[11px] uppercase cursor-not-allowed">
            Locked
          </button>
        `
      };
    });

    return DataTable.renderTableHtml({
      columns,
      data,
      sortColumn: 'numberBadge',
      sortDirection: 'asc'
    });
  }
}
