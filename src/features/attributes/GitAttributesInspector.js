/**
 * GitAttributesInspector
 * Path-specific attributes inspector (.gitattributes) managing line-ending normalization and diff drivers.
 */

export class GitAttributesInspector {
  constructor() {
    this.attributes = [
      { pattern: '*.js', attrs: 'text eol=lf diff=javascript' },
      { pattern: '*.png', attrs: 'binary' },
      { pattern: '*.db', attrs: 'binary -diff' },
      { pattern: 'docs/*', attrs: 'text eol=lf' }
    ];
  }

  generateGitattributesContent() {
    return this.attributes.map(a => `${a.pattern.padEnd(20)} ${a.attrs}`).join('\n');
  }

  renderHtml() {
    return `
      <div class="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 space-y-3 font-mono text-xs">
        <div class="flex items-center justify-between border-b border-outline-variant/10 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">rule</span>
            <span class="font-bold text-on-surface uppercase tracking-wider">Git Attributes (.gitattributes)</span>
          </div>
        </div>
        <pre class="p-3 rounded-xl bg-surface-container-lowest text-primary/90 font-mono text-[11px] overflow-x-auto border border-outline-variant/20">${this.generateGitattributesContent()}</pre>
      </div>
    `;
  }
}

export const gitAttributesInspector = new GitAttributesInspector();
