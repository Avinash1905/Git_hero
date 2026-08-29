/**
 * GitQuest Game Engine - Git Sparse-Checkout Engine
 * Cone mode pattern compiler, path inclusion filter, file tree pruning,
 * and working directory disk savings calculator.
 */

export class GitSparseCheckoutEngine {
  constructor(isConeMode = true) {
    this.isConeMode = isConeMode;
    this.patterns = new Set(['/*']); // Root files by default
    this.includedDirectories = new Set();
  }

  enableConeMode() {
    this.isConeMode = true;
    this.patterns.clear();
    this.patterns.add('/*');
    this.includedDirectories.clear();
  }

  addConePath(dirPath) {
    const clean = dirPath.replace(/^\/+|\/+$/g, '');
    this.includedDirectories.add(clean);
    this.patterns.add(`/${clean}/*`);
    this.patterns.add(`/${clean}/**`);
  }

  removeConePath(dirPath) {
    const clean = dirPath.replace(/^\/+|\/+$/g, '');
    this.includedDirectories.delete(clean);
    this.patterns.delete(`/${clean}/*`);
    this.patterns.delete(`/${clean}/**`);
  }

  isPathIncluded(filePath) {
    const clean = filePath.replace(/^\/+/, '');
    if (!clean.includes('/')) return true; // Root files always included

    for (const dir of this.includedDirectories) {
      if (clean === dir || clean.startsWith(`${dir}/`)) {
        return true;
      }
    }

    return false;
  }

  filterTree(allFilePaths = []) {
    return allFilePaths.filter(p => this.isPathIncluded(p));
  }

  calculateDiskSavings(allFilesWithSizes = []) {
    let totalBytes = 0;
    let includedBytes = 0;

    for (const item of allFilesWithSizes) {
      totalBytes += item.size;
      if (this.isPathIncluded(item.path)) {
        includedBytes += item.size;
      }
    }

    const savedBytes = totalBytes - includedBytes;
    const savingsPercent = totalBytes > 0 ? ((savedBytes / totalBytes) * 100).toFixed(1) : 0;

    return {
      totalBytes,
      includedBytes,
      savedBytes,
      savingsPercent: `${savingsPercent}%`
    };
  }
}
