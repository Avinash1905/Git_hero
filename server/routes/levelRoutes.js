// Levels API Routes: Serves all 250 handcrafted levels with progressive unlock state
import { Router } from 'express';
import { db } from '../database/db.js';
import { optionalAuth } from '../middleware/auth.js';

export const levelRouter = Router();

// GET /api/levels
levelRouter.get('/', optionalAuth, (req, res) => {
  const userId = req.user?.id;

  const levels = db.query('SELECT * FROM levels ORDER BY number ASC');

  let userProgressMap = {};
  if (userId) {
    const userProgress = db.query('SELECT * FROM level_progress WHERE user_id = ?', [userId]);
    for (const prog of userProgress) {
      userProgressMap[prog.level_id] = prog;
    }
  }

  const enriched = levels.map((lvl) => {
    let rawDef = {};
    try {
      rawDef = JSON.parse(lvl.def_json);
    } catch {}

    const prog = userProgressMap[lvl.id] || null;

    // Level 1 is always unlocked by default for new players
    const isLevel1 = lvl.number === 1;
    let status = 'LOCKED';

    if (prog) {
      status = prog.status;
    } else if (isLevel1) {
      status = 'UNLOCKED';
    }

    return {
      id: lvl.id,
      number: lvl.number,
      name: lvl.name,
      world: lvl.world,
      difficulty: lvl.difficulty,
      xpReward: lvl.xp_reward,
      commitsReq: lvl.commits_req,
      gridSize: lvl.grid_size,
      description: rawDef.description || `Level ${lvl.id} Challenge`,
      objectives: rawDef.objectives || ['Move box to goal', 'Commit repository state'],
      hint: rawDef.hint || null,
      status,
      stars: prog?.stars || 0,
      bestScore: prog?.best_score || 0,
      bestMoves: prog?.best_moves || 0,
      bestTimeSec: prog?.best_time_sec || 0,
      completed: status === 'COMPLETED',
      unlocked: status !== 'LOCKED'
    };
  });

  return res.json({
    success: true,
    total: enriched.length,
    levels: enriched
  });
});

// GET /api/levels/:id
levelRouter.get('/:id', optionalAuth, (req, res) => {
  const normId = String(req.params.id).padStart(2, '0');
  const level = db.get('SELECT * FROM levels WHERE id = ?', [normId]);

  if (!level) {
    return res.status(404).json({ success: false, error: `Level ${normId} not found.` });
  }

  let def = {};
  try {
    def = JSON.parse(level.def_json);
  } catch {}

  let progress = null;
  if (req.user?.id) {
    progress = db.get('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?', [req.user.id, normId]);
  }

  return res.json({
    success: true,
    level: {
      id: level.id,
      number: level.number,
      name: level.name,
      world: level.world,
      difficulty: level.difficulty,
      xpReward: level.xp_reward,
      commitsReq: level.commits_req,
      gridSize: level.grid_size,
      ...def,
      progress: progress || { status: level.number === 1 ? 'UNLOCKED' : 'LOCKED', stars: 0 }
    }
  });
});

// GET /api/levels/world/:worldNum
levelRouter.get('/world/:worldNum', optionalAuth, (req, res) => {
  const worldNum = parseInt(req.params.worldNum, 10);
  const levels = db.query('SELECT * FROM levels WHERE world = ? ORDER BY number ASC', [worldNum]);

  return res.json({
    success: true,
    world: worldNum,
    levels
  });
});
