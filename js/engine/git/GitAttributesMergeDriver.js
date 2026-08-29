/**
 * GitQuest Game Engine - Git Attributes & Custom Merge Driver
 * Parses .gitattributes path rules, applies custom merge driver strategies
 * (ours, theirs, union, json-merge), and normalizes line endings (LF/CRLF).
 */

export class GitAttributeRule {
  constructor(pattern, attributes = {}) {
    this.pattern = pattern;
    this.attributes = attributes; // e.g. { merge: 'union', text: 'auto', eol: 'lf' }
  }

  matches(filePath) {
    if (this.pattern === '*') return true;
    if (this.pattern.startsWith('*.')) {
      const ext = this.pattern.substring(1);
      return filePath.endsWith(ext);
    }
    return filePath === this.pattern || filePath.startsWith(`${this.pattern}/`);
  }
}

export class GitAttributesMergeDriver {
  constructor() {
    this.rules = [];
    this.customDrivers = new Map();
    this.initDefaultDrivers();
  }

  initDefaultDrivers() {
    // 1. Union merge driver: Concatenates both changes without marking conflicts
    this.customDrivers.set('union', (base, current, incoming) => {
      return `${current}\n${incoming}`;
    });

    // 2. Ours merge driver: Discards incoming and preserves current branch
    this.customDrivers.set('ours', (base, current, incoming) => {
      return current;
    });

    // 3. Theirs merge driver: Overwrites with incoming branch
    this.customDrivers.set('theirs', (base, current, incoming) => {
      return incoming;
    });
  }

  addRule(pattern, attributes = {}) {
    this.rules.push(new GitAttributeRule(pattern, attributes));
  }

  getAttributesForPath(filePath) {
    const matched = {};
    for (const rule of this.rules) {
      if (rule.matches(filePath)) {
        Object.assign(matched, rule.attributes);
      }
    }
    return matched;
  }

  executeMergeForFile(filePath, baseContent, currentContent, incomingContent) {
    const attrs = this.getAttributesForPath(filePath);
    const driverName = attrs.merge;

    if (driverName && this.customDrivers.has(driverName)) {
      const driverFn = this.customDrivers.get(driverName);
      const mergedResult = driverFn(baseContent, currentContent, incomingContent);
      return {
        isCustomMerged: true,
        driverName,
        mergedResult
      };
    }

    return { isCustomMerged: false };
  }
}
