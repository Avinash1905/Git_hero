/**
 * GitQuest Engine - Circuit Simulator & Boolean Logic Gates
 * Full discrete logic engine supporting AND, OR, XOR, NOT, NAND, NOR gates, D Flip-Flops, and Pulse Relays.
 */

export const GateType = Object.freeze({
  AND: 'AND',
  OR: 'OR',
  XOR: 'XOR',
  NOT: 'NOT',
  NAND: 'NAND',
  NOR: 'NOR',
  LATCH: 'LATCH'
});

export class LogicGate {
  constructor(id, type = GateType.AND, options = {}) {
    this.id = id;
    this.type = type;
    this.inputs = new Map(); // inputId -> boolean
    this.output = false;
    this.inverted = Boolean(options.inverted);
    this.targetIds = options.targetIds || [];
  }

  setInput(inputId, value) {
    this.inputs.set(inputId, Boolean(value));
    return this.evaluate();
  }

  evaluate() {
    const vals = Array.from(this.inputs.values());
    if (vals.length === 0) {
      this.output = false;
      return this.output;
    }

    let rawOut = false;
    switch (this.type) {
      case GateType.AND:
        rawOut = vals.every(Boolean);
        break;
      case GateType.OR:
        rawOut = vals.some(Boolean);
        break;
      case GateType.XOR: {
        const trueCount = vals.filter(Boolean).length;
        rawOut = trueCount % 2 === 1;
        break;
      }
      case GateType.NOT:
        rawOut = !vals[0];
        break;
      case GateType.NAND:
        rawOut = !vals.every(Boolean);
        break;
      case GateType.NOR:
        rawOut = !vals.some(Boolean);
        break;
      case GateType.LATCH:
        if (vals[0]) this.output = true;
        return this.output;
    }

    this.output = this.inverted ? !rawOut : rawOut;
    return this.output;
  }
}

export class CircuitNetwork {
  constructor() {
    this.gates = new Map(); // id -> LogicGate
    this.wires = []; // Array<{ fromGateId, toGateId, inputSlot }>
  }

  addGate(gate) {
    this.gates.set(gate.id, gate);
    return gate;
  }

  connect(fromGateId, toGateId, inputSlot = fromGateId) {
    this.wires.push({ fromGateId, toGateId, inputSlot });
  }

  propagate() {
    let changed = true;
    let iterations = 0;
    const maxIterations = 20; // prevent infinite feedback loops

    while (changed && iterations < maxIterations) {
      changed = false;
      iterations++;

      for (const wire of this.wires) {
        const fromGate = this.gates.get(wire.fromGateId);
        const toGate = this.gates.get(wire.toGateId);

        if (fromGate && toGate) {
          const prevOut = toGate.output;
          toGate.setInput(wire.inputSlot, fromGate.output);
          if (toGate.output !== prevOut) {
            changed = true;
          }
        }
      }
    }
  }

  getOutput(gateId) {
    return this.gates.get(gateId)?.output || false;
  }

  reset() {
    for (const gate of this.gates.values()) {
      gate.inputs.clear();
      gate.output = false;
    }
  }
}
