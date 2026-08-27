/**
 * Automated Frontend Test Suite: World Progression Engine, Recommendations & Solutions
 */

import assert from 'node:assert';
import { WorldProgressionEngine } from '../../src/levels/WorldProgressionEngine.js';
import { LevelRecommender } from '../../src/levels/LevelRecommender.js';
import { LevelSolutionValidator } from '../../src/levels/LevelSolutionValidator.js';
import { LevelPresetCatalog } from '../../src/levels/LevelPresetCatalog.js';

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

export async function runLevelProgressionTests() {
  console.log('\n[Suite: World Progression Engine, Recommender & Solution Validator]');

  it('WorldProgressionEngine should calculate world unlock gates across all 20 worlds', () => {
    const engine = new WorldProgressionEngine();
    assert.strictEqual(engine.totalWorlds, 20);

    const world1Unlocked = engine.isWorldUnlocked(1, []);
    assert.strictEqual(world1Unlocked, true);

    const world2Locked = engine.isWorldUnlocked(2, []);
    assert.strictEqual(world2Locked, false);

    const world1Summary = engine.getWorldSummary(1, [{ id: 1, stars: 3 }]);
    assert.strictEqual(world1Summary.starsCollected, 3);
  });

  it('LevelRecommender should suggest next sequential level and render briefing card', () => {
    const recommender = new LevelRecommender();
    const rec = recommender.getRecommendation({}, [], [{ id: 1, stars: 3 }]);
    assert.strictEqual(rec.nextSequentialId, 2);

    const html = recommender.renderHtml(rec);
    assert.ok(html.includes('Recommended Mission'));
  });

  it('LevelSolutionValidator should evaluate move par scoring and generate anti-cheat checksum', () => {
    const validator = new LevelSolutionValidator();
    const result = validator.evaluateSolution(
      { id: '01', par_moves: 10, par_time: 30, xp_reward: 100 },
      { moves: 8, durationSeconds: 20 }
    );
    assert.strictEqual(result.stars, 3);
    assert.strictEqual(result.isOptimal, true);
    assert.ok(result.checksum.length >= 8);
  });

  it('LevelPresetCatalog should provide theme presets for all 20 worlds', () => {
    const catalog = new LevelPresetCatalog();
    const theme = catalog.getWorldTheme(1);
    assert.ok('glow' in theme);
    assert.ok('bg' in theme);
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('levels_progression_engine.test.js')) {
  runLevelProgressionTests().then(() => console.log(`\nAll ${passed}/${total} Progression tests passed.`));
}
