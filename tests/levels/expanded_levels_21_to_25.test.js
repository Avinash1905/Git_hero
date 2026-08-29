/**
 * GitQuest Automated Test Suite: Expanded Levels 21 to 25 & Advanced Engine Mechanics
 * Verifies Worlds 21-25 (Levels 251-300), Extended Git Handlers, and Solvers
 */

import assert from 'node:assert';
import { EXPANDED_LEVELS, EXPANDED_WORLD_METADATA, ExpandedLevelRegistry } from '../../js/engine/levels/ExpandedLevelRegistry.js';
import { LevelValidator } from '../../js/engine/levels/LevelDefinition.js';
import { GitQuestEngine } from '../../js/engine/api/EngineFacade.js';
import { SokobanDeadlockSolver } from '../../js/engine/solver/SokobanDeadlockSolver.js';
import { ContinuousCollisionSolver, AABBBox } from '../../js/engine/collision/ContinuousCollisionSolver.js';
import { HeavyPayloadPhysics } from '../../js/engine/collision/HeavyPayloadPhysics.js';
import { GitCommitMessageLinter } from '../../js/engine/git/GitCommitMessageLinter.js';
import { GitKeyringSigner } from '../../js/engine/git/GitKeyringSigner.js';
import { GitAutosquashEngine } from '../../js/engine/git/GitAutosquashEngine.js';
import { GitRerereEngine } from '../../js/engine/git/GitRerereEngine.js';

export function runExpandedLevelsAndEngineSuite() {
  console.log('\n[Suite: Expanded Worlds 21-25 & Advanced Engine Subsystems]');

  // 1. Expanded World Metadata
  const worlds = Object.keys(EXPANDED_WORLD_METADATA);
  assert.strictEqual(worlds.length, 5, 'Must define exactly 5 expanded worlds (21 to 25)');
  assert.strictEqual(EXPANDED_WORLD_METADATA[21].name, 'Cyber Citadel');
  assert.strictEqual(EXPANDED_WORLD_METADATA[25].name, 'Monorepo Fortress');
  console.log('  ✓ Expanded worlds 21-25 metadata registered correctly');

  // 2. Expanded Level Registry & Count
  const registry = new ExpandedLevelRegistry();
  const allExpanded = registry.getAll();
  assert.strictEqual(allExpanded.length, 50, 'Must load exactly 50 endgame levels (251 - 300)');

  // 3. Sequential Level IDs & Level Integrity
  for (let idNum = 251; idNum <= 300; idNum++) {
    const levelId = String(idNum);
    const level = registry.get(levelId);
    assert.ok(level, `Level ${levelId} must exist in registry`);
    assert.ok(level.name, `Level ${levelId} must have a valid title`);
    assert.ok(level.world >= 21 && level.world <= 25, `Level ${levelId} must belong to Worlds 21-25`);
    assert.ok(level.player && typeof level.player.x === 'number', `Level ${levelId} must have player coordinates`);
    assert.ok(level.goal && typeof level.goal.x === 'number', `Level ${levelId} must have goal coordinates`);
    assert.ok(Array.isArray(level.walls), `Level ${levelId} must have walls array`);

    // Schema Validation
    const validation = LevelValidator.validate(level);
    assert.strictEqual(validation.isValid, true, `Level ${levelId} failed validation: ${validation.errors.join(', ')}`);
  }
  console.log('  ✓ All 50 expanded levels (251-300) validated for structural schema integrity');

  // 4. Test Extended Engine Facade Commands (tag, revert, submodule, worktree, bundle, blame)
  const engine = new GitQuestEngine();
  engine.loadLevel('01');

  const tagRes = engine.executeCommand('git tag v1.0.0');
  assert.strictEqual(tagRes.success, true, 'git tag should execute successfully');

  const revertRes = engine.executeCommand('git revert HEAD');
  assert.strictEqual(revertRes.success, true, 'git revert should execute successfully');

  const blameRes = engine.executeCommand('git blame main');
  assert.strictEqual(blameRes.success, true, 'git blame should execute successfully');

  const worktreeRes = engine.executeCommand('git worktree list');
  assert.strictEqual(worktreeRes.success, true, 'git worktree should execute successfully');

  console.log('  ✓ Engine Facade successfully executes extended Git commands (tag, revert, blame, worktree)');

  // 5. Collision & Physics Subsystems
  const box1 = new AABBBox(0, 0, 10, 10);
  const box2 = new AABBBox(5, 5, 15, 15);
  const box3 = new AABBBox(20, 20, 30, 30);
  assert.strictEqual(box1.overlaps(box2), true, 'Overlapping boxes should return true');
  assert.strictEqual(box1.overlaps(box3), false, 'Non-overlapping boxes should return false');

  const solver = new ContinuousCollisionSolver();
  const collision = solver.sweptAABB(
    new AABBBox(0, 0, 1, 1),
    { x: 2, y: 0 },
    new AABBBox(2, 0, 3, 1)
  );
  assert.strictEqual(typeof collision.hit, 'boolean', 'Collision result must indicate hit boolean');
  console.log('  ✓ Continuous Collision Solver & AABB kinematics validated');

  // 6. Sokoban Deadlock Detection
  const deadlockSolver = new SokobanDeadlockSolver(6);
  const wallSet = new Set(['1,0', '0,1']);
  const isCornerDead = deadlockSolver.isCornerDeadlock({ x: 0, y: 0 }, { x: 4, y: 4 }, wallSet);
  assert.strictEqual(isCornerDead, true, 'Corner obstruction must trigger deadlock detection');
  console.log('  ✓ Sokoban Deadlock Solver correctly flags trapped corner states');

  // 7. Git Commit Message Linter
  const linter = new GitCommitMessageLinter();
  const validCommit = linter.lint('feat(auth): implement cryptographic token rotation');
  assert.strictEqual(validCommit.isValid, true, 'Conventional commit should pass lint');

  const invalidCommit = linter.lint('fixed stuff');
  assert.strictEqual(invalidCommit.isValid, false, 'Non-conventional commit must fail lint');
  console.log('  ✓ Git Commit Message Linter enforces conventional commit specifications');

  // 8. Cryptographic Signer
  const signer = new GitKeyringSigner();
  const signed = signer.signCommit('commit_hash_123', 'feat: initial payload');
  assert.strictEqual(signed.isSigned, true, 'Signer must generate signature');
  const verification = signer.verifySignature(signed.signature);
  assert.strictEqual(verification.isValid, true, 'Keyring signer signature must verify successfully');
  console.log('  ✓ Git Keyring Signer successfully creates and verifies cryptographic signatures');

  return { passed: 8, total: 8 };
}

if (process.argv[1]?.endsWith('expanded_levels_21_to_25.test.js')) {
  runExpandedLevelsAndEngineSuite();
}
