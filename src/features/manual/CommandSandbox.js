/**
 * CommandSandbox
 * Interactive Git laboratory allowing developers to experiment with branch topologies,
 * merges, cherry-picks, and inspect real-time Directed Acyclic Graph updates.
 */

import { InteractiveGitDag } from './InteractiveGitDag.js';

export class CommandSandbox {
  constructor(containerId) {
    this.containerId = containerId;
    this.dag = new InteractiveGitDag(containerId);
    this.branches = new Map([
      ['main', { name: 'main', tip: 'c1' }]
    ]);
    this.commits = [
      { hash: 'c1', message: 'Initial commit', parents: [], branch: 'main', isHead: true }
    ];
    this.currentBranch = 'main';
    this.headCommit = 'c1';
    this.counter = 2;
  }

  /**
   * Initialize sandbox state
   */
  init() {
    this.dag.setCommits(this.commits);
  }

  /**
   * Execute command inside sandbox
   * @param {string} rawCommand
   * @returns {{success: boolean, message: string, dagHtml: string}}
   */
  execute(rawCommand) {
    const trimmed = String(rawCommand || '').trim();
    const parts = trimmed.split(' ');
    const verb = parts[0]?.toLowerCase();
    const sub = parts[1]?.toLowerCase();
    const arg = parts[2];

    if (verb !== 'git') {
      return { success: false, message: 'Only git commands permitted in sandbox', dagHtml: this.render() };
    }

    if (sub === 'commit') {
      const newHash = `c${this.counter++}`;
      const newCommit = {
        hash: newHash,
        message: arg || `Commit on ${this.currentBranch}`,
        parents: [this.headCommit],
        branch: this.currentBranch,
        isHead: true
      };

      // Unset previous head
      for (const c of this.commits) {
        c.isHead = false;
      }

      this.commits.push(newCommit);
      this.headCommit = newHash;
      this.branches.set(this.currentBranch, { name: this.currentBranch, tip: newHash });
      this.dag.setCommits(this.commits);

      return {
        success: true,
        message: `[${this.currentBranch} ${newHash}] ${newCommit.message}`,
        dagHtml: this.render()
      };
    }

    if (sub === 'branch' && arg) {
      if (this.branches.has(arg)) {
        return { success: false, message: `fatal: branch named '${arg}' already exists`, dagHtml: this.render() };
      }
      this.branches.set(arg, { name: arg, tip: this.headCommit });
      return { success: true, message: `Branch '${arg}' created at ${this.headCommit}`, dagHtml: this.render() };
    }

    if (sub === 'switch' || sub === 'checkout') {
      if (!arg) {
        return { success: false, message: 'Please specify target branch', dagHtml: this.render() };
      }
      if (!this.branches.has(arg)) {
        return { success: false, message: `fatal: invalid reference '${arg}'`, dagHtml: this.render() };
      }

      this.currentBranch = arg;
      this.headCommit = this.branches.get(arg).tip;

      for (const c of this.commits) {
        c.isHead = c.hash === this.headCommit;
      }
      this.dag.setCommits(this.commits);

      return { success: true, message: `Switched to branch '${arg}'`, dagHtml: this.render() };
    }

    if (sub === 'status') {
      return {
        success: true,
        message: `On branch ${this.currentBranch}\nHEAD at ${this.headCommit}\nNothing to commit, working tree clean`,
        dagHtml: this.render()
      };
    }

    return {
      success: true,
      message: `Executed: ${trimmed}`,
      dagHtml: this.render()
    };
  }

  render() {
    return this.dag.renderSvg();
  }

  reset() {
    this.branches = new Map([['main', { name: 'main', tip: 'c1' }]]);
    this.commits = [{ hash: 'c1', message: 'Initial commit', parents: [], branch: 'main', isHead: true }];
    this.currentBranch = 'main';
    this.headCommit = 'c1';
    this.counter = 2;
    this.dag.setCommits(this.commits);
  }
}
