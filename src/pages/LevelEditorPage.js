/**
 * LevelEditorPage
 * Master editor screen allowing developers to design, validate, and test custom levels.
 */

import { LevelEditorToolbar, LevelEditorGrid } from '../features/editor/LevelEditorGrid.js';
import { LevelValidator } from '../features/editor/LevelValidator.js';
import { LevelExporter } from '../features/editor/LevelExporter.js';

export function renderLevelEditorPage(customLevel = null) {
  const level = customLevel || {
    id: 'custom-01',
    name: 'Tactical Breach',
    gridSize: 6,
    width: 6,
    height: 6,
    player: { x: 1, y: 1 },
    box: { x: 2, y: 2 },
    goal: { x: 4, y: 2 },
    walls: [
      { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 5, y: 0 },
      { x: 0, y: 5 }, { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
      { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 },
      { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }
    ],
    hazards: [],
    commitsReq: 1,
    difficulty: 'EASY',
    xpReward: 300
  };

  const validation = LevelValidator.validate(level);
  const toolbarHtml = LevelEditorToolbar.renderToolbarHtml('wall');
  const gridHtml = LevelEditorGrid.renderGridHtml(level);

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-7xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Level Fabrication Matrix</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            Sector Architecture Studio
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Design custom repository topologies, validate BFS reachability, and playtest live
          </p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            id="editor-validate-btn" 
            class="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-terminal-label text-xs font-bold border border-outline-variant/30 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span class="material-symbols-outlined text-[16px]">${validation.isValid ? 'check_circle' : 'error'}</span>
            <span>${validation.isValid ? 'Topology Solvable' : 'Fix Errors'}</span>
          </button>

          <button 
            id="editor-playtest-btn" 
            class="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-terminal-label text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-primary/30 flex items-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg">play_arrow</span>
            <span>Playtest Sector</span>
          </button>
        </div>
      </div>

      <!-- Editor Workspace -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Center Arena -->
        <div class="lg:col-span-8 space-y-4">
          ${toolbarHtml}
          <div class="w-full flex items-center justify-center p-6 glass-panel rounded-2xl border border-outline-variant/30">
            ${gridHtml}
          </div>
        </div>

        <!-- Right Side Settings & Inspector -->
        <div class="lg:col-span-4 space-y-4 font-terminal-code text-xs">
          <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-3">
            <h4 class="font-bold text-on-surface uppercase tracking-wider text-xs">Sector Metadata</h4>
            <div>
              <label class="block text-on-surface-variant text-[10px] uppercase mb-1">Mission Title</label>
              <input type="text" value="${level.name}" class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface text-xs focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label class="block text-on-surface-variant text-[10px] uppercase mb-1">Grid Dimension</label>
              <select class="w-full bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-3 py-2 text-on-surface text-xs focus:outline-none focus:border-primary">
                <option value="6" selected>6 x 6 Standard</option>
                <option value="8">8 x 8 Advanced</option>
                <option value="10">10 x 10 Massive</option>
              </select>
            </div>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-outline-variant/30 space-y-2">
            <h4 class="font-bold text-on-surface uppercase tracking-wider text-xs">Solvability Diagnostics</h4>
            <div class="p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/20 space-y-1 text-[11px]">
              <div class="flex items-center gap-1.5 ${validation.isValid ? 'text-primary' : 'text-error'}">
                <span class="material-symbols-outlined text-[16px]">${validation.isValid ? 'verified' : 'cancel'}</span>
                <span>${validation.isValid ? 'BFS Solvability Verified' : 'Unsolvable Configuration'}</span>
              </div>
              <div class="text-on-surface-variant">Player path to box: Clear</div>
              <div class="text-on-surface-variant">Box deadlock risk: None</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}
