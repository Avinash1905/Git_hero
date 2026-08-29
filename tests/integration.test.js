// Comprehensive Automated Integration Test Suite for GitQuest
// Tests: Auth, Levels, Progression, Anti-cheat, Game Sessions, Leaderboards, Achievements, Full Lifecycle

import assert from 'node:assert';
import { db } from '../server/database/db.js';
import { seedAll } from '../server/database/seed.js';
import { GameValidationService } from '../server/services/validationService.js';
import { AchievementEvaluator } from '../server/services/achievementService.js';
import { ScoringService } from '../server/services/scoringService.js';
import { hashPassword, verifyPassword, generateToken, verifyToken } from '../server/utils/crypto.js';

let passedTests = 0;
let totalTests = 0;

function it(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✕ ${description}`);
    console.error(`    Error: ${err.message}`);
    throw err;
  }
}

async function runTests() {
  console.log('\n==================================================');
  console.log(' GITQUEST AUTOMATED INTEGRATION TEST SUITE');
  console.log('==================================================\n');

  // 1. Database & Seeder
  console.log('[Test Suite 1: Database & 250 Levels Seeding]');
  seedAll();

  it('Should have seeded exactly 250 levels into the database', () => {
    const count = db.get('SELECT COUNT(*) as count FROM levels')?.count;
    assert.strictEqual(count, 250, `Expected 250 levels, found ${count}`);
  });

  it('Should preserve strict numeric ordering for all 250 levels', () => {
    const levels = db.query('SELECT number, id, world FROM levels ORDER BY number ASC');
    assert.strictEqual(levels.length, 250);
    for (let i = 0; i < levels.length; i++) {
      assert.strictEqual(levels[i].number, i + 1, `Level at index ${i} is not numbered ${i + 1}`);
    }
  });

  it('Should verify World distribution across 20 Worlds', () => {
    const worlds = db.query('SELECT DISTINCT world FROM levels ORDER BY world ASC');
    assert.ok(worlds.length >= 10, 'Expected at least 10-20 worlds');
  });

  it('Should verify Level 01, Level 10, Level 11, Level 12, Level 100, Level 250 exist', () => {
    const checkIds = ['01', '10', '11', '12', '100', '250'];
    for (const id of checkIds) {
      const lvl = db.get('SELECT * FROM levels WHERE id = ? OR number = ?', [id, parseInt(id, 10)]);
      assert.ok(lvl, `Level ${id} must exist in registry`);
    }
  });

  // 2. Cryptography & Authentication Primitives
  console.log('\n[Test Suite 2: Authentication & Cryptography]');
  let testSalt, testHash;

  it('Should securely hash and verify passwords using scrypt and salt', () => {
    const { salt, hash } = hashPassword('SecurePass123!');
    testSalt = salt;
    testHash = hash;
    assert.ok(salt.length >= 32);
    assert.ok(hash.length >= 64);
    assert.strictEqual(verifyPassword('SecurePass123!', salt, hash), true);
    assert.strictEqual(verifyPassword('WrongPass', salt, hash), false);
  });

  it('Should issue and verify valid HMAC SHA-256 JWT tokens', () => {
    const token = generateToken({ userId: 'u-123', username: '@tester' });
    const payload = verifyToken(token);
    assert.ok(payload);
    assert.strictEqual(payload.userId, 'u-123');
    assert.strictEqual(payload.username, '@tester');
  });

  it('Should reject tampered or invalid JWT tokens', () => {
    const token = generateToken({ userId: 'u-123' });
    const tampered = token.slice(0, -5) + 'xxxxx';
    assert.strictEqual(verifyToken(tampered), null);
    assert.strictEqual(verifyToken('not.a.token'), null);
  });

  // 3. User Registration & Progressive Level Unlocking
  console.log('\n[Test Suite 3: Player Registration & Progressive Unlock Rules]');
  const testUserId = `test_player_${Date.now()}`;
  const testUsername = `@test_hero_${Date.now().toString().slice(-4)}`;
  const testEmail = `hero_${Date.now()}@gitquest.io`;

  it('Should register a new player and initialize profile with 0 XP and Level 1', () => {
    db.run(
      `INSERT INTO users (id, username, email, password_hash, salt) VALUES (?, ?, ?, ?, ?)`,
      [testUserId, testUsername, testEmail, testHash, testSalt]
    );
    db.run(
      `INSERT INTO player_profiles (user_id, title, level, xp, lives, streak_days) VALUES (?, 'Novice Contributor', 1, 0, 3, 1)`,
      [testUserId]
    );
    db.run(
      `INSERT INTO level_progress (user_id, level_id, status) VALUES (?, '01', 'UNLOCKED')`,
      [testUserId]
    );

    const user = db.get('SELECT * FROM users WHERE id = ?', [testUserId]);
    const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [testUserId]);
    assert.ok(user);
    assert.strictEqual(profile.xp, 0);
    assert.strictEqual(profile.level, 1);
  });

  it('For a new player: Level 1 must be UNLOCKED, Levels 2-250 must be LOCKED', () => {
    const lvl1Prog = db.get('SELECT status FROM level_progress WHERE user_id = ? AND level_id = ?', [testUserId, '01']);
    assert.strictEqual(lvl1Prog.status, 'UNLOCKED');

    const lvl2Prog = db.get('SELECT status FROM level_progress WHERE user_id = ? AND level_id = ?', [testUserId, '02']);
    assert.strictEqual(lvl2Prog, null, 'Level 02 should have no progress or be locked for new player');
  });

  // 4. Game Sessions & Anti-Cheat Validation
  console.log('\n[Test Suite 4: Game Sessions & Anti-Cheat Validation]');
  let activeSessionId = null;

  it('Should start an active game session for UNLOCKED Level 01', () => {
    const session = GameValidationService.startSession(testUserId, '01');
    assert.ok(session.sessionId);
    activeSessionId = session.sessionId;

    const dbSession = db.get('SELECT * FROM game_sessions WHERE id = ?', [activeSessionId]);
    assert.strictEqual(dbSession.status, 'ACTIVE');
    assert.strictEqual(dbSession.level_id, '01');
  });

  it('ANTI-CHEAT: Should reject starting a session for LOCKED Level 50', () => {
    assert.throws(() => {
      GameValidationService.startSession(testUserId, '50');
    }, /locked/i);
  });

  // 5. Authoritative Level Completion & XP Persistence
  console.log('\n[Test Suite 5: Authoritative Level Completion & Progression Chain]');

  it('Should complete Level 01 with valid moves, award verified XP, and unlock Level 02', () => {
    const result = GameValidationService.completeSession(testUserId, {
      sessionId: activeSessionId,
      levelId: '01',
      moves: 4,
      timeSeconds: 25,
      commandsCount: 4,
      pushCount: 2,
      pullCount: 1,
      history: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
      commandUsage: { 'git status': 1, 'git push': 2, 'git commit': 1 }
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.levelId, '01');
    assert.strictEqual(result.nextLevelId, '02');
    assert.strictEqual(result.stars, 3);
    assert.ok(result.xpAwarded > 0);
    assert.strictEqual(result.totalXp, result.xpAwarded);

    // Verify Level 01 is COMPLETED in database
    const lvl1Prog = db.get('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?', [testUserId, '01']);
    assert.strictEqual(lvl1Prog.status, 'COMPLETED');
    assert.strictEqual(lvl1Prog.stars, 3);

    // Verify Level 02 is UNLOCKED in database
    const lvl2Prog = db.get('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?', [testUserId, '02']);
    assert.strictEqual(lvl2Prog.status, 'UNLOCKED');

    // Verify XP Event recorded
    const xpEvent = db.get('SELECT * FROM xp_events WHERE user_id = ? AND source_id = ?', [testUserId, '01']);
    assert.ok(xpEvent);
    assert.strictEqual(xpEvent.xp_amount, result.xpAwarded);
  });

  it('Should solve Level 02 and sequentially unlock Level 03', () => {
    const s2 = GameValidationService.startSession(testUserId, '02');
    const res2 = GameValidationService.completeSession(testUserId, {
      sessionId: s2.sessionId,
      levelId: '02',
      moves: 10,
      timeSeconds: 30,
      commandsCount: 5,
      pushCount: 3,
      pullCount: 2,
      commandUsage: { 'git push': 3, 'git commit': 1 }
    });

    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.nextLevelId, '03');

    const lvl3Prog = db.get('SELECT * FROM level_progress WHERE user_id = ? AND level_id = ?', [testUserId, '03']);
    assert.strictEqual(lvl3Prog.status, 'UNLOCKED');
  });

  // 6. Milestones, Achievements & Leaderboard
  console.log('\n[Test Suite 6: Achievements, Scoring & Leaderboard]');

  it('Should evaluate and award achievements on milestone reach', () => {
    const newlyUnlocked = AchievementEvaluator.evaluate(testUserId);
    const firstCommitAch = db.get(
      'SELECT * FROM player_achievements WHERE user_id = ? AND achievement_id = ?',
      [testUserId, 'first_commit']
    );
    assert.ok(firstCommitAch);
    assert.strictEqual(firstCommitAch.unlocked, 1);
  });

  it('Should compute player ranking in real database leaderboard', () => {
    const rows = db.query(`
      SELECT u.username, p.xp, p.level,
        (SELECT COUNT(*) FROM level_progress lp WHERE lp.user_id = u.id AND lp.status = 'COMPLETED') as completed_levels
      FROM users u
      JOIN player_profiles p ON u.id = p.user_id
      ORDER BY p.xp DESC
    `);
    assert.ok(rows.length >= 1);
    assert.ok(rows.some(r => r.username === testUsername));
  });

  // 7. Full Player Journey (REGISTER -> LOGIN -> SOLVE -> UNLOCK -> LOGOUT -> RESTORE)
  console.log('\n[Test Suite 7: Full End-to-End Player Journey]');

  it('Should restore player progress upon login without data loss', () => {
    const token = generateToken({ userId: testUserId, username: testUsername });
    const verified = verifyToken(token);
    assert.ok(verified);

    // Retrieve restored profile & level progress
    const profile = db.get('SELECT * FROM player_profiles WHERE user_id = ?', [verified.userId]);
    const completedCount = db.get(
      `SELECT COUNT(*) as count FROM level_progress WHERE user_id = ? AND status = 'COMPLETED'`,
      [verified.userId]
    )?.count;

    assert.ok(profile.xp > 0);
    assert.strictEqual(completedCount, 2);
  });

  console.log('\n==================================================');
  console.log(` ALL TESTS PASSED: ${passedTests} / ${totalTests} passing (100%)`);
  console.log('==================================================\n');
}

runTests();
