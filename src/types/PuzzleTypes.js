/**
 * GitQuest Type Definitions - Puzzle Mechanisms & Interactive Circuit Gates
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

export const MechanismState = Object.freeze({
  CLOSED: 'CLOSED',
  OPEN: 'OPEN',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  TRIGGERED: 'TRIGGERED',
  LOCKED: 'LOCKED'
});

/**
 * @typedef {Object} CircuitNode
 * @property {string} id - Unique circuit element ID
 * @property {GateType} gateType - Boolean logic gate
 * @property {string[]} inputs - Input node identifiers
 * @property {boolean} state - Current high/low state
 */

/**
 * @typedef {Object} LaserBeamSegment
 * @property {{ x: number, y: number }} from - Origin tile
 * @property {{ x: number, y: number }} to - Destination tile
 * @property {'up' | 'down' | 'left' | 'right'} direction - Propagation vector
 * @property {string} color - Laser wavelength color hex
 */

/**
 * @typedef {Object} PortalPair
 * @property {string} id - Portal network identifier
 * @property {{ x: number, y: number }} entry - Entrance spatial tile
 * @property {{ x: number, y: number }} exit - Exit spatial tile
 * @property {boolean} isActive - Active teleport channel
 */
