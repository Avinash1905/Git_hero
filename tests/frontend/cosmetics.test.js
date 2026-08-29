/**
 * Automated Frontend Test Suite: Cosmetics & Avatar Customization
 * Tests: Skin catalog, theme switching, XP unlocking requirements, state persistence
 */

import assert from 'node:assert';
import { AVATAR_CATALOG, TERMINAL_THEMES, CosmeticsStore } from '../../src/features/cosmetics/AvatarCatalog.js';
import { CosmeticsModal } from '../../src/features/cosmetics/CosmeticsModal.js';

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

export async function runCosmeticsTests() {
  console.log('\n[Suite 16: Cosmetics & Avatar Customization]');

  it('Default skin should be unlocked and equipped initially', () => {
    const store = new CosmeticsStore();
    assert.strictEqual(store.getState().equippedSkin, 'skin-default');
    assert.ok(store.getState().unlockedSkins.includes('skin-default'));
  });

  it('Equipping unlocked skin should succeed and update state', () => {
    const store = new CosmeticsStore();
    store.setState({ unlockedSkins: ['skin-default', 'skin-neon-phantom'] });

    const equipped = store.equipSkin('skin-neon-phantom');
    assert.strictEqual(equipped, true);
    assert.strictEqual(store.getState().equippedSkin, 'skin-neon-phantom');
  });

  it('Equipping locked skin should be prevented', () => {
    const store = new CosmeticsStore();
    const equipped = store.equipSkin('skin-godhead-prime');
    assert.strictEqual(equipped, false);
    assert.strictEqual(store.getState().equippedSkin, 'skin-default');
  });

  it('Unlocking skin should verify player XP before adding to unlocked list', () => {
    const store = new CosmeticsStore();
    // Neon Phantom costs 1200 XP
    const failRes = store.unlockSkin('skin-neon-phantom', 500);
    assert.strictEqual(failRes.success, false);
    assert.strictEqual(failRes.reason, 'Insufficient XP');

    const successRes = store.unlockSkin('skin-neon-phantom', 1500);
    assert.strictEqual(successRes.success, true);
    assert.ok(store.getState().unlockedSkins.includes('skin-neon-phantom'));
  });

  it('CosmeticsModal should render skins and terminal themes', () => {
    const html = CosmeticsModal.renderHtml(2000);
    assert.ok(html.includes('Customization Matrix'));
    assert.ok(html.includes('Cyberpunk Scout'));
    assert.ok(html.includes('Neon Phantom'));
    assert.ok(html.includes('Terminal Visual Themes'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('cosmetics.test.js')) {
  runCosmeticsTests().then(() => console.log(`\nAll ${passed}/${total} Cosmetics tests passed.`));
}
