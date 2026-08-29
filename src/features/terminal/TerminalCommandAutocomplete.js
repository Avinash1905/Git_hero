/**
 * GitQuest Frontend - Terminal Command Autocomplete
 * Interactive tab completion popup, command syntax helpers,
 * keyboard navigation, and contextual parameter hints.
 */

export class TerminalCommandAutocomplete {
  constructor(dictionary = []) {
    this.dictionary = dictionary.length > 0 ? dictionary : [
      'git status',
      'git push',
      'git pull',
      'git pull left',
      'git pull right',
      'git pull up',
      'git pull down',
      'git left',
      'git right',
      'git up',
      'git down',
      'git commit',
      'git commit -m ""',
      'git switch',
      'git branch',
      'git merge',
      'git rebase',
      'git stash',
      'git stash pop',
      'git cherry-pick',
      'git diff',
      'git log',
      'git tag',
      'git revert',
      'git submodule',
      'git worktree',
      'git bundle',
      'git blame',
      'help',
      'clear',
      'undo',
      'hint'
    ];
    this.selectedIndex = 0;
    this.matchingItems = [];
    this.isOpen = false;
  }

  updateQuery(query) {
    const clean = (query || '').trim().toLowerCase();
    if (!clean) {
      this.matchingItems = [];
      this.isOpen = false;
      return [];
    }

    this.matchingItems = this.dictionary.filter(cmd => cmd.toLowerCase().startsWith(clean));
    this.selectedIndex = 0;
    this.isOpen = this.matchingItems.length > 0;
    return this.matchingItems;
  }

  selectNext() {
    if (this.matchingItems.length > 0) {
      this.selectedIndex = (this.selectedIndex + 1) % this.matchingItems.length;
    }
  }

  selectPrevious() {
    if (this.matchingItems.length > 0) {
      this.selectedIndex = (this.selectedIndex - 1 + this.matchingItems.length) % this.matchingItems.length;
    }
  }

  getSelectedCommand() {
    return this.matchingItems[this.selectedIndex] || null;
  }

  close() {
    this.isOpen = false;
    this.matchingItems = [];
    this.selectedIndex = 0;
  }

  renderPopupHtml() {
    if (!this.isOpen || this.matchingItems.length === 0) return '';

    return `
      <div class="autocomplete-popup" style="position:absolute; bottom:40px; left:20px; background:#0f172a; border:1px solid #38bdf8; border-radius:6px; box-shadow:0 10px 25px rgba(0,0,0,0.5); min-width:220px; z-index:100; overflow:hidden; font-family:monospace; font-size:12px;">
        <div style="background:#1e293b; padding:4px 8px; color:#94a3b8; font-size:10px; font-weight:bold;">SUGGESTED COMMANDS (Tab / Enter)</div>
        ${this.matchingItems.map((cmd, idx) => `
          <div class="autocomplete-item ${idx === this.selectedIndex ? 'selected' : ''}" style="padding:6px 10px; cursor:pointer; color:${idx === this.selectedIndex ? '#38bdf8' : '#cbd5e1'}; background:${idx === this.selectedIndex ? 'rgba(56,189,248,0.15)' : 'transparent'};">
            ${cmd}
          </div>
        `).join('')}
      </div>
    `;
  }
}
