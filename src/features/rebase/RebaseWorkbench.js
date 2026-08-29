/**
 * RebaseWorkbench
 * Interactive Git Rebase (`git rebase -i`) UI controller.
 */

import { RebaseState } from './RebaseState.js';

export class RebaseWorkbench {
  constructor(state = null) {
    this.state = state || new RebaseState();
  }

  /**
   * Render rebase table and controls HTML
   * @returns {string}
   */
  renderHtml() {
    const commits = this.state.commits;

    const rows = commits.map((c, idx) => {
      const isDropped = c.action === 'drop';
      const isSquashed = c.action === 'squash' || c.action === 'fixup';

      return `
        <div class="glass-panel p-3.5 rounded-xl border ${isDropped ? 'border-outline-variant/20 opacity-40' : isSquashed ? 'border-secondary/40 bg-secondary/5' : 'border-primary/40'} flex items-center justify-between gap-3 font-terminal-code text-xs transition-all">
          <!-- Reorder Handles & Index -->
          <div class="flex items-center gap-2">
            <span class="text-on-surface-variant text-[11px] w-4 select-none">#${idx + 1}</span>
            <div class="flex flex-col gap-0.5">
              <button 
                data-move-up="${idx}" 
                ${idx === 0 ? 'disabled' : ''} 
                class="hover:text-primary disabled:opacity-20 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[14px]">expand_less</span>
              </button>
              <button 
                data-move-down="${idx}" 
                ${idx === commits.length - 1 ? 'disabled' : ''} 
                class="hover:text-primary disabled:opacity-20 cursor-pointer"
              >
                <span class="material-symbols-outlined text-[14px]">expand_more</span>
              </button>
            </div>

            <!-- Action Select -->
            <select 
              data-action-index="${idx}"
              class="bg-surface-container-lowest border border-outline-variant/40 rounded px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer uppercase font-terminal-label font-bold"
            >
              <option value="pick" ${c.action === 'pick' ? 'selected' : ''}>PICK</option>
              <option value="reword" ${c.action === 'reword' ? 'selected' : ''}>REWORD</option>
              <option value="squash" ${c.action === 'squash' ? 'selected' : ''}>SQUASH</option>
              <option value="fixup" ${c.action === 'fixup' ? 'selected' : ''}>FIXUP</option>
              <option value="drop" ${c.action === 'drop' ? 'selected' : ''}>DROP</option>
            </select>
          </div>

          <!-- Commit SHA & Message -->
          <div class="flex-1 flex items-center gap-2 overflow-hidden">
            <span class="text-primary font-bold font-mono shrink-0">${c.hash}</span>
            <span class="truncate ${isDropped ? 'line-through text-on-surface-variant' : 'text-on-surface'}">${c.message}</span>
          </div>

          <!-- Action Badge -->
          <span class="text-[10px] font-terminal-label uppercase px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-bold">
            ${c.action.toUpperCase()}
          </span>
        </div>
      `;
    }).join('');

    const preview = this.state.compileLinearHistory();
    const previewHtml = preview.map((p, i) => `
      <div class="flex items-center gap-2 text-xs font-terminal-code">
        <span class="text-secondary font-bold">●</span>
        <span class="text-primary font-mono text-[11px]">${p.hash}</span>
        <span class="text-on-surface truncate">${p.message.split('\n')[0]}</span>
        ${p.squashedHashes.length > 1 ? `<span class="text-[10px] px-1.5 py-0.2 rounded bg-secondary/20 text-secondary">${p.squashedHashes.length} squashed</span>` : ''}
      </div>
    `).join('');

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-2xl font-terminal-code">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-variant/30 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-secondary/20 text-secondary text-[10px] font-terminal-label uppercase font-bold border border-secondary/30">
                GIT REBASE -I
              </span>
              <span class="text-xs text-on-surface font-bold">Rebasing onto origin/${this.state.targetBase}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">Reorder commits, combine hunks, and create clean history</p>
          </div>

          <button 
            id="btn-apply-rebase"
            class="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/90 text-on-secondary font-terminal-label text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-secondary/30 flex items-center gap-1.5 cursor-pointer"
          >
            <span class="material-symbols-outlined text-[16px]">check</span>
            <span>Execute Rebase</span>
          </button>
        </div>

        <!-- Commit Actions List -->
        <div class="space-y-2">
          ${rows}
        </div>

        <!-- Resulting Linear Log Preview -->
        <div class="p-4 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20 space-y-2">
          <span class="text-[10px] text-on-surface-variant font-terminal-label uppercase font-bold tracking-wider">
            Resulting Linear History Preview
          </span>
          <div class="space-y-1 pt-1">
            ${previewHtml}
          </div>
        </div>
      </div>
    `;
  }

  bindEvents(containerEl, onExecuted = null) {
    if (!containerEl) return;

    containerEl.querySelectorAll('[data-action-index]').forEach((sel) => {
      sel.addEventListener('change', (e) => {
        const idx = parseInt(sel.getAttribute('data-action-index'), 10);
        this.state.setAction(idx, e.target.value);
        containerEl.innerHTML = this.renderHtml();
        this.bindEvents(containerEl, onExecuted);
      });
    });

    containerEl.querySelectorAll('[data-move-up]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-move-up'), 10);
        this.state.moveCommit(idx, idx - 1);
        containerEl.innerHTML = this.renderHtml();
        this.bindEvents(containerEl, onExecuted);
      });
    });

    containerEl.querySelectorAll('[data-move-down]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-move-down'), 10);
        this.state.moveCommit(idx, idx + 1);
        containerEl.innerHTML = this.renderHtml();
        this.bindEvents(containerEl, onExecuted);
      });
    });

    containerEl.querySelector('#btn-apply-rebase')?.addEventListener('click', () => {
      if (typeof onExecuted === 'function') {
        onExecuted(this.state.compileLinearHistory());
      }
    });
  }
}
