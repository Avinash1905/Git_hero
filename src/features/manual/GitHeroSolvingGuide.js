/**
 * GitHeroSolvingGuide
 * Level-solving pedagogy, 10-step systematic progression process,
 * advanced puzzle strategies, and common mistake mitigation guide.
 */

export const LEVEL_PASSING_STEPS = Object.freeze([
  {
    step: 1,
    title: 'Read the Level Objective',
    description: 'Examine the mission briefing and HUD header to verify required commits, box counts, and target branch goals.'
  },
  {
    step: 2,
    title: 'Inspect the Game Environment',
    description: 'Survey the 2D sector grid layout to understand room connectivity, corridor widths, and open movement lanes.'
  },
  {
    step: 3,
    title: 'Identify Obstacles, Gates, Objects, and the Exit',
    description: 'Pinpoint wall barricades, locked branch gates, repository payload boxes, target goal nodes, and the final exit conduit.'
  },
  {
    step: 4,
    title: 'Use Movement Controls or Movement Commands',
    description: 'Traverse open floor tiles using keyboard arrow keys, touch buttons, or terminal commands (git up/down/left/right).'
  },
  {
    step: 5,
    title: 'Use Terminal Commands When Required',
    description: 'Execute git push to advance boxes, directional git pull to dislodge trapped payloads, and git switch to toggle branch gates.'
  },
  {
    step: 6,
    title: 'Complete All Objectives',
    description: 'Ensure every repository box is accurately aligned with its corresponding goal node until the working tree reaches STAGED status.'
  },
  {
    step: 7,
    title: 'Reach the Level Exit',
    description: 'Navigate your hero operative directly onto the active exit beacon or goal flag.'
  },
  {
    step: 8,
    title: 'Complete the Level',
    description: 'Issue git commit in the terminal or trigger the exit gateway to submit your solution for authoritative verification.'
  },
  {
    step: 9,
    title: 'Receive XP & Star Rewards',
    description: 'Collect your verified experience points, efficiency star rating (1 to 3 stars), and unlocked achievement badges.'
  },
  {
    step: 10,
    title: 'Continue to the Next Unlocked Level',
    description: 'Advance automatically to Sector N+1 in the sequential progression chain.'
  }
]);

export const HARD_LEVEL_TIPS = Object.freeze([
  {
    topic: 'Route Planning & Reverse Engineering',
    tip: 'Work backwards from the target goal nodes to the starting positions of the boxes. Determine the final tile each box must traverse before committing to forward pushes.'
  },
  {
    topic: 'Reading Objectives & Commit Quotas',
    tip: 'Check the top HUD for the required commit quota. Some levels require multiple distinct commits across separate branches to deactivate interlocking laser barriers.'
  },
  {
    topic: 'Frequent Status Checking',
    tip: 'Run git status whenever the board state shifts. It reports which payloads are currently staged and how many unstaged modifications remain.'
  },
  {
    topic: 'Understanding Branch Gates',
    tip: 'Colored security gates respond to branch context. Switching to a feature or hotfix branch (git switch <branch>) reconfigures the circuit matrix to open sealed paths.'
  },
  {
    topic: 'Directional Pull Interactions',
    tip: 'Remember that git pull left, git pull right, git pull up, and git pull down allow extraction of boxes without needing to walk behind them.'
  },
  {
    topic: 'Command & Move Economy',
    tip: 'Avoid executing redundant steps or unnecessary terminal queries. Star ratings depend on keeping total actions beneath the three-star threshold.'
  },
  {
    topic: 'Observing Post-Command State',
    tip: 'After every command execution, carefully observe changes in tile highlights, box positioning, and terminal log feedback before typing the next action.'
  },
  {
    topic: 'Solving Multi-Objective Puzzles',
    tip: 'Decompose complex sectors into isolated sub-problems: first stage corner boxes that restrict movement, then unlock branch gates, and finally position central payloads.'
  }
]);

export const COMMON_MISTAKES = Object.freeze([
  {
    mistake: 'Corner Deadlocks',
    hazard: 'Pushing a repository box flush against two perpendicular walls where it cannot be pushed further.',
    solution: 'Use directional git pull (e.g. git pull left) to pull the box away from the corner before it becomes irretrievably wedged.'
  },
  {
    mistake: 'Premature Commit Execution',
    hazard: 'Typing git commit while one or more boxes are still unstaged on empty floor tiles.',
    solution: 'Always check that the HUD indicates STAGED status and verify via git status before recording a commit.'
  },
  {
    mistake: 'Ignoring Branch Gate States',
    hazard: 'Attempting to walk through locked energy gates without switching to the corresponding branch.',
    solution: 'Inspect the gate color and branch tag, then issue git switch <branch-name> to cycle the power grid.'
  },
  {
    mistake: 'Neglecting Directional Pull Commands',
    hazard: 'Assuming a box against a single flat wall cannot be moved when walking behind it is blocked.',
    solution: 'Stand parallel or adjacent to the box and issue git pull up/down/left/right to slide it along the wall.'
  }
]);

export function renderSolvingGuideHtml() {
  const stepsHtml = LEVEL_PASSING_STEPS.map(item => `
    <div class="glass-panel p-3.5 rounded-xl border border-outline-variant/30 font-terminal-code text-xs flex items-start gap-3">
      <div class="w-6 h-6 rounded-full bg-primary/20 text-primary font-bold font-mono flex items-center justify-center shrink-0 text-[11px] border border-primary/30">
        ${item.step}
      </div>
      <div class="space-y-0.5">
        <div class="font-bold text-on-surface text-xs font-headline-sm uppercase">${item.title}</div>
        <p class="text-on-surface-variant text-[11px] leading-relaxed">${item.description}</p>
      </div>
    </div>
  `).join('');

  const tipsHtml = HARD_LEVEL_TIPS.map(t => `
    <div class="p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20 space-y-1">
      <div class="font-bold text-secondary text-xs flex items-center gap-1.5 font-headline-sm">
        <span class="material-symbols-outlined text-[14px]">psychology</span>
        <span>${t.topic}</span>
      </div>
      <p class="text-[11px] text-on-surface-variant leading-relaxed">${t.tip}</p>
    </div>
  `).join('');

  const mistakesHtml = COMMON_MISTAKES.map(m => `
    <div class="p-3 rounded-xl bg-surface-container-lowest border border-error/20 space-y-1.5 font-terminal-code">
      <div class="flex items-center gap-1.5 text-error font-bold text-xs">
        <span class="material-symbols-outlined text-[15px]">warning</span>
        <span>${m.mistake}</span>
      </div>
      <div class="text-[11px] text-on-surface-variant"><strong class="text-on-surface">Hazard:</strong> ${m.hazard}</div>
      <div class="text-[11px] text-on-surface-variant"><strong class="text-primary">Mitigation:</strong> ${m.solution}</div>
    </div>
  `).join('');

  return `
    <div class="space-y-6 font-terminal-code text-xs">
      <!-- Section 1: 10-Step Solving Process -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl">fact_check</span>
            <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">How to Solve a Level (10-Step Guide)</h3>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-bold font-terminal-label uppercase">Methodology</span>
        </div>
        <p class="text-[11px] text-on-surface-variant leading-relaxed">
          GitHero levels test logical planning and version-control intuition. Follow this 10-step methodology to approach any sector systematically:
        </p>
        <div class="space-y-2">
          ${stepsHtml}
        </div>
      </div>

      <!-- Section 2: Tips for Hard Levels -->
      <div class="glass-panel p-5 rounded-xl border border-secondary/30 space-y-3 bg-surface-container-high/40">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-secondary text-xl">tips_and_updates</span>
            <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">Advanced Tips for Hard Levels</h3>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-secondary/20 text-secondary font-bold font-terminal-label uppercase">Mastery</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${tipsHtml}
        </div>
      </div>

      <!-- Section 3: Common Mistakes -->
      <div class="glass-panel p-5 rounded-xl border border-error/30 space-y-3 bg-surface-container-high/40">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-error text-xl">report_problem</span>
            <h3 class="text-sm font-bold text-on-surface uppercase tracking-wider font-headline-sm">Common Mistakes & Deadlock Prevention</h3>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded bg-error/20 text-error font-bold font-terminal-label uppercase">Deadlocks</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${mistakesHtml}
        </div>
      </div>
    </div>
  `;
}
