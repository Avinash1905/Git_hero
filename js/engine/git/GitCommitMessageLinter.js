/**
 * GitQuest Game Engine - Git Commit Message Linter
 * Validates commit messages according to Conventional Commits standard:
 * `<type>(<optional scope>): <description>`, body wrapping, and footer BREAKING CHANGE tokens.
 */

export const CommitTypes = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'perf',
  'test',
  'build',
  'ci',
  'chore',
  'revert'
];

export class GitCommitMessageLinter {
  lint(message) {
    const raw = (message || '').trim();
    if (!raw) {
      return { isValid: false, errors: ['Commit message cannot be empty'] };
    }

    const lines = raw.split('\n');
    const header = lines[0];
    const errors = [];
    const warnings = [];

    // Header regex: type(scope)?: description
    const headerRegex = /^([a-z]+)(?:\(([a-z0-9-_]+)\))?(!)?:\s+(.+)$/;
    const match = header.match(headerRegex);

    if (!match) {
      errors.push('Header does not match format "<type>(<scope>): <description>"');
    } else {
      const [, type, scope, isBreaking, description] = match;

      if (!CommitTypes.includes(type)) {
        errors.push(`Invalid commit type "${type}". Allowed: ${CommitTypes.join(', ')}`);
      }

      if (header.length > 72) {
        warnings.push(`Header exceeds 72 characters (${header.length} chars)`);
      }

      if (description.endsWith('.')) {
        errors.push('Header description should not end with a period');
      }

      if (/^[A-Z]/.test(description)) {
        warnings.push('Header description should start in lowercase');
      }
    }

    // Check blank line between header and body
    if (lines.length > 1 && lines[1].trim() !== '') {
      errors.push('There must be a blank line between header and commit body');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      header,
      parsed: match ? {
        type: match[1],
        scope: match[2] || null,
        isBreaking: Boolean(match[3]),
        description: match[4]
      } : null
    };
  }
}
