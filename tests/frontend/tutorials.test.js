/**
 * Automated Frontend Test Suite: 20-World Interactive Tutorials
 * Tests: TutorialCatalog coverage, TutorialRunner step evaluation, hint generation, view rendering
 */

import assert from 'node:assert';
import { TUTORIAL_CATALOG } from '../../src/features/tutorials/TutorialCatalog.js';
import { TutorialRunner } from '../../src/features/tutorials/TutorialRunner.js';
import { TutorialView } from '../../src/features/tutorials/TutorialView.js';

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

export async function runTutorialsTests() {
  console.log('\n[Suite 20: 20-World Interactive Tutorial Missions]');

  it('TutorialCatalog must contain exactly 20 interactive world missions', () => {
    assert.strictEqual(TUTORIAL_CATALOG.length, 20, 'Curriculum must contain 20 World tutorials');

    for (let w = 1; w <= 20; w++) {
      const tut = TUTORIAL_CATALOG.find(t => t.world === w);
      assert.ok(tut, `World ${w} must have a tutorial mission`);
      assert.ok(tut.title);
      assert.ok(tut.gitConcept);
      assert.ok(Array.isArray(tut.steps));
      assert.ok(tut.steps.length >= 1, `World ${w} tutorial must have at least 1 step`);
    }
  });

  it('TutorialRunner should evaluate correct commands and advance through steps', () => {
    const runner = new TutorialRunner('tut-01-foundations');
    assert.strictEqual(runner.currentStepIndex, 0);

    // Step 1 expects 'git status'
    const wrongRes = runner.evaluateCommand('git commit');
    assert.strictEqual(wrongRes.success, false);
    assert.ok(wrongRes.message.includes('Hint:'));
    assert.strictEqual(runner.currentStepIndex, 0);

    const step1Res = runner.evaluateCommand('git status');
    assert.strictEqual(step1Res.success, true);
    assert.strictEqual(runner.currentStepIndex, 1);

    // Step 2 expects 'git push'
    const step2Res = runner.evaluateCommand('git push');
    assert.strictEqual(step2Res.success, true);
    assert.strictEqual(runner.currentStepIndex, 2);

    // Step 3 expects 'git commit'
    const step3Res = runner.evaluateCommand('git commit');
    assert.strictEqual(step3Res.success, true);
    assert.strictEqual(step3Res.completedTutorial, true);
    assert.strictEqual(runner.isCompleted, true);
  });

  it('TutorialView should render step card and completion card', () => {
    const runner = new TutorialRunner('tut-01-foundations');
    const stepHtml = TutorialView.renderHtml(runner);
    assert.ok(stepHtml.includes('World 1 Curriculum'));
    assert.ok(stepHtml.includes('Step 1 of 3'));

    // Complete all steps
    runner.evaluateCommand('git status');
    runner.evaluateCommand('git push');
    runner.evaluateCommand('git commit');

    const doneHtml = TutorialView.renderHtml(runner);
    assert.ok(doneHtml.includes('Mission Accomplished!'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('tutorials.test.js')) {
  runTutorialsTests().then(() => console.log(`\nAll ${passed}/${total} Tutorials tests passed.`));
}
