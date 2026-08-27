/**
 * GitQuest Engine - Merge Conflict Hunk Editor & Clone Branch Phantom Engine
 * In-world 3-way conflict resolution switches (ours, theirs, union) and synchronized clone phantoms for dual-switch puzzles.
 */

export class ConflictHunk {
  constructor(id, oursContent, theirsContent, baseContent = '') {
    this.id = id;
    this.ours = oursContent;
    this.theirs = theirsContent;
    this.base = baseContent;
    this.selectedChoice = null; // 'ours' | 'theirs' | 'union'
    this.isResolved = false;
  }

  resolve(choice) {
    if (choice === 'ours' || choice === 'theirs' || choice === 'union') {
      this.selectedChoice = choice;
      this.isResolved = true;
      return true;
    }
    return false;
  }
}

export class MergeConflictHunkEditor {
  constructor(doorToUnlockId) {
    this.hunks = new Map(); // hunkId -> ConflictHunk
    this.doorToUnlockId = doorToUnlockId;
  }

  addHunk(id, ours, theirs, base = '') {
    const hunk = new ConflictHunk(id, ours, theirs, base);
    this.hunks.set(id, hunk);
    return hunk;
  }

  resolveHunk(id, choice) {
    const hunk = this.hunks.get(id);
    if (!hunk) return false;
    return hunk.resolve(choice);
  }

  isAllResolved() {
    for (const hunk of this.hunks.values()) {
      if (!hunk.isResolved) return false;
    }
    return true;
  }

  evaluate(entityManager) {
    if (this.isAllResolved() && this.doorToUnlockId) {
      const door = entityManager.get(this.doorToUnlockId);
      if (door) {
        door.open();
        return true;
      }
    }
    return false;
  }
}

export class CloneBranchPhantom {
  constructor(id, x, y, mirrorAxis = 'none') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.mirrorAxis = mirrorAxis; // 'none' | 'x' | 'y' | 'both'
    this.active = true;
  }

  calculateMovement(dx, dy) {
    let cloneDx = dx;
    let cloneDy = dy;

    if (this.mirrorAxis === 'x' || this.mirrorAxis === 'both') {
      cloneDx = -dx;
    }
    if (this.mirrorAxis === 'y' || this.mirrorAxis === 'both') {
      cloneDy = -dy;
    }

    return {
      targetX: this.x + cloneDx,
      targetY: this.y + cloneDy
    };
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class CloneBranchPhantomEngine {
  constructor(world, entityManager) {
    this.world = world;
    this.entityManager = entityManager;
    this.phantoms = new Map(); // id -> CloneBranchPhantom
  }

  registerPhantom(phantom) {
    this.phantoms.set(phantom.id, phantom);
  }

  step(dx, dy) {
    for (const phantom of this.phantoms.values()) {
      if (!phantom.active) continue;

      const target = phantom.calculateMovement(dx, dy);
      if (this.world.isWalkable(target.targetX, target.targetY, phantom)) {
        phantom.setPosition(target.targetX, target.targetY);
      }
    }
  }
}
