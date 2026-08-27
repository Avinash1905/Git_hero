import { describe, test, assert, assertEqual } from './runTests.mjs';
import { ProgressService } from '../js/services/progressService.js';
import { LevelService } from '../js/services/levelService.js';

describe('Level Progression & Star Scoring Formulas', () => {
  const progressService = new ProgressService();
  const levelService = new LevelService();

  test('calculates 3 stars for par moves and time', () => {
    const levelDef = { commitsReq: 10 };
    const stars = progressService.calculateStars(levelDef, 8, 90);
    assertEqual(stars, 3);
  });

  test('calculates 2 stars for moderate move count', () => {
    const levelDef = { commitsReq: 10 };
    const stars = progressService.calculateStars(levelDef, 14, 110);
    assertEqual(stars, 2);
  });

  test('verifies total level count equals 30 handcrafted levels', () => {
    const levels = levelService.getAllLevels();
    assert(levels.length >= 30, `Must contain 30+ levels, found ${levels.length}`);
  });

  test('verifies all 6 worlds are structured properly', () => {
    const worlds = levelService.getAllWorlds();
    assertEqual(worlds.length, 6, 'Must contain 6 worlds');
  });
});
