/**
 * GitQuest Engine - Level Blueprints & Chamber Archetypes
 * Reusable handcrafted architectural chamber blueprints: Security Vaults, Laser Relays,
 * Quantum Rifts, Staging Corridors, CI Drone Patrol Loops, and Hydraulic Elevator Shafts.
 */

import { BoundingBox, Vector2D } from '../../core/Types.js';

export const BlueprintArchetype = Object.freeze({
  STAGING_CHAMBER: 'staging_chamber',
  SECURITY_VAULT: 'security_vault',
  LASER_LABORATORY: 'laser_laboratory',
  QUANTUM_RIFT: 'quantum_rift',
  PATROL_CORRIDOR: 'patrol_corridor',
  HYDRAULIC_SHAFT: 'hydraulic_shaft'
});

export class ChamberBlueprint {
  constructor(id, archetype, bounds, options = {}) {
    this.id = id;
    this.archetype = archetype;
    this.bounds = bounds instanceof BoundingBox ? bounds : new BoundingBox(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
    this.walls = (options.walls || []).map(w => Vector2D.from(w));
    this.doors = options.doors || [];
    this.switches = options.switches || [];
    this.lasers = options.lasers || [];
    this.conveyors = options.conveyors || [];
    this.spawnPoint = options.spawnPoint ? Vector2D.from(options.spawnPoint) : null;
    this.goalPoint = options.goalPoint ? Vector2D.from(options.goalPoint) : null;
  }

  applyToTileMap(tileMap) {
    // Carve room floor
    tileMap.fillRect(this.bounds.minX, this.bounds.minY, this.bounds.maxX, this.bounds.maxY, 'floor');

    // Place interior walls
    for (const w of this.walls) {
      tileMap.setTile(w.x, w.y, 'wall');
    }
  }
}

export class LevelBlueprintCatalog {
  static createStagingChamber(id, originX, originY, width = 8, height = 8) {
    return new ChamberBlueprint(id, BlueprintArchetype.STAGING_CHAMBER, {
      minX: originX,
      minY: originY,
      maxX: originX + width - 1,
      maxY: originY + height - 1
    }, {
      spawnPoint: { x: originX + 1, y: originY + 1 },
      goalPoint: { x: originX + width - 2, y: originY + height - 2 },
      walls: [
        { x: originX + Math.floor(width / 2), y: originY + 2 },
        { x: originX + Math.floor(width / 2), y: originY + height - 3 }
      ]
    });
  }

  static createSecurityVault(id, originX, originY, width = 10, height = 10) {
    return new ChamberBlueprint(id, BlueprintArchetype.SECURITY_VAULT, {
      minX: originX,
      minY: originY,
      maxX: originX + width - 1,
      maxY: originY + height - 1
    }, {
      doors: [{ id: `${id}_door`, x: originX + Math.floor(width / 2), y: originY + height - 1, isLocked: true }],
      switches: [{ id: `${id}_plate`, x: originX + 2, y: originY + 2 }]
    });
  }

  static createLaserLaboratory(id, originX, originY, width = 12, height = 12) {
    return new ChamberBlueprint(id, BlueprintArchetype.LASER_LABORATORY, {
      minX: originX,
      minY: originY,
      maxX: originX + width - 1,
      maxY: originY + height - 1
    }, {
      lasers: [{ from: { x: originX + 1, y: originY + 6 }, dir: 'right' }]
    });
  }
}
