/**
 * GitQuest Master Test Suite Runner
 */

import { runMathTests } from './unit/math.test.js';
import { runFormatterAndValidationTests } from './unit/formatters.test.js';
import { runPuzzleEngineTests } from './unit/puzzle_engines.test.js';
import { runAll250LevelsIntegrityTest } from './levels/solvability_worlds_1_to_20.test.js';
import { testWorlds1To5 } from './worlds/worlds_1_to_5.test.js';
import { testWorlds6To10 } from './worlds/worlds_6_to_10.test.js';
import { testWorlds11To20 } from './worlds/worlds_11_to_20_multiverse.test.js';
import { testCommandEngine } from './commands/command_engine_suite.test.js';
import { testWorld01 } from './worlds/individual/world_01_solvability.test.js';
import { testWorld02 } from './worlds/individual/world_02_solvability.test.js';
import { testWorld03 } from './worlds/individual/world_03_solvability.test.js';
import { testWorld04And05 } from './worlds/individual/world_04_solvability.test.js';
import { testWorld05And06 } from './worlds/individual/world_05_solvability.test.js';
import { testWorlds07To10 } from './worlds/individual/world_07_solvability.test.js';
import { testEndgameWorlds11To20 } from './worlds/individual/worlds_11_to_20_solvability.test.js';
import { runExpandedLevelsAndEngineSuite } from './levels/expanded_levels_21_to_25.test.js';
import { runBackendIntegrationSuite } from './integration/backend_suite.test.js';
import { testAllModulesIntegrity } from './unit/modules_integrity.test.js';

async function runMasterSuite() {
  console.log('\n========================================================');
  console.log(' GITQUEST MASTER AUTOMATED TEST RUNNER');
  console.log('========================================================\n');

  try {
    await testAllModulesIntegrity();
    runMathTests();
    runFormatterAndValidationTests();
    runPuzzleEngineTests();
    runAll250LevelsIntegrityTest();
    testWorlds1To5();
    testWorlds6To10();
    testWorlds11To20();
    testWorld01();
    testWorld02();
    testWorld03();
    testWorld04And05();
    testWorld05And06();
    testWorlds07To10();
    testEndgameWorlds11To20();
    runExpandedLevelsAndEngineSuite();
    testCommandEngine();
    runBackendIntegrationSuite();

    console.log('\n========================================================');
    console.log(' ALL SUITES PASSED SUCCESSFULLY (100%)');
    console.log('========================================================\n');
  } catch (err) {
    console.error('\nTest Suite Failure:', err);
    process.exit(1);
  }
}

runMasterSuite();
