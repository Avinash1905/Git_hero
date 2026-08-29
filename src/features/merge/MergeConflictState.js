/**
 * MergeConflictState
 * State machine managing three-way merge hunks, user resolution decisions,
 * and working tree commit readiness.
 */

export class MergeConflictState {
  constructor(conflictData = null) {
    this.baseBranch = conflictData?.baseBranch || 'main';
    this.targetBranch = conflictData?.targetBranch || 'feature/arena-optimization';
    this.filePath = conflictData?.filePath || 'src/engine/topology.js';
    this.hunks = conflictData?.hunks || [];
    this.resolvedCount = 0;
  }

  /**
   * Initialize default conflict hunks
   */
  loadDefaultHunk() {
    this.hunks = [
      {
        id: 'hunk-1',
        lineNumber: 42,
        current: '  const maxVelocity = 12;\n  const damping = 0.85;',
        incoming: '  const maxVelocity = 18;\n  const damping = 0.92;',
        base: '  const maxVelocity = 10;\n  const damping = 0.80;',
        resolution: null // 'CURRENT' | 'INCOMING' | 'BOTH' | 'CUSTOM'
      },
      {
        id: 'hunk-2',
        lineNumber: 88,
        current: '  export function verifyCommitChecksum() {\n    return sha256(workingTree);\n  }',
        incoming: '  export async function verifyCommitChecksum() {\n    return await crypto.subtle.digest("SHA-256", workingTree);\n  }',
        base: '  export function verifyCommitChecksum() {\n    return sha1(workingTree);\n  }',
        resolution: null
      }
    ];
    this.recomputeStatus();
  }

  /**
   * Resolve a specific conflict hunk
   * @param {string} hunkId
   * @param {'CURRENT' | 'INCOMING' | 'BOTH' | 'CUSTOM'} decision
   * @param {string} [customContent]
   */
  resolveHunk(hunkId, decision, customContent = null) {
    const hunk = this.hunks.find(h => h.id === hunkId);
    if (!hunk) return false;

    hunk.resolution = decision;
    if (decision === 'CUSTOM' && customContent !== null) {
      hunk.customContent = customContent;
    }

    this.recomputeStatus();
    return true;
  }

  recomputeStatus() {
    this.resolvedCount = this.hunks.filter(h => h.resolution !== null).length;
  }

  isFullyResolved() {
    return this.hunks.length > 0 && this.resolvedCount === this.hunks.length;
  }

  generateResolvedFile() {
    if (!this.isFullyResolved()) return null;

    let output = `// Resolved 3-Way Merge: ${this.baseBranch} <- ${this.targetBranch}\n`;
    for (const h of this.hunks) {
      output += `\n// --- Hunk at line ${h.lineNumber} ---\n`;
      if (h.resolution === 'CURRENT') {
        output += h.current;
      } else if (h.resolution === 'INCOMING') {
        output += h.incoming;
      } else if (h.resolution === 'BOTH') {
        output += `${h.current}\n${h.incoming}`;
      } else if (h.resolution === 'CUSTOM') {
        output += h.customContent || '';
      }
    }
    return output;
  }
}
