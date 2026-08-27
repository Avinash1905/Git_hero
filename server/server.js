// GitQuest Production Express Server
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Database & Seed
import { db } from './database/db.js';
import { seedAll } from './database/seed.js';

// Route Handlers
import { authRouter } from './routes/authRoutes.js';
import { playerRouter } from './routes/playerRoutes.js';
import { levelRouter } from './routes/levelRoutes.js';
import { gameRouter } from './routes/gameRoutes.js';
import { progressRouter } from './routes/progressRoutes.js';
import { leaderboardRouter } from './routes/leaderboardRoutes.js';
import { achievementRouter } from './routes/achievementRoutes.js';
import { challengeRouter } from './routes/challengeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Seed levels and achievements on startup if needed
try {
  const levelCount = db.get('SELECT COUNT(*) as count FROM levels')?.count || 0;
  if (levelCount < 250) {
    console.log(`[Server] Level count is ${levelCount}, running full database seed...`);
    seedAll();
  }
} catch (err) {
  console.warn('[Server] Auto-seed check failed, running seedAll():', err.message);
  seedAll();
}

// Health Check
app.get('/api/health', (req, res) => {
  const levelCount = db.get('SELECT COUNT(*) as count FROM levels')?.count || 0;
  const userCount = db.get('SELECT COUNT(*) as count FROM users')?.count || 0;
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    levelsLoaded: levelCount,
    usersRegistered: userCount
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/player', playerRouter);
app.use('/api/levels', levelRouter);
app.use('/api/game', gameRouter);
app.use('/api/progress', progressRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/achievements', achievementRouter);
app.use('/api/challenges', challengeRouter);

// Static Asset Serving
app.use(express.static(ROOT_DIR, {
  extensions: ['html', 'js', 'css', 'json', 'png', 'svg', 'jpg'],
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Fallback to index.html for SPA routes
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: `Endpoint ${req.path} not found` });
  }
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Start Server if executed directly
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[GitHero Production Server] Listening on http://localhost:${PORT}`);
    console.log(`[GitHero API Endpoints] Available at http://localhost:${PORT}/api`);
  });
}

export default app;
