// Game Session & Completion Authority Routes
import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { GameValidationService } from '../services/validationService.js';
import { db } from '../database/db.js';

export const gameRouter = Router();

// POST /api/game/session/start
gameRouter.post('/session/start', requireAuth, (req, res) => {
  const userId = req.user.id;
  const { levelId } = req.body;

  if (!levelId) {
    return res.status(422).json({ success: false, error: 'Level ID is required to start a game session.' });
  }

  try {
    const session = GameValidationService.startSession(userId, levelId);
    return res.json({ success: true, ...session });
  } catch (err) {
    return res.status(403).json({ success: false, error: err.message });
  }
});

// POST /api/game/session/complete
gameRouter.post('/session/complete', requireAuth, (req, res) => {
  const userId = req.user.id;
  const { sessionId, levelId, moves, timeSeconds, commandsCount, pushCount, pullCount, history, commandUsage } = req.body;

  if (!levelId) {
    return res.status(422).json({ success: false, error: 'Level ID is required.' });
  }

  try {
    const completionResult = GameValidationService.completeSession(userId, {
      sessionId,
      levelId,
      moves,
      timeSeconds,
      commandsCount,
      pushCount,
      pullCount,
      history,
      commandUsage
    });

    return res.json(completionResult);
  } catch (err) {
    console.error('Level completion error:', err);
    return res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/game/session/abandon
gameRouter.post('/session/abandon', requireAuth, (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.body;

  if (sessionId) {
    db.run(
      `UPDATE game_sessions SET status = 'ABANDONED', ended_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [sessionId, userId]
    );
  } else {
    db.run(
      `UPDATE game_sessions SET status = 'ABANDONED', ended_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND status = 'ACTIVE'`,
      [userId]
    );
  }

  return res.json({ success: true, message: 'Active game session abandoned.' });
});
