/**
 * TutorialView
 * Split-screen interactive tutorial presentation view.
 */

import { TUTORIAL_CATALOG } from './TutorialCatalog.js';

export class TutorialView {
  /**
   * Render interactive tutorial view HTML
   * @param {import('./TutorialRunner.js').TutorialRunner} runner
   * @returns {string}
   */
  static renderHtml(runner) {
    const tutorial = runner.tutorial;
    const step = runner.getCurrentStep();
    const pct = runner.getProgressPercentage();

    return `
      <div class="glass-panel p-6 rounded-2xl border border-outline-variant/30 space-y-6 shadow-2xl font-terminal-code">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-variant/30">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-terminal-label uppercase font-bold border border-primary/30">
                World ${tutorial.world} Curriculum
              </span>
              <span class="text-xs text-on-surface font-bold">${tutorial.title}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant mt-1">${tutorial.description}</p>
          </div>

          <!-- Progress Meter -->
          <div class="flex items-center gap-3">
            <div class="text-right">
              <div class="text-[10px] text-on-surface-variant uppercase">Progress</div>
              <div class="text-xs font-bold text-primary">${pct}%</div>
            </div>
            <div class="w-24 bg-surface-container-lowest h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
            </div>
          </div>
        </div>

        ${step ? `
          <!-- Active Step Card -->
          <div class="p-4 rounded-xl bg-surface-container-lowest/80 border border-primary/30 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-primary uppercase tracking-wider">
                Step ${step.stepNumber} of ${tutorial.steps.length}
              </span>
              <span class="text-[10px] text-on-surface-variant font-terminal-label uppercase">Objective</span>
            </div>
            <p class="text-xs text-on-surface font-medium leading-relaxed">${step.instruction}</p>
            <div class="text-[11px] text-tertiary pt-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">lightbulb</span>
              <span>Hint: ${step.hint}</span>
            </div>
          </div>
        ` : `
          <!-- Completion Card -->
          <div class="p-6 rounded-xl bg-primary/10 border border-primary text-center space-y-2">
            <span class="material-symbols-outlined text-3xl text-primary">verified</span>
            <h3 class="text-base font-bold text-on-surface font-headline-sm">Mission Accomplished!</h3>
            <p class="text-xs text-on-surface-variant">You have completed all objectives for ${tutorial.title}.</p>
          </div>
        `}
      </div>
    `;
  }
}
