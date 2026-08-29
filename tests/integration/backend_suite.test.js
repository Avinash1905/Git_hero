/**
 * Automated Integration Test Suite: Backend Repositories, AntiCheat, RateLimiter & Services
 */

import assert from 'node:assert';
import { UserRepository } from '../../server/database/repositories/UserRepository.js';
import { PlayerRepository, ProgressRepository, SessionRepository, LevelRepository } from '../../server/database/repositories/DomainRepositories.js';
import { AntiCheatService } from '../../server/services/AntiCheatService.js';
import { replayService, analyticsService } from '../../server/services/ReplayAndAnalyticsService.js';
import { RateLimiter } from '../../server/middleware/ServerMiddleware.js';

export function runBackendIntegrationSuite() {
  console.log('Running Backend Repositories & Services Suite...');

  // 1. Level Repository count
  const lvlCount = LevelRepository.count();
  assert.strictEqual(lvlCount, 250);

  // 2. User & Player query check
  const uCount = UserRepository.count();
  assert.ok(uCount >= 1);

  // 3. Anti-cheat validation tests
  const validTiming = AntiCheatService.validateSessionTiming(new Date(Date.now() - 10000).toISOString(), 8, 4);
  assert.strictEqual(validTiming.isValid, true);

  const speedhack = AntiCheatService.validateSessionTiming(new Date().toISOString(), 0.01, 10);
  assert.strictEqual(speedhack.isValid, false);
  assert.strictEqual(speedhack.reason, 'IMPOSSIBLE_SPEEDHACK');

  // 4. Spatial path check
  const validPath = AntiCheatService.validateMovePath({ x: 1, y: 1 }, { x: 3, y: 3 }, 5, [], 10);
  assert.strictEqual(validPath.isValid, true);

  const teleport = AntiCheatService.validateMovePath({ x: 1, y: 1 }, { x: 8, y: 8 }, 2, [], 10);
  assert.strictEqual(teleport.isValid, false);
  assert.strictEqual(teleport.reason, 'TELEPORT_DETECTED');

  // 5. Replay Service
  const replay = replayService.saveReplay('sess-100', '01', [{ x: 1, y: 1 }, { x: 2, y: 1 }], ['git status', 'git push']);
  assert.ok(replay);
  assert.strictEqual(replay.movesCount, 2);
  const fetchedReplay = replayService.getReplay('sess-100');
  assert.strictEqual(fetchedReplay.levelId, '01');

  // 6. Analytics Service
  analyticsService.recordAttempt('01');
  analyticsService.recordCompletion('01', 25);
  const stats = analyticsService.getLevelAnalytics('01');
  assert.strictEqual(stats.attempts, 1);
  assert.strictEqual(stats.completions, 1);
  assert.strictEqual(stats.passRate, 100);

  // 7. Rate Limiter
  const limiter = new RateLimiter(60000, 2);
  let passedCount = 0;
  let blockedCount = 0;
  const mockReq = { ip: '127.0.0.1', headers: {}, socket: {} };
  const mockRes = {
    status(code) {
      if (code === 429) blockedCount++;
      return { json: () => {} };
    }
  };
  const mockNext = () => { passedCount++; };

  const mw = limiter.middleware();
  mw(mockReq, mockRes, mockNext); // 1st
  mw(mockReq, mockRes, mockNext); // 2nd
  mw(mockReq, mockRes, mockNext); // 3rd (blocked)

  assert.strictEqual(passedCount, 2);
  assert.strictEqual(blockedCount, 1);

  console.log('  ✓ Backend Repositories, AntiCheat, Replay, Analytics & RateLimiter verified successfully.');
}

if (process.argv[1]?.endsWith('backend_suite.test.js')) {
  runBackendIntegrationSuite();
}
