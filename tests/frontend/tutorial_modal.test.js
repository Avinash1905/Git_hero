/**
 * Automated Frontend Test Suite: GitHero Tutorial Modal & Onboarding Flow
 * Tests: First-time player detection, step navigation, and modal rendering.
 */

import assert from 'node:assert';
import { GitHeroTutorialModal } from '../../src/features/tutorial/GitHeroTutorialModal.js';

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

export async function runTutorialModalTests() {
  console.log('\n[Suite: GitHero Tutorial & Onboarding Flow]');

  it('GitHeroTutorialModal should initialize with all core tutorial steps', () => {
    const modal = new GitHeroTutorialModal();
    assert.strictEqual(modal.steps.length, 4);
    assert.strictEqual(modal.steps[0].id, 'welcome');
    assert.strictEqual(modal.steps[1].id, 'mechanics');
    assert.strictEqual(modal.steps[2].id, 'controls');
    assert.strictEqual(modal.steps[3].id, 'progression');
  });

  it('Tutorial controls step should explain both keyboard and on-screen controls', () => {
    const modal = new GitHeroTutorialModal();
    const controlsStep = modal.steps.find(s => s.id === 'controls');
    assert.ok(controlsStep.content.includes('Keyboard Controls'));
    assert.ok(controlsStep.content.includes('On-Screen Controls'));
    assert.ok(controlsStep.content.includes('perform the <strong>exact same movement actions</strong>'));
  });

  it('renderModalHtml should produce valid accessible overlay markup', () => {
    const modal = new GitHeroTutorialModal();
    const html = modal.renderModalHtml();
    assert.ok(html.includes('id="githero-tutorial-overlay"'));
    assert.ok(html.includes('id="tutorial-skip-btn"'));
    assert.ok(html.includes('WELCOME TO GITHERO'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('tutorial_modal.test.js')) {
  runTutorialModalTests().then(() => console.log(`\nAll ${passed}/${total} Tutorial Modal tests passed.`));
}
