/**
 * LevelDesignStudio
 * Interactive tilemap level design studio enabling operatives to place walls, boxes,
 * goals, laser emitters, and export custom sector JSON schemas.
 */

export class LevelDesignStudio {
  constructor(size = 8) {
    this.gridSize = size;
    this.walls = [];
    this.boxes = [];
    this.goals = [];
    this.hazards = [];
    this.playerStart = { x: 1, y: 1 };
  }

  setTile(type, x, y) {
    // Clear existing item at (x,y)
    this.walls = this.walls.filter(w => w.x !== x || w.y !== y);
    this.boxes = this.boxes.filter(b => b.x !== x || b.y !== y);
    this.goals = this.goals.filter(g => g.x !== x || g.y !== y);
    this.hazards = this.hazards.filter(h => h.x !== x || h.y !== y);

    if (type === 'wall') this.walls.push({ x, y });
    if (type === 'box') this.boxes.push({ x, y });
    if (type === 'goal') this.goals.push({ x, y });
    if (type === 'hazard') this.hazards.push({ x, y });
    if (type === 'player') this.playerStart = { x, y };
  }

  exportLevelJson(title = 'Custom Sector') {
    return JSON.stringify({
      id: 'custom_01',
      title,
      gridSize: this.gridSize,
      walls: this.walls,
      boxes: this.boxes,
      goals: this.goals,
      hazards: this.hazards,
      player: this.playerStart,
      xp_reward: 150
    }, null, 2);
  }
}

export const levelDesignStudio = new LevelDesignStudio();
