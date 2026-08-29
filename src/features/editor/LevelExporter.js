/**
 * LevelExporter
 * Serializes, validates, and packages custom user levels into engine-compatible JSON schemas.
 */

import { LevelValidator } from './LevelValidator.js';

export class LevelExporter {
  /**
   * Export level definition to JSON string
   * @param {Object} rawLevel
   * @returns {{success: boolean, json: string, errors: string[]}}
   */
  static exportToJson(rawLevel) {
    const validation = LevelValidator.validate(rawLevel);
    if (!validation.isValid) {
      return { success: false, json: null, errors: validation.errors };
    }

    const payload = {
      id: rawLevel.id || 'custom-01',
      name: rawLevel.name || 'Custom Sector',
      description: rawLevel.description || 'Community engineered puzzle sector.',
      gridSize: rawLevel.gridSize || 6,
      width: rawLevel.width || rawLevel.gridSize || 6,
      height: rawLevel.height || rawLevel.gridSize || 6,
      player: { x: rawLevel.player.x, y: rawLevel.player.y },
      box: { x: rawLevel.box.x, y: rawLevel.box.y },
      goal: { x: rawLevel.goal.x, y: rawLevel.goal.y },
      walls: (rawLevel.walls || []).map(w => ({ x: w.x, y: w.y })),
      hazards: (rawLevel.hazards || []).map(h => ({ x: h.x, y: h.y })),
      switches: (rawLevel.switches || []).map(s => ({ x: s.x, y: s.y, targetDoor: s.targetDoor })),
      doors: (rawLevel.doors || []).map(d => ({ x: d.x, y: d.y, open: Boolean(d.open) })),
      commitsReq: rawLevel.commitsReq || 1,
      difficulty: rawLevel.difficulty || 'MEDIUM',
      xpReward: rawLevel.xpReward || 350
    };

    return {
      success: true,
      json: JSON.stringify(payload, null, 2),
      errors: []
    };
  }

  /**
   * Parse and validate imported level JSON
   * @param {string} jsonString
   * @returns {{success: boolean, level: Object, errors: string[]}}
   */
  static importFromJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const validation = LevelValidator.validate(parsed);

      if (!validation.isValid) {
        return { success: false, level: null, errors: validation.errors };
      }

      return { success: true, level: parsed, errors: [] };
    } catch (err) {
      return { success: false, level: null, errors: [`JSON Parse Error: ${err.message}`] };
    }
  }
}
