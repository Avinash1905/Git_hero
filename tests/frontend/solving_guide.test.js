/**
 * Automated Frontend Test Suite: GitHero Level Solving Guide
 * Tests: 10-step progression methodology, hard level tips, and common mistakes.
 */

import assert from 'node:assert';
import { 
  LEVEL_PASSING_STEPS, 
  HARD_LEVEL_TIPS, 
  COMMON_MISTAKES, 
  renderSolvingGuideHtml 
} from '../../src/features/manual/GitHeroSolvingGuide.js';

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

export async function runSolvingGuideTests() {
  console.log('\n[Suite: GitHero Level Solving Guide]');

  it('10-Step Solving Process must have exactly 10 ordered steps with title and description', () => {
    assert.strictEqual(LEVEL_PASSING_STEPS.length, 10);
    LEVEL_PASSING_STEPS.forEach((item, index) => {
      assert.strictEqual(item.step, index + 1);
      assert.ok(item.title && item.title.length > 5);
      assert.ok(item.description && item.description.length > 10);
    });

    assert.ok(LEVEL_PASSING_STEPS[0].title.includes('Objective'));
    assert.ok(LEVEL_PASSING_STEPS[9].title.includes('Next Unlocked Level'));
  });

  it('Hard level tips must cover route planning, commit quotas, branch gates, and pull interactions', () => {
    assert.ok(HARD_LEVEL_TIPS.length >= 8);
    assert.ok(HARD_LEVEL_TIPS.some(t => t.topic.includes('Route Planning')));
    assert.ok(HARD_LEVEL_TIPS.some(t => t.topic.includes('Commit Quotas')));
    assert.ok(HARD_LEVEL_TIPS.some(t => t.topic.includes('Status Checking')));
    assert.ok(HARD_LEVEL_TIPS.some(t => t.topic.includes('Branch Gates')));
    assert.ok(HARD_LEVEL_TIPS.some(t => t.topic.includes('Directional Pull')));
  });

  it('Common mistakes must address corner deadlocks, premature commits, and branch gates', () => {
    assert.ok(COMMON_MISTAKES.length >= 4);
    assert.ok(COMMON_MISTAKES.some(m => m.mistake.includes('Corner Deadlocks')));
    assert.ok(COMMON_MISTAKES.some(m => m.mistake.includes('Premature Commit')));
    assert.ok(COMMON_MISTAKES.some(m => m.mistake.includes('Branch Gate')));
  });

  it('renderSolvingGuideHtml should produce valid styled sections', () => {
    const html = renderSolvingGuideHtml();
    assert.ok(html.includes('How to Solve a Level (10-Step Guide)'));
    assert.ok(html.includes('Advanced Tips for Hard Levels'));
    assert.ok(html.includes('Common Mistakes & Deadlock Prevention'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('solving_guide.test.js')) {
  runSolvingGuideTests().then(() => console.log(`\nAll ${passed}/${total} Solving Guide tests passed.`));
}
