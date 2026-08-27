/**
 * GitQuest Engine - Pressure Bridge & Multi-Sig Token Matrix
 * Dynamic retractable bridges over void chasms and multi-signature GPG authentication gates.
 */

import { Vector2D } from '../../core/Types.js';

export class RetractableBridge {
  constructor(id, tiles = [], isExtended = false) {
    this.id = id;
    this.tiles = tiles.map(t => Vector2D.from(t)); // array of bridge tile coords
    this.isExtended = isExtended;
  }

  extend(tileMap) {
    this.isExtended = true;
    for (const t of this.tiles) {
      tileMap.setTile(t.x, t.y, 'floor');
    }
  }

  retract(tileMap) {
    this.isExtended = false;
    for (const t of this.tiles) {
      tileMap.setTile(t.x, t.y, 'void');
    }
  }
}

export class PressureBridgeMechanism {
  constructor(plateId, bridge) {
    this.plateId = plateId;
    this.bridge = bridge;
  }

  evaluate(entityManager, tileMap) {
    const plate = entityManager?.get(this.plateId);
    if (!plate) return;

    if (plate.isPressed && !this.bridge.isExtended) {
      this.bridge.extend(tileMap);
    } else if (!plate.isPressed && this.bridge.isExtended) {
      this.bridge.retract(tileMap);
    }
  }
}

export class MultiSigAuthGate {
  constructor(id, requiredKeyIds = [], targetDoorId) {
    this.id = id;
    this.requiredKeyIds = new Set(requiredKeyIds);
    this.collectedKeys = new Set();
    this.targetDoorId = targetDoorId;
    this.isUnlocked = false;
  }

  submitKey(keyId) {
    if (this.requiredKeyIds.has(keyId)) {
      this.collectedKeys.add(keyId);
    }
    return this.evaluate();
  }

  evaluate() {
    if (this.collectedKeys.size === this.requiredKeyIds.size) {
      this.isUnlocked = true;
      return true;
    }
    return false;
  }
}
