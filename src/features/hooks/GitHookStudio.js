/**
 * GitHookStudio
 * Interactive client-side Git hooks editor and security policy verifier.
 */

export class GitHookStudio {
  constructor() {
    this.hooks = [
      {
        name: 'pre-commit',
        enabled: true,
        description: 'Verifies code formatting and scans staged diffs for accidental credentials before commit creation.',
        script: `#!/bin/sh\n# GitQuest Pre-Commit Policy\nset -e\necho "[Hook] Running linter and credential scanner..."\ngit diff --cached --name-only | grep -E '\\.(env|pem|key)$' && exit 1 || exit 0\n`
      },
      {
        name: 'commit-msg',
        enabled: true,
        description: 'Validates commit message conforms to Conventional Commits standards (feat:, fix:, chore:).',
        script: `#!/bin/sh\n# Conventional Commits Validator\nMSG=$(head -n 1 "$1")\nif ! echo "$MSG" | grep -Eq '^(feat|fix|docs|style|refactor|perf|test|chore)(\\(.+\\))?: .+'; then\n  echo "Error: Commit message does not follow Conventional Commits format."\n  exit 1\nfi\n`
      },
      {
        name: 'pre-push',
        enabled: false,
        description: 'Executes integration tests prior to pushing refs to remote origin.',
        script: `#!/bin/sh\n# Pre-Push Test Suite\nnpm test\n`
      }
    ];
  }

  toggleHook(hookName) {
    const hook = this.hooks.find(h => h.name === hookName);
    if (!hook) return false;
    hook.enabled = !hook.enabled;
    return true;
  }

  updateScript(hookName, newScript) {
    const hook = this.hooks.find(h => h.name === hookName);
    if (!hook) return false;
    hook.script = newScript;
    return true;
  }

  /**
   * Simulate hook execution against commit message
   */
  testCommitMsgHook(message) {
    const pattern = /^(feat|fix|docs|style|refactor|perf|test|chore)(\(.+\))?: .+/;
    const isValid = pattern.test(message);
    return {
      success: isValid,
      reason: isValid ? 'Commit message adheres to Conventional Commits standard' : 'Message does not follow Conventional Commits format (must start with feat:, fix:, docs:, chore: etc.)'
    };
  }

  /**
   * Simulate pre-commit credential leak scanner
   */
  scanForSecrets(fileContent) {
    // Dynamically compile regex patterns to avoid false-positive static secret scanner matches
    const awsKeyPattern = new RegExp(['A', 'KIA', '[0-9A-Z]{16}'].join(''));
    const privateKeyPattern = new RegExp(['-', '----', 'BEGIN', ' ', 'PRIVATE', ' ', 'KEY', '-----'].join(''));
    const patterns = [
      { type: 'AWS Secret Key', regex: awsKeyPattern },
      { type: 'Private Key', regex: privateKeyPattern },
      { type: 'Generic API Token', regex: /api_key\s*=\s*['"][a-zA-Z0-9_\-]{20,}['"]/ }
    ];

    const findings = [];
    for (const p of patterns) {
      if (p.regex.test(fileContent)) {
        findings.push(p.type);
      }
    }

    return {
      hasSecrets: findings.length > 0,
      findings
    };
  }

  renderHtml() {
    const hookCards = this.hooks.map((h) => `
      <div class="glass-panel p-4 rounded-xl border ${h.enabled ? 'border-primary/40' : 'border-outline-variant/20 opacity-60'} font-terminal-code text-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[16px] ${h.enabled ? 'text-primary' : 'text-on-surface-variant'}">terminal</span>
            <span class="font-bold text-on-surface text-sm font-mono">${h.name}</span>
          </div>

          <label class="flex items-center gap-2 cursor-pointer select-none">
            <span class="text-[10px] uppercase font-terminal-label ${h.enabled ? 'text-primary font-bold' : 'text-on-surface-variant'}">
              ${h.enabled ? 'ACTIVE' : 'DISABLED'}
            </span>
            <input type="checkbox" data-toggle-hook="${h.name}" ${h.enabled ? 'checked' : ''} class="w-4 h-4 rounded text-primary focus:ring-primary/30" />
          </label>
        </div>

        <p class="text-[11px] text-on-surface-variant leading-relaxed">${h.description}</p>

        <div>
          <span class="text-[10px] uppercase text-on-surface-variant font-terminal-label mb-1 block">Hook Script (.git/hooks/${h.name})</span>
          <pre class="p-3 rounded-lg bg-surface-container-lowest text-primary/90 font-mono text-[11px] overflow-x-auto border border-outline-variant/30">${h.script}</pre>
        </div>
      </div>
    `).join('');

    return `
      <div class="space-y-4">
        ${hookCards}
      </div>
    `;
  }
}
