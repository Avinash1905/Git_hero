/**
 * GitIgnoreManager
 * Evaluates repository file paths against .gitignore glob pattern hierarchies.
 */

export class GitIgnoreManager {
  constructor() {
    this.patterns = [
      { pattern: 'node_modules/', category: 'Dependencies', description: 'Third-party package dependency directories' },
      { pattern: 'dist/', category: 'Build Artifacts', description: 'Compiled production bundles' },
      { pattern: '*.log', category: 'Runtime Logs', description: 'Server and client telemetry logs' },
      { pattern: '.env*', category: 'Environment Secrets', description: 'Sensitive environment variables and API keys' },
      { pattern: '.DS_Store', category: 'OS Metadata', description: 'macOS Finder spatial metadata files' },
      { pattern: 'Thumbs.db', category: 'OS Metadata', description: 'Windows thumbnail cache files' }
    ];
  }

  isPathIgnored(filePath) {
    const clean = filePath.replace(/\\/g, '/');

    for (const p of this.patterns) {
      const pat = p.pattern;
      if (pat.endsWith('/') && clean.startsWith(pat)) return true;
      if (pat.startsWith('*.') && clean.endsWith(pat.substring(1))) return true;
      if (pat.endsWith('*') && clean.includes(pat.slice(0, -1))) return true;
      if (clean === pat) return true;
    }
    return false;
  }

  addPattern(pattern, category = 'Custom', description = '') {
    this.patterns.push({ pattern, category, description });
    return true;
  }

  renderHtml() {
    const patternRows = this.patterns.map((p) => `
      <div class="glass-panel p-3.5 rounded-xl border border-outline-variant/30 font-terminal-code text-xs flex items-center justify-between gap-3">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <span class="text-error font-bold font-mono text-sm">${p.pattern}</span>
            <span class="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant font-terminal-label uppercase">${p.category}</span>
          </div>
          <p class="text-[11px] text-on-surface-variant">${p.description}</p>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4 font-terminal-code text-xs">
        <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-error text-xl">visibility_off</span>
            <div>
              <span class="font-bold text-on-surface text-sm">Active .gitignore Directives</span>
              <div class="text-[10px] text-on-surface-variant">${this.patterns.length} compiled exclusion patterns</div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          ${patternRows}
        </div>
      </div>
    `;
  }
}
