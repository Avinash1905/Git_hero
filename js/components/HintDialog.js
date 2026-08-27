/**
 * GitHero Hint Dialog Component
 * Displays contextual level hints and Git concept explanations with keyboard accessibility.
 */

export function renderHintDialog(levelDef, onClose) {
  return `
    <div id="hint-modal-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div class="bg-surface-container-high border border-outline-variant/50 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <div class="flex justify-between items-start mb-4">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-tertiary text-2xl">lightbulb</span>
            <div>
              <h3 class="text-headline-sm font-headline-sm text-on-surface">Level ${levelDef.id} Hint</h3>
              <p class="text-xs font-terminal-code text-primary">${levelDef.gitConcept || 'Git Mechanics'}</p>
            </div>
          </div>
          <button id="hint-close-btn" class="text-on-surface-variant hover:text-on-surface p-1 rounded-lg">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="p-4 bg-surface-container-lowest/80 rounded-lg border border-outline-variant/30 text-on-surface/90 text-sm font-body-md mb-4 leading-relaxed">
          ${levelDef.hint || 'Carefully observe the corridor paths and maneuver the payload box using directional pulls and pushes.'}
        </div>

        <div class="flex justify-between items-center text-xs font-terminal-label text-on-surface-variant">
          <span>Git Command: <code class="text-secondary font-mono">${levelDef.gitConcept || 'git status'}</code></span>
          <button id="hint-ok-btn" class="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold hover:scale-105 transition-transform">
            GOT IT
          </button>
        </div>
      </div>
    </div>
  `;
}
