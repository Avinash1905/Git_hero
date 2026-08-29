/**
 * GitHeroCommandGuide
 * Comprehensive beginner-friendly terminal command manual.
 * Explains basic commands, movement commands, and directional pull interactions.
 */

export const BASIC_COMMANDS = Object.freeze([
  {
    command: 'git status',
    whatItDoes: 'Inspects and displays the current state of the repository: active branch, box staging status, and required commits.',
    whenToUseIt: 'Use at the beginning of every level or after making moves to check which boxes are staged and what objectives remain.',
    simpleExample: 'git status'
  },
  {
    command: 'git push',
    whatItDoes: 'Pushes an adjacent repository box forward by one tile in the direction the operative is currently facing.',
    whenToUseIt: 'Use when you are standing next to a repository box and want to advance it toward a target goal node.',
    simpleExample: 'git push'
  },
  {
    command: 'git pull',
    whatItDoes: 'Pulls an adjacent repository box backward toward your current position by one tile.',
    whenToUseIt: 'Use when a box is against a wall or in a tight corridor and cannot be pushed forward from behind.',
    simpleExample: 'git pull'
  },
  {
    command: 'git commit',
    whatItDoes: 'Finalizes the level by recording an immutable commit once all repository boxes are properly placed on target goal nodes.',
    whenToUseIt: 'Use when git status confirms that all boxes are STAGED on target nodes, triggering the sector victory sequence.',
    simpleExample: 'git commit -m "feat: complete staging"'
  },
  {
    command: 'git switch',
    whatItDoes: 'Switches the active branch context, shifting repository pointers and opening associated security gates or alternate corridors.',
    whenToUseIt: 'Use when encountering locked branch gates or when a multi-branch sector requires working on a feature or hotfix branch.',
    simpleExample: 'git switch feature'
  }
]);

export const MOVEMENT_COMMANDS = Object.freeze([
  {
    command: 'git up',
    whatItDoes: 'Moves your hero operative one tile upward (North) across open floor tiles.',
    whenToUseIt: 'Use when navigating upward or when you prefer precision terminal command movement over keyboard arrow keys.',
    simpleExample: 'git up'
  },
  {
    command: 'git down',
    whatItDoes: 'Moves your hero operative one tile downward (South) across open floor tiles.',
    whenToUseIt: 'Use when navigating downward through sector pathways.',
    simpleExample: 'git down'
  },
  {
    command: 'git left',
    whatItDoes: 'Moves your hero operative one tile to the left (West).',
    whenToUseIt: 'Use when maneuvering left to position yourself relative to obstacles or payload boxes.',
    simpleExample: 'git left'
  },
  {
    command: 'git right',
    whatItDoes: 'Moves your hero operative one tile to the right (East).',
    whenToUseIt: 'Use when navigating right toward corridor exits or boxes.',
    simpleExample: 'git right'
  }
]);

export const DIRECTIONAL_PULL_COMMANDS = Object.freeze([
  {
    command: 'git pull left',
    whatItDoes: 'Directs your operative to pull an adjacent box located to the left toward your position.',
    whenToUseIt: 'Use when you need to extract a box positioned to your left without having to turn or reorient first.',
    simpleExample: 'git pull left'
  },
  {
    command: 'git pull right',
    whatItDoes: 'Directs your operative to pull an adjacent box located to the right toward your position.',
    whenToUseIt: 'Use when extracting a box positioned to your right out of a dead-end niche.',
    simpleExample: 'git pull right'
  },
  {
    command: 'git pull up',
    whatItDoes: 'Directs your operative to pull an adjacent box located directly above (North) downward.',
    whenToUseIt: 'Use when standing below a box and pulling it South into an open staging area.',
    simpleExample: 'git pull up'
  },
  {
    command: 'git pull down',
    whatItDoes: 'Directs your operative to pull an adjacent box located directly below (South) upward.',
    whenToUseIt: 'Use when standing above a box and pulling it North away from an impassable wall.',
    simpleExample: 'git pull down'
  }
]);

export const BEGINNER_EXAMPLE = Object.freeze({
  objective: 'Reach the exit / goal node located two tiles to the right and one tile up.',
  possibleSolution: [
    'git status',
    'git right',
    'git right',
    'git up'
  ],
  explanation: 'The exact commands required always depend on the unique physical layout and obstacle positions of each individual level. This example illustrates how sequential commands inspect status and navigate pathways step by step.'
});

export function renderCommandGuideHtml() {
  const renderCardList = (list, accentColor) => list.map(item => `
    <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs space-y-2">
      <div class="flex items-center justify-between border-b border-outline-variant/20 pb-2">
        <div class="flex items-center gap-2">
          <span class="font-bold text-${accentColor} font-mono text-sm">${item.command}</span>
        </div>
        <span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-terminal-label uppercase">CLI Command</span>
      </div>

      <div class="space-y-1 text-on-surface-variant">
        <div><strong class="text-on-surface">WHAT IT DOES:</strong> ${item.whatItDoes}</div>
        <div><strong class="text-on-surface">WHEN TO USE IT:</strong> ${item.whenToUseIt}</div>
        <div class="pt-1">
          <strong class="text-on-surface">EXAMPLE:</strong>
          <code class="px-2 py-0.5 rounded bg-surface-container-lowest text-${accentColor} font-mono text-xs ml-1 border border-outline-variant/20">${item.simpleExample}</code>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <div class="space-y-6 font-terminal-code text-xs">
      <!-- Section 1: Basic Commands -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-xl">terminal</span>
          <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">Basic GitHero Commands</h3>
        </div>
        <div class="space-y-3">
          ${renderCardList(BASIC_COMMANDS, 'primary')}
        </div>
      </div>

      <!-- Section 2: Movement Commands -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-secondary text-xl">navigation</span>
          <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">Movement Commands</h3>
        </div>
        <div class="space-y-3">
          ${renderCardList(MOVEMENT_COMMANDS, 'secondary')}
        </div>
      </div>

      <!-- Section 3: Directional Pull Commands -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-tertiary text-xl">swap_vert</span>
          <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">Directional Pull Commands</h3>
        </div>
        <div class="space-y-3">
          ${renderCardList(DIRECTIONAL_PULL_COMMANDS, 'tertiary')}
        </div>
      </div>

      <!-- Section 4: Beginner Example -->
      <div class="glass-panel p-5 rounded-xl border border-primary/40 bg-surface-container-high/60 space-y-3">
        <div class="flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">lightbulb</span>
          <h4 class="text-xs font-bold text-on-surface uppercase tracking-wider">Beginner Level Example</h4>
        </div>
        <div class="p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 space-y-2">
          <div class="text-[11px]"><strong class="text-primary">Objective:</strong> ${BEGINNER_EXAMPLE.objective}</div>
          <div class="text-[11px]"><strong class="text-secondary">Possible Command Sequence:</strong></div>
          <div class="bg-surface-container-high/60 p-2.5 rounded font-mono text-[11px] text-on-surface space-y-0.5 border border-outline-variant/10">
            ${BEGINNER_EXAMPLE.possibleSolution.map(cmd => `<div>$ ${cmd}</div>`).join('')}
          </div>
          <p class="text-[10px] text-on-surface-variant/80 italic pt-1">
            ${BEGINNER_EXAMPLE.explanation}
          </p>
        </div>
      </div>
    </div>
  `;
}
