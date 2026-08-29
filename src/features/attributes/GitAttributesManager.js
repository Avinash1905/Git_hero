/**
 * GitAttributesManager
 * Manages path-specific attributes (.gitattributes) for line ending normalization,
 * custom diff drivers, smudge/clean filters, and export-ignore directives.
 */

export class GitAttributesManager {
  constructor() {
    this.attributes = [
      { pattern: '*', attribute: 'text=auto', category: 'End of Line', description: 'Auto-detect text files and normalize line endings to LF on commit.' },
      { pattern: '*.sh', attribute: 'text eol=lf', category: 'End of Line', description: 'Ensure POSIX shell scripts always checkout and commit with LF.' },
      { pattern: '*.bat', attribute: 'text eol=crlf', category: 'End of Line', description: 'Ensure Windows batch scripts always checkout with CRLF.' },
      { pattern: '*.png', attribute: 'binary', category: 'Binary Data', description: 'Treat PNG images as binary blobs; disable text delta diffing.' },
      { pattern: 'tests/', attribute: 'export-ignore', category: 'Archive Directives', description: 'Omit test suites when generating production release archives via git archive.' }
    ];
  }

  addAttribute(pattern, attribute, category = 'Custom', description = '') {
    this.attributes.push({ pattern, attribute, category, description });
    return true;
  }

  removeAttribute(pattern) {
    const initLen = this.attributes.length;
    this.attributes = this.attributes.filter(a => a.pattern !== pattern);
    return this.attributes.length < initLen;
  }

  renderHtml() {
    const rows = this.attributes.map((a) => `
      <div class="glass-panel p-4 rounded-xl border border-outline-variant/30 font-terminal-code text-xs space-y-1.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-primary font-mono text-sm">${a.pattern}</span>
            <span class="font-mono text-on-surface bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/20">${a.attribute}</span>
          </div>
          <span class="text-[10px] px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface-variant uppercase font-terminal-label">${a.category}</span>
        </div>
        <p class="text-[11px] text-on-surface-variant leading-relaxed">${a.description}</p>
      </div>
    `).join('');

    return `
      <div class="space-y-4 font-terminal-code text-xs">
        ${rows}
      </div>
    `;
  }
}
