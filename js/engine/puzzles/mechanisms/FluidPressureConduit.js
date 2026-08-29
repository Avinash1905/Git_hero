/**
 * GitQuest Game Engine - Fluid Pressure Conduit Mechanism
 * Simulates hydraulic pipelines, pump turbines, pressure valves,
 * fluid reservoirs, and hydraulic security airlocks.
 */

import { Vector2D } from '../../core/MathUtils.js';
import { GameEvent } from '../../core/Constants.js';

export const PipeType = {
  STRAIGHT_HORIZONTAL: 'HORIZONTAL',
  STRAIGHT_VERTICAL: 'VERTICAL',
  CORNER_TOP_RIGHT: 'CORNER_TR',
  CORNER_TOP_LEFT: 'CORNER_TL',
  CORNER_BOTTOM_RIGHT: 'CORNER_BR',
  CORNER_BOTTOM_LEFT: 'CORNER_BL',
  T_JUNCTION: 'T_JUNCTION',
  CROSS_JUNCTION: 'CROSS',
  VALVE: 'VALVE',
  PUMP: 'PUMP',
  RESERVOIR: 'RESERVOIR'
};

export class FluidNode {
  constructor(id, position, type = PipeType.STRAIGHT_HORIZONTAL, capacity = 100) {
    this.id = id;
    this.position = new Vector2D(position.x, position.y);
    this.type = type;
    this.capacity = capacity;
    this.currentVolume = 0;
    this.pressure = 0;
    this.isOpen = true; // For valves
    this.isPumping = (type === PipeType.PUMP);
    this.connectedNodeIds = new Set();
  }

  get isFull() {
    return this.currentVolume >= this.capacity;
  }

  get fillPercentage() {
    return this.capacity > 0 ? (this.currentVolume / this.capacity) * 100 : 0;
  }

  connect(targetNodeId) {
    this.connectedNodeIds.add(targetNodeId);
  }

  disconnect(targetNodeId) {
    this.connectedNodeIds.delete(targetNodeId);
  }
}

export class FluidPressureConduit {
  constructor(eventBus = null) {
    this.eventBus = eventBus;
    this.nodes = new Map();
    this.pressureThresholdForAirlock = 75; // 75% required to unlock airlocks
    this.airlocks = new Map();
  }

  addNode(node) {
    this.nodes.set(node.id, node);
  }

  connectNodes(nodeIdA, nodeIdB) {
    const a = this.nodes.get(nodeIdA);
    const b = this.nodes.get(nodeIdB);
    if (a && b) {
      a.connect(nodeIdB);
      b.connect(nodeIdA);
    }
  }

  registerAirlock(airlockId, position, requiredReservoirId, requiredThreshold = 75) {
    this.airlocks.set(airlockId, {
      id: airlockId,
      position: new Vector2D(position.x, position.y),
      requiredReservoirId,
      requiredThreshold,
      isUnlocked: false
    });
  }

  toggleValve(valveId) {
    const node = this.nodes.get(valveId);
    if (node && node.type === PipeType.VALVE) {
      node.isOpen = !node.isOpen;
      this.recalculateFluidFlow();
      return node.isOpen;
    }
    return false;
  }

  setPumpStatus(pumpId, isPumping) {
    const node = this.nodes.get(pumpId);
    if (node && node.type === PipeType.PUMP) {
      node.isPumping = isPumping;
      this.recalculateFluidFlow();
      return true;
    }
    return false;
  }

  recalculateFluidFlow(iterations = 5) {
    // Breadth-first hydraulic propagation from active pumps
    for (let iter = 0; iter < iterations; iter++) {
      for (const node of this.nodes.values()) {
        if (node.type === PipeType.PUMP && node.isPumping) {
          node.currentVolume = node.capacity;
          node.pressure = 100;

          // Propagate to neighbors
          this.propagatePressure(node.id, new Set());
        }
      }
    }

    // Evaluate airlock states
    for (const airlock of this.airlocks.values()) {
      const reservoir = this.nodes.get(airlock.requiredReservoirId);
      const wasUnlocked = airlock.isUnlocked;
      if (reservoir) {
        airlock.isUnlocked = reservoir.fillPercentage >= airlock.requiredThreshold;
      }
      if (wasUnlocked !== airlock.isUnlocked && this.eventBus) {
        this.eventBus.emit(GameEvent.DOOR_UNLOCKED, {
          airlockId: airlock.id,
          isUnlocked: airlock.isUnlocked
        });
      }
    }
  }

  propagatePressure(startNodeId, visited) {
    const queue = [startNodeId];
    visited.add(startNodeId);

    while (queue.length > 0) {
      const currentId = queue.shift();
      const current = this.nodes.get(currentId);
      if (!current || (!current.isOpen && current.type === PipeType.VALVE)) continue;

      for (const neighborId of current.connectedNodeIds) {
        if (!visited.has(neighborId)) {
          const neighbor = this.nodes.get(neighborId);
          if (neighbor && (neighbor.isOpen || neighbor.type !== PipeType.VALVE)) {
            const transfer = Math.min(
              neighbor.capacity - neighbor.currentVolume,
              Math.max(0, current.currentVolume * 0.5)
            );
            neighbor.currentVolume = Math.min(neighbor.capacity, neighbor.currentVolume + transfer);
            neighbor.pressure = Math.max(neighbor.pressure, current.pressure * 0.9);
            visited.add(neighborId);
            queue.push(neighborId);
          }
        }
      }
    }
  }

  isAirlockOpenAt(x, y) {
    for (const airlock of this.airlocks.values()) {
      if (airlock.position.x === x && airlock.position.y === y) {
        return airlock.isUnlocked;
      }
    }
    return true; // Not an airlock
  }

  exportState() {
    return {
      nodes: Array.from(this.nodes.values()).map(n => ({
        id: n.id,
        currentVolume: n.currentVolume,
        pressure: n.pressure,
        isOpen: n.isOpen,
        isPumping: n.isPumping
      })),
      airlocks: Array.from(this.airlocks.values()).map(a => ({
        id: a.id,
        isUnlocked: a.isUnlocked
      }))
    };
  }

  restoreState(state) {
    if (!state) return;
    if (state.nodes) {
      for (const n of state.nodes) {
        const node = this.nodes.get(n.id);
        if (node) {
          node.currentVolume = n.currentVolume;
          node.pressure = n.pressure;
          node.isOpen = n.isOpen;
          node.isPumping = n.isPumping;
        }
      }
    }
    if (state.airlocks) {
      for (const a of state.airlocks) {
        const airlock = this.airlocks.get(a.id);
        if (airlock) {
          airlock.isUnlocked = a.isUnlocked;
        }
      }
    }
  }
}
