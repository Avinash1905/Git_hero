/**
 * TutorialsPage
 * Interactive curriculum viewer allowing developers to launch hands-on missions
 * across all 20 Worlds.
 */

import { TUTORIAL_CATALOG } from '../features/tutorials/TutorialCatalog.js';
import { TutorialRunner } from '../features/tutorials/TutorialRunner.js';
import { TutorialView } from '../features/tutorials/TutorialView.js';

export function renderTutorialsPage(selectedWorld = 1) {
  const tutorial = TUTORIAL_CATALOG.find(t => t.world === Number(selectedWorld)) || TUTORIAL_CATALOG[0];
  const runner = new TutorialRunner(tutorial.id);
  const tutorialCardHtml = TutorialView.renderHtml(runner);

  const worldPills = TUTORIAL_CATALOG.map((t) => `
    <button 
      data-tut-world="${t.world}"
      class="px-3.5 py-2 rounded-xl text-xs font-terminal-label transition-all cursor-pointer ${t.world === Number(selectedWorld) ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/20' : 'bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface border border-outline-variant/30'}"
    >
      <span>World ${String(t.world).padStart(2, '0')}</span>
    </button>
  `).join('');

  return `
    <main class="min-h-screen pt-20 pb-24 px-4 max-w-6xl mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-terminal-label font-bold uppercase tracking-wider mb-2">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span>Interactive Academy</span>
          </div>
          <h1 class="text-headline-md font-headline-md text-on-surface font-bold">
            20-World Git Curriculum
          </h1>
          <p class="text-on-surface-variant text-sm font-terminal-code">
            Master the complete version control spectrum through guided tactical command missions
          </p>
        </div>
      </div>

      <!-- World Selector Strip -->
      <div class="flex items-center gap-2 overflow-x-auto p-2 bg-surface-container-lowest/80 rounded-2xl border border-outline-variant/30 scrollbar-thin">
        ${worldPills}
      </div>

      <!-- Active Mission Card -->
      <div id="tutorial-card-container">
        ${tutorialCardHtml}
      </div>
    </main>
  `;
}
