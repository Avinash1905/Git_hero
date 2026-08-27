/**
 * GitQuest Feature: Git Manual View & Interactive Encyclopedia
 */

import { GIT_MANUAL_SECTIONS } from './GitManualData.js';
import { renderBreadcrumbs } from '../../components/navigation/NavigationComponents.js';

export class GitManualView {
  constructor(app) {
    this.app = app;
    this.selectedSectionId = 'basics';
    this.searchQuery = '';
  }

  render(container) {
    if (!container) return;

    const sectionsHtml = GIT_MANUAL_SECTIONS.map(sec => {
      const isSelected = sec.id === this.selectedSectionId;
      return `
        <button 
          data-section-id="${sec.id}"
          class="manual-tab-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl font-terminal-label text-xs uppercase tracking-wider transition-all ${isSelected ? 'bg-primary/10 text-primary border border-primary/30 font-bold glow-primary-sm' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'}"
        >
          <span class="material-symbols-outlined text-[18px]">${sec.icon}</span>
          <span>${sec.title}</span>
        </button>
      `;
    }).join('');

    const currentSection = GIT_MANUAL_SECTIONS.find(s => s.id === this.selectedSectionId) || GIT_MANUAL_SECTIONS[0];
    const filteredCommands = currentSection.commands.filter(cmd => {
      if (!this.searchQuery) return true;
      const q = this.searchQuery.toLowerCase();
      return cmd.name.toLowerCase().includes(q) || cmd.summary.toLowerCase().includes(q) || cmd.description.toLowerCase().includes(q);
    });

    const commandsHtml = filteredCommands.map(cmd => {
      const flagsHtml = cmd.flags.map(f => `
        <li class="flex items-center gap-2 text-on-surface-variant text-xs font-terminal-code">
          <span class="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
          <span>${f}</span>
        </li>
      `).join('');

      return `
        <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 relative">
          <div class="flex justify-between items-start mb-3">
            <div>
              <span class="text-[10px] font-terminal-label font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/30 uppercase tracking-widest">${cmd.category}</span>
              <h3 class="text-headline-sm font-headline-sm font-bold text-primary mt-1 font-mono">${cmd.name}</h3>
            </div>
            <div class="bg-surface-container-lowest px-3 py-1 rounded-lg border border-outline-variant/30 font-mono text-xs text-on-surface">
              ${cmd.syntax}
            </div>
          </div>
          <p class="text-on-surface text-sm font-body-md mb-4">${cmd.description}</p>
          
          <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 mb-4 font-mono text-xs text-on-surface flex items-center justify-between">
            <span class="text-primary font-bold">$ ${cmd.example}</span>
            <span class="material-symbols-outlined text-sm text-on-surface-variant/40">terminal</span>
          </div>

          <div class="space-y-1.5 pt-2 border-t border-outline-variant/20">
            <span class="text-[11px] font-terminal-label uppercase tracking-wider text-on-surface-variant font-bold">Options & Flags:</span>
            <ul class="space-y-1 mt-1">
              ${flagsHtml}
            </ul>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="max-w-7xl mx-auto p-6 space-y-6 animate-fade-in">
        ${renderBreadcrumbs([{ label: 'Terminal', route: 'gameplay' }, { label: 'Git Manual', route: 'manual' }])}

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <div>
            <h1 class="text-headline-md font-headline-md font-bold text-on-surface tracking-wide flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-3xl">menu_book</span>
              GIT PROTOCOL MANUAL
            </h1>
            <p class="text-on-surface-variant text-sm font-terminal-code mt-1">
              Official command reference, syntax definitions, and visual workflow diagrams.
            </p>
          </div>

          <div class="relative max-w-xs w-full">
            <input
              id="manual-search-input"
              type="text"
              placeholder="Search commands (e.g. rebase)..."
              value="${this.searchQuery}"
              class="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-4 py-2 text-on-surface text-xs font-terminal-code focus:outline-none focus:border-primary pl-9"
            />
            <span class="material-symbols-outlined text-on-surface-variant absolute left-3 top-2 text-sm">search</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="md:col-span-1 space-y-2">
            ${sectionsHtml}
          </div>

          <div class="md:col-span-3 space-y-4">
            ${commandsHtml.length > 0 ? commandsHtml : '<div class="p-8 text-center glass-panel rounded-2xl text-on-surface-variant font-terminal-code text-sm">No matching Git commands found for search query.</div>'}
          </div>
        </div>
      </div>
    `;

    this._bindEvents(container);
  }

  _bindEvents(container) {
    container.querySelectorAll('.manual-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedSectionId = btn.getAttribute('data-section-id');
        this.render(container);
      });
    });

    const searchInput = container.querySelector('#manual-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.render(container);
      });
    }
  }
}
