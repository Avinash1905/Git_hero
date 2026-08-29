/**
 * GitQuest Engine - Git Config & Filter-Branch Engines
 * Hierarchical .git/config parser, section namespaces, and history rewriting engine.
 */

export class GitConfigEngine {
  constructor() {
    this.sections = new Map(); // "section.subsection" -> Map<key, value>
    this._initDefaults();
  }

  _initDefaults() {
    this.set('core.repositoryformatversion', '0');
    this.set('core.filemode', 'false');
    this.set('core.bare', 'false');
    this.set('core.logallrefupdates', 'true');
    this.set('user.name', 'GitQuest Player');
    this.set('user.email', 'player@gitquest.dev');
    this.set('alias.st', 'status');
    this.set('alias.co', 'checkout');
    this.set('alias.ci', 'commit');
  }

  get(path) {
    const parts = path.split('.');
    const key = parts.pop();
    const section = parts.join('.');
    return this.sections.get(section)?.get(key) || null;
  }

  set(path, value) {
    const parts = path.split('.');
    const key = parts.pop();
    const section = parts.join('.');

    if (!this.sections.has(section)) {
      this.sections.set(section, new Map());
    }
    this.sections.get(section).set(key, String(value));
  }

  has(path) {
    return this.get(path) !== null;
  }

  serializeINI() {
    const lines = [];
    for (const [section, keys] of this.sections.entries()) {
      lines.push(`[${section}]`);
      for (const [k, v] of keys.entries()) {
        lines.push(`\t${k} = ${v}`);
      }
    }
    return lines.join('\n');
  }
}

export class GitFilterBranchEngine {
  static rewriteAuthor(repo, oldAuthor, newAuthor) {
    const rewritten = [];
    for (const [hash, obj] of repo.objects.entries()) {
      if (obj.type === 'commit' && obj.author && obj.author.includes(oldAuthor)) {
        obj.author = newAuthor;
        obj.committer = newAuthor;
        rewritten.push(hash);
      }
    }
    return rewritten;
  }

  static filterTree(repo, prunePathPredicate) {
    const modifiedTrees = [];
    for (const [hash, obj] of repo.objects.entries()) {
      if (obj.type === 'tree' && obj.entries) {
        const origLen = obj.entries.length;
        obj.entries = obj.entries.filter(e => !prunePathPredicate(e.name));
        if (obj.entries.length !== origLen) {
          modifiedTrees.push(hash);
        }
      }
    }
    return modifiedTrees;
  }
}
