/**
 * GitQuest Engine Tests - Level Blueprints & Chamber Archetypes
 * Tests for ChamberBlueprint applying geometries to TileMap and catalog factory functions.
 */

import { TestSuite } from './TestRunner.js';
import { LevelBlueprintCatalog, BlueprintArchetype } from '../levels/blueprints/LevelBlueprints.js';
import { TileMap } from '../world/TileMap.js';

export function createLevelBlueprintsAndRoomsSuite() {
  const suite = new TestSuite('Level Blueprints & Chamber Archetypes');

  suite.test('LevelBlueprintCatalog generates Staging Chamber with interior geometry', (assert) => {
    const chamber = LevelBlueprintCatalog.createStagingChamber('chamber_stage_1', 2, 2, 8, 8);
    assert.equal(chamber.archetype, BlueprintArchetype.STAGING_CHAMBER);
    assert.equal(chamber.bounds.minX, 2);
    assert.equal(chamber.bounds.maxX, 9);

    const tileMap = new TileMap(16, 16, 'wall');
    chamber.applyToTileMap(tileMap);

    assert.isTrue(tileMap.isWalkable(3, 3));
    assert.isTrue(tileMap.isWall(6, 4)); // interior wall
  });

  suite.test('LevelBlueprintCatalog generates Security Vault with doors and pressure plates', (assert) => {
    const vault = LevelBlueprintCatalog.createSecurityVault('vault_alpha', 0, 0, 10, 10);
    assert.equal(vault.archetype, BlueprintArchetype.SECURITY_VAULT);
    assert.equal(vault.doors.length, 1);
    assert.equal(vault.switches.length, 1);
  });

  return suite;
}
