/**
 * GitQuest Frontend - Level Editor & Scenario Studio
 * Visual level builder with interactive tile painting tools (Wall, Hazard, Player, Box, Goal),
 * level definition JSON exporter/importer, and real-time solvability validation.
 */

import { LevelValidator } from '../../../js/engine/levels/LevelDefinition.js';

export const ToolType = {
  WALL: 'WALL',
  HAZARD: 'HAZARD',
  PLAYER: 'PLAYER',
  BOX: 'BOX',
  GOAL: 'GOAL',
  ERASER: 'ERASER'
};

export class GitQuestLevelEditor {
  constructor(gridSize = 8) {
    this.gridSize = gridSize;
    this.currentTool = ToolType.WALL;
    this.level = {
      id: 'custom_01',
      name: 'User Custom Level',
      world: 1,
      difficulty: 'MEDIUM',
      stars: 3,
      xpReward: 500,
      description: 'Created with GitQuest Scenario Studio',
      hint: 'Solve using Git commands.',
      gridSize: gridSize,
      player: { x: 1, y: 1 },
      box: { x: 2, y: 2 },
      goal: { x: gridSize - 2, y: gridSize - 2 },
      walls: [],
      hazards: []
    };
    this.history = [];
  }

  setTool(tool) {
    if (Object.values(ToolType).includes(tool)) {
      this.currentTool = tool;
    }
  }

  paintCell(x, y) {
    if (x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize) return;

    this.saveSnapshot();

    // Erase existing at position
    this.level.walls = this.level.walls.filter(w => !(w.x === x && w.y === y));
    this.level.hazards = this.level.hazards.filter(h => !(h.x === x && h.y === y));

    switch (this.currentTool) {
      case ToolType.WALL:
        this.level.walls.push({ x, y });
        break;
      case ToolType.HAZARD:
        this.level.hazards.push({ x, y });
        break;
      case ToolType.PLAYER:
        this.level.player = { x, y };
        break;
      case ToolType.BOX:
        this.level.box = { x, y };
        break;
      case ToolType.GOAL:
        this.level.goal = { x, y };
        break;
      case ToolType.ERASER:
        break;
    }
  }

  saveSnapshot() {
    this.history.push(JSON.stringify(this.level));
    if (this.history.length > 30) this.history.shift();
  }

  undo() {
    if (this.history.length > 0) {
      const prev = this.history.pop();
      this.level = JSON.parse(prev);
      return true;
    }
    return false;
  }

  validateLevel() {
    return LevelValidator.validate(this.level);
  }

  exportJson() {
    return JSON.stringify(this.level, null, 2);
  }

  importJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const val = LevelValidator.validate(parsed);
      if (val.isValid) {
        this.level = parsed;
        this.gridSize = parsed.gridSize || 8;
        return { success: true };
      }
      return { success: false, errors: val.errors };
    } catch (e) {
      return { success: false, errors: ['Invalid JSON syntax'] };
    }
  }

  renderEditorHtml() {
    const val = this.validateLevel();

    return `
      <div class="level-editor-panel" style="background:#090d16; color:#e2e8f0; padding:20px; border-radius:12px; border:1px solid rgba(56,189,248,0.3); max-width:640px; font-family:Inter, sans-serif;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <div>
            <h3 style="margin:0; font-size:17px; color:#38bdf8;">🛠️ GitQuest Scenario Studio</h3>
            <p style="margin:2px 0 0 0; font-size:12px; color:#94a3b8;">Design, test, and export handcrafted puzzle scenarios.</p>
          </div>
          <span style="font-size:11px; padding:3px 8px; border-radius:4px; font-weight:bold; background:${val.isValid ? '#065f46' : '#7f1d1d'}; color:${val.isValid ? '#34d399' : '#fca5a5'};">
            ${val.isValid ? '✓ SCHEMA VALID' : 'ERRORS DETECTED'}
          </span>
        </div>

        <div class="editor-palette" style="display:flex; gap:8px; margin-bottom:14px;">
          ${Object.values(ToolType).map(t => `
            <button class="tool-btn ${this.currentTool === t ? 'active' : ''}" data-tool="${t}" style="background:${this.currentTool === t ? '#38bdf8' : '#1e293b'}; color:${this.currentTool === t ? '#000' : '#cbd5e1'}; border:1px solid #475569; padding:6px 12px; border-radius:6px; font-size:11px; font-weight:bold; cursor:pointer;">
              ${t}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }
}
