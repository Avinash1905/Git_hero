/**
 * GitQuest Game Engine: Advanced Puzzle Engines (Circuits, Optics, Quantum, Portals, Deadlocks)
 */

export class CircuitEngine {
  constructor() {
    this.gates = new Map(); // id -> { type, inputs: [], state: boolean }
    this.wires = new Map(); // wireId -> boolean
  }

  registerGate(id, type, inputs = []) {
    this.gates.set(id, { type: type.toUpperCase(), inputs, state: false });
  }

  setInputValue(nodeId, value) {
    this.wires.set(nodeId, Boolean(value));
    this.evaluate();
  }

  evaluate() {
    let changed = true;
    let iterations = 0;
    const maxIterations = 20;

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const [id, gate] of this.gates) {
        const inputVals = gate.inputs.map(inId => this.wires.get(inId) || this.gates.get(inId)?.state || false);
        let nextState = false;

        switch (gate.type) {
          case 'AND':
            nextState = inputVals.length > 0 && inputVals.every(Boolean);
            break;
          case 'OR':
            nextState = inputVals.some(Boolean);
            break;
          case 'XOR':
            nextState = inputVals.filter(Boolean).length % 2 === 1;
            break;
          case 'NOT':
            nextState = !inputVals[0];
            break;
          case 'NAND':
            nextState = !(inputVals.length > 0 && inputVals.every(Boolean));
            break;
          case 'NOR':
            nextState = !inputVals.some(Boolean);
            break;
          default:
            nextState = false;
        }

        if (nextState !== gate.state) {
          gate.state = nextState;
          changed = true;
        }
      }
    }
  }

  getGateOutput(id) {
    return this.gates.get(id)?.state || false;
  }
}

export class OpticsEngine {
  static traceBeam(emitter, mirrors = [], walls = [], maxBounces = 20) {
    const segments = [];
    let currentPos = { x: emitter.x, y: emitter.y };
    let currentDir = emitter.direction || 'right';

    for (let i = 0; i < maxBounces; i++) {
      let dx = 0;
      let dy = 0;
      if (currentDir === 'right') dx = 1;
      else if (currentDir === 'left') dx = -1;
      else if (currentDir === 'up') dy = -1;
      else if (currentDir === 'down') dy = 1;

      const nextPos = { x: currentPos.x + dx, y: currentPos.y + dy };

      // Check wall collision
      if (walls.some(w => w.x === nextPos.x && w.y === nextPos.y)) {
        segments.push({ from: currentPos, to: nextPos, terminated: true });
        break;
      }

      // Check mirror reflection
      const mirror = mirrors.find(m => m.x === nextPos.x && m.y === nextPos.y);
      if (mirror) {
        segments.push({ from: currentPos, to: nextPos, mirror });
        currentPos = nextPos;
        currentDir = this._reflect(currentDir, mirror.angle || 45);
      } else {
        segments.push({ from: currentPos, to: nextPos });
        currentPos = nextPos;
      }
    }

    return segments;
  }

  static _reflect(incomingDir, mirrorAngle) {
    // 45 deg mirror reflections
    if (mirrorAngle === 45) {
      if (incomingDir === 'right') return 'down';
      if (incomingDir === 'up') return 'left';
      if (incomingDir === 'left') return 'up';
      if (incomingDir === 'down') return 'right';
    } else if (mirrorAngle === 135) {
      if (incomingDir === 'right') return 'up';
      if (incomingDir === 'down') return 'left';
      if (incomingDir === 'left') return 'down';
      if (incomingDir === 'up') return 'right';
    }
    return incomingDir;
  }
}

export class DeadlockDetectionEngine {
  static isCornerDeadlock(boxPos, goalPos, walls = [], width = 10, height = 10) {
    if (boxPos.x === goalPos.x && boxPos.y === goalPos.y) return false;

    const isBlocked = (x, y) => {
      if (x < 0 || x >= width || y < 0 || y >= height) return true;
      return walls.some(w => w.x === x && w.y === y);
    };

    const upBlocked = isBlocked(boxPos.x, boxPos.y - 1);
    const downBlocked = isBlocked(boxPos.x, boxPos.y + 1);
    const leftBlocked = isBlocked(boxPos.x - 1, boxPos.y);
    const rightBlocked = isBlocked(boxPos.x + 1, boxPos.y);

    if (upBlocked && leftBlocked) return true;
    if (upBlocked && rightBlocked) return true;
    if (downBlocked && leftBlocked) return true;
    if (downBlocked && rightBlocked) return true;

    return false;
  }
}
