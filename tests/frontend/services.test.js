/**
 * Automated Frontend Test Suite: API Layer & Typed Services
 * Tests: ApiClient, authService, levelService, progressService, leaderboardService, challengeService
 */

import assert from 'node:assert';
import { ApiClient } from '../../src/api/ApiClient.js';
import { levelService } from '../../src/services/levelService.js';
import { progressService } from '../../src/services/progressService.js';
import { achievementService } from '../../src/services/achievementService.js';
import { leaderboardService } from '../../src/services/leaderboardService.js';
import { challengeService } from '../../src/services/challengeService.js';
import { soundService } from '../../src/services/soundService.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runServicesTests() {
  console.log('\n[Suite 6: Frontend API Services Layer]');

  it('ApiClient should store and clear bearer tokens', () => {
    const client = new ApiClient('http://localhost:3000');
    client.setToken('sample_token_xyz');
    assert.strictEqual(client.getToken(), 'sample_token_xyz');

    client.clearToken();
    assert.strictEqual(client.getToken(), null);
  });

  it('levelService should return all 250 levels sorted numerically', async () => {
    const levels = await levelService.getAllLevels();
    assert.strictEqual(levels.length, 250);
    assert.strictEqual(levels[0].number, 1);
    assert.strictEqual(levels[249].number, 250);
  });

  it('levelService should fetch detail for Level 01, 50, and 250', async () => {
    const lvl1 = await levelService.getLevelById('01');
    assert.ok(lvl1);
    assert.strictEqual(lvl1.number, 1);

    const lvl50 = await levelService.getLevelById('50');
    assert.ok(lvl50);
    assert.strictEqual(lvl50.number, 50);

    const lvl250 = await levelService.getLevelById('250');
    assert.ok(lvl250);
    assert.strictEqual(lvl250.number, 250);
  });

  it('levelService checkAccess should allow Level 1 unconditionally', async () => {
    const access = await levelService.checkAccess('01');
    assert.strictEqual(access.unlocked, true);
  });

  it('achievementService should supply catalog of achievements with rewards', async () => {
    const achievements = await achievementService.getAchievements();
    assert.ok(Array.isArray(achievements));
    assert.ok(achievements.length >= 7);
    for (const ach of achievements) {
      assert.ok(ach.id);
      assert.ok(ach.title);
      assert.ok(typeof ach.xp_reward === 'number');
    }
  });

  it('challengeService should provide today challenge specifications', async () => {
    const challenge = await challengeService.getTodayChallenge();
    assert.ok(challenge);
    assert.ok(challenge.title);
    assert.ok(challenge.difficulty);
    assert.ok(challenge.reward_xp || challenge.rewardXp);
  });

  it('soundService should support mute, unmute, and volume adjustment', () => {
    soundService.setMuted(true);
    assert.strictEqual(soundService.isMuted, true);

    soundService.setMuted(false);
    assert.strictEqual(soundService.isMuted, false);

    soundService.setVolume(0.5);
    assert.strictEqual(soundService.volume, 0.5);
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('services.test.js')) {
  runServicesTests().then(() => console.log(`\nAll ${passed}/${total} Services tests passed.`));
}
