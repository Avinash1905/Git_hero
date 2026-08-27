/**
 * GitHero World Engine
 * Manages spatial grid geometry, walls, interactive gates, switches, and boundary lookups.
 */

import { GateMechanism } from './mechanics/GateMechanism.js';
import { HazardMechanism } from './mechanics/HazardMechanism.js';

export class WorldEngine {
  constructor(levelDef) {
    this.levelDef = levelDef;
    this.gridSize = levelDef.gridSize || 6;
    this.walls = levelDef.walls ? [...levelDef.walls] : [];
    this.gates = levelDef.gates ? [...levelDef.gates] : [];
    this.switches = levelDef.switches ? [...levelDef.switches] : [];
    this.hazards = levelDef.hazards ? [...levelDef.hazards] : [];
    this.checkpoints = levelDef.checkpoints ? [...levelDef.checkpoints] : [];
  }

  isBlocked(x, y) {
    // Check bounds
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) {
      return true;
    }

    // Check static walls
    const hitWall = this.walls.some(w => w.x === x && w.y === y);
    if (hitWall) return true;

    // Check closed gates
    const hitClosedGate = this.gates.some(g => g.x === x && g.y === y && !g.isOpen);
    if (hitClosedGate) return true;

    return false;
  }

  evaluateSwitches(gameState) {
    if (!this.switches.length || !this.gates.length) return;

    this.gates = GateMechanism.evaluateGates(
      this.switches,
      this.gates,
      gameState.player,
      gameState.box
    );
  }

  checkHazard(playerPos) {
    return HazardMechanism.checkHazardCollision(playerPos, this.hazards);
  }

  isDeadlocked(boxPos) {
    return HazardMechanism.isBoxInDeadlock(boxPos, this.walls, this.gridSize);
  }
}
