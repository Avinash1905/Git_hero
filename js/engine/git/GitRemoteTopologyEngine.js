/**
 * GitQuest Game Engine - Git Remote Topology Engine
 * Manages multiple remotes (`git remote add`, `git remote -v`, `git remote rename`),
 * refspec mapping rules, fetch/push tracking branches, and remote URL credentials.
 */

export class RemoteRecord {
  constructor(name, fetchUrl, pushUrl = null, fetchRefspec = '+refs/heads/*:refs/remotes/origin/*') {
    this.name = name;
    this.fetchUrl = fetchUrl;
    this.pushUrl = pushUrl || fetchUrl;
    this.fetchRefspec = fetchRefspec;
    this.isDefault = name === 'origin';
  }
}

export class GitRemoteTopologyEngine {
  constructor() {
    this.remotes = new Map();
    this.initDefaultRemotes();
  }

  initDefaultRemotes() {
    this.addRemote('origin', 'https://github.com/gitquest/core-realm.git');
    this.addRemote('upstream', 'https://github.com/git-foundation/canonical.git');
  }

  addRemote(name, fetchUrl, pushUrl = null) {
    const clean = name.trim();
    if (this.remotes.has(clean)) {
      return { success: false, reason: `Remote '${clean}' already exists.` };
    }

    const rec = new RemoteRecord(clean, fetchUrl, pushUrl);
    this.remotes.set(clean, rec);

    return {
      success: true,
      remote: rec,
      message: `Added remote '${clean}' (${fetchUrl})`
    };
  }

  removeRemote(name) {
    const clean = name.trim();
    if (!this.remotes.has(clean)) {
      return { success: false, reason: `Remote '${clean}' not found.` };
    }

    const deleted = this.remotes.get(clean);
    this.remotes.delete(clean);

    return {
      success: true,
      deletedRemote: deleted,
      message: `Removed remote '${clean}'`
    };
  }

  getRemote(name) {
    return this.remotes.get(name) || null;
  }

  listRemotes() {
    return Array.from(this.remotes.values());
  }

  formatRemoteVerbose() {
    const lines = [];
    for (const r of this.remotes.values()) {
      lines.push(`${r.name}\t${r.fetchUrl} (fetch)`);
      lines.push(`${r.name}\t${r.pushUrl} (push)`);
    }
    return lines.join('\n');
  }
}
