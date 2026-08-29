/**
 * GitQuest Feature: In-Browser Level Editor & Custom Sandbox Engine
 */

import { ValidationUtils } from '../../utils/ValidationUtils.js';

export class LevelEditorController {
  constructor() {
    this.gridSize = 8;
    this.player = { x: 1, y: 1 };
    this.box = { x: 3, y: 3 };
    this.goal = { x: 5, y: 5 };
    this.walls = [];
    this.hazards = [];
    this.currentTool = 'wall'; // 'wall' | 'hazard' | 'player' | 'box' | 'goal' | 'eraser'
    this.historyStack = [];
  }

  setTool(toolName) {
    this.currentTool = toolName;
  }

  setGridSize(size) {
    this.gridSize = Math.max(4, Math.min(36, Number(size) || 8));
  }

  handleCellClick(x, y) {
    this._saveHistory();

    if (this.currentTool === 'eraser') {
      this.walls = this.walls.filter(w => !(w.x === x && w.y === y));
      this.hazards = this.hazards.filter(h => !(h.x === x && h.y === y));
      return;
    }

    if (this.currentTool === 'player') {
      this.player = { x, y };
    } else if (this.currentTool === 'box') {
      this.box = { x, y };
    } else if (this.currentTool === 'goal') {
      this.goal = { x, y };
    } else if (this.currentTool === 'wall') {
      if (!this.walls.some(w => w.x === x && w.y === y)) {
        this.walls.push({ x, y });
      } else {
        this.walls = this.walls.filter(w => !(w.x === x && w.y === y));
      }
    } else if (this.currentTool === 'hazard') {
      if (!this.hazards.some(h => h.x === x && h.y === y)) {
        this.hazards.push({ x, y });
      } else {
        this.hazards = this.hazards.filter(h => !(h.x === x && h.y === y));
      }
    }
  }

  _saveHistory() {
    this.historyStack.push(JSON.stringify({
      gridSize: this.gridSize,
      player: this.player,
      box: this.box,
      goal: this.goal,
      walls: this.walls,
      hazards: this.hazards
    }));
    if (this.historyStack.length > 30) {
      this.historyStack.shift();
    }
  }

  undo() {
    if (this.historyStack.length === 0) return false;
    const snap = JSON.parse(this.historyStack.pop());
    this.gridSize = snap.gridSize;
    this.player = snap.player;
    this.box = snap.box;
    this.goal = snap.goal;
    this.walls = snap.walls;
    this.hazards = snap.hazards;
    return true;
  }

  exportLevelJson(name = 'Custom Challenge', world = 1, difficulty = 'MEDIUM') {
    const levelObj = {
      id: 'custom_01',
      name,
      world,
      difficulty,
      xpReward: 500,
      commitsReq: 3,
      gridSize: this.gridSize,
      description: 'Custom community created challenge.',
      player: this.player,
      box: this.box,
      goal: this.goal,
      walls: this.walls,
      hazards: this.hazards,
      objectives: ['Navigate the custom staging tree', 'Push payload to destination goal', 'Commit repository solution']
    };

    const validation = ValidationUtils.validateLevelDefinition(levelObj);
    return {
      isValid: validation.isValid,
      errors: validation.errors,
      json: JSON.stringify(levelObj, null, 2)
    };
  }

  loadLevelJson(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      const val = ValidationUtils.validateLevelDefinition(parsed);
      if (!val.isValid) {
        return { success: false, errors: val.errors };
      }
      this.gridSize = parsed.gridSize || 8;
      this.player = parsed.player;
      this.box = parsed.box;
      this.goal = parsed.goal;
      this.walls = parsed.walls || [];
      this.hazards = parsed.hazards || [];
      return { success: true };
    } catch (err) {
      return { success: false, errors: [err.message] };
    }
  }
}
