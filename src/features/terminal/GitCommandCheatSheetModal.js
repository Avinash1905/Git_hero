/**
 * GitQuest Frontend - Git Command Cheat Sheet & Shortcut Modal
 * Comprehensive reference guide for all supported Git commands, movement syntax,
 * directional pull mechanics, flags, and quick copyable snippets.
 */

export const CHEATSHEET_CATEGORIES = [
  {
    category: 'Core Gameplay & Movement',
    commands: [
      { cmd: 'git left / right / up / down', desc: 'Move avatar 1 tile in specified direction' },
      { cmd: 'git push', desc: 'Push payload box forward into open path' },
      { cmd: 'git pull', desc: 'Pull payload box toward player position' },
      { cmd: 'git pull left / right / up / down', desc: 'Pull adjacent object in specified direction toward player' }
    ]
  },
  {
    category: 'Branching & Switching',
    commands: [
      { cmd: 'git status', desc: 'Check active branch, payload staging status, and objectives' },
      { cmd: 'git commit -m "<msg>"', desc: 'Commit staged changes and complete solved level' },
      { cmd: 'git switch <level_id>', desc: 'Switch active level context (e.g. git switch 08)' },
      { cmd: 'git branch <name>', desc: 'Create a new feature branch' }
    ]
  },
  {
    category: 'Advanced Git Workflows',
    commands: [
      { cmd: 'git merge <branch>', desc: 'Fast-forward or 3-way merge target branch into HEAD' },
      { cmd: 'git rebase <upstream>', desc: 'Rebase current feature commits on top of upstream' },
      { cmd: 'git stash / git stash pop', desc: 'Temporarily stash payload state / restore stashed payload' },
      { cmd: 'git cherry-pick <hash>', desc: 'Apply specific commit delta to active branch' },
      { cmd: 'git diff', desc: 'Inspect uncommitted coordinate deltas' },
      { cmd: 'git log', desc: 'View commit DAG history' },
      { cmd: 'git tag -a <tag>', desc: 'Create annotated milestone tag' }
    ]
  },
  {
    category: 'Utilities & Controls',
    commands: [
      { cmd: 'undo', desc: 'Revert last movement, push, or pull action' },
      { cmd: 'clear', desc: 'Clear terminal output screen' },
      { cmd: 'hint', desc: 'Display level solving hint' },
      { cmd: 'help', desc: 'Show brief command help summary' }
    ]
  }
];

export class GitCommandCheatSheetModal {
  renderModalHtml() {
    return `
      <div class="cheatsheet-modal" style="background:#090d16; color:#e2e8f0; padding:24px; border-radius:12px; border:1px solid rgba(56,189,248,0.3); max-width:680px; max-height:85vh; overflow-y:auto; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #1e293b; padding-bottom:12px;">
          <div>
            <h3 style="margin:0; font-size:18px; color:#38bdf8;">📖 GitQuest Command & Movement Cheat Sheet</h3>
            <span style="font-size:11px; color:#94a3b8;">Quick reference for Git commands and mechanics</span>
          </div>
          <span style="font-size:11px; color:#64748b;">Press ESC to close</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:16px;">
          ${CHEATSHEET_CATEGORIES.map(cat => `
            <div>
              <h4 style="margin:0 0 8px 0; font-size:13px; color:#fcd34d; font-weight:bold;">${cat.category}</h4>
              <div style="display:flex; flex-direction:column; gap:6px;">
                ${cat.commands.map(c => `
                  <div style="background:#0f172a; border:1px solid #1e293b; padding:8px 12px; border-radius:6px; display:flex; justify-content:space-between; align-items:center; font-size:11px;">
                    <code style="color:#38bdf8; font-weight:bold; font-family:monospace;">${c.cmd}</code>
                    <span style="color:#94a3b8;">${c.desc}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
}
