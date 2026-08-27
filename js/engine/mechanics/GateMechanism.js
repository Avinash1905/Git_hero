/**
 * GitHero Gate & Firewall Mechanism
 * Manages dynamic gates, pressure plates, and switch unlocking logic.
 */

export class GateMechanism {
  static evaluateGates(switches = [], gates = [], playerPos, boxPos) {
    const updatedGates = gates.map(gate => {
      // Find linked switches
      const linkedSwitches = switches.filter(s => s.linkedGateId === gate.id || gate.linkedSwitchId === s.id);
      if (!linkedSwitches.length) {
        return gate;
      }

      // Check if all linked switches are active (or any for toggle)
      const isAnyActive = linkedSwitches.some(s => {
        // Pressure plate active if box or player is on it
        const hasEntity = (boxPos && boxPos.x === s.x && boxPos.y === s.y) ||
                          (playerPos && playerPos.x === s.x && playerPos.y === s.y);
        return s.isActive || hasEntity;
      });

      return {
        ...gate,
        isOpen: isAnyActive
      };
    });

    return updatedGates;
  }
}
