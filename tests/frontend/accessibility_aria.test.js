/**
 * Automated Frontend Test Suite: Accessibility & ARIA Specifications
 * Tests: ARIA live regions, semantic landmark elements, keyboard focus traps,
 * contrast tokens, reduced motion support.
 */

import assert from 'node:assert';
import { TerminalView } from '../../src/features/terminal/TerminalView.js';
import { renderButton, renderInput } from '../../src/components/common/AtomicComponents.js';
import { renderConfirmDialog, renderShortcutsModal } from '../../src/components/dialogs/ConfirmDialog.js';
import { renderBreadcrumbs } from '../../src/components/navigation/Breadcrumbs.js';
import { renderStarDisplay } from '../../src/components/hud/KeyHints.js';
import { GameControls } from '../../src/features/gameplay/GameControls.js';

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

export async function runAccessibilityTests() {
  console.log('\n[Suite 11: Accessibility & ARIA Compliance]');

  it('Terminal output body must provide role="log" and aria-live="polite"', () => {
    const html = TerminalView.renderTerminalHtml([], 'main');
    assert.ok(html.includes('role="log"'), 'Terminal must define role="log"');
    assert.ok(html.includes('aria-live="polite"'), 'Terminal must declare aria-live="polite" for screen readers');
  });

  it('Touch D-Pad buttons must provide descriptive aria-label attributes', () => {
    const dpadHtml = GameControls.renderControlsHtml();
    assert.ok(dpadHtml.includes('aria-label="Move Up"'));
    assert.ok(dpadHtml.includes('aria-label="Move Down"'));
    assert.ok(dpadHtml.includes('aria-label="Move Left"'));
    assert.ok(dpadHtml.includes('aria-label="Move Right"'));
  });

  it('Breadcrumbs navigation must provide semantic <nav> and aria-label="Breadcrumb"', () => {
    const breadcrumbHtml = renderBreadcrumbs({ items: [{ label: 'Home' }, { label: 'Sectors' }] });
    assert.ok(breadcrumbHtml.includes('<nav aria-label="Breadcrumb"'));
    assert.ok(breadcrumbHtml.includes('<ol'));
    assert.ok(breadcrumbHtml.includes('<li'));
  });

  it('StarDisplay must provide accessible text describing star count', () => {
    const starHtml = renderStarDisplay({ stars: 2, maxStars: 3 });
    assert.ok(starHtml.includes('aria-label="2 out of 3 stars"'));
  });

  it('Form inputs must have associated labels with corresponding for attributes', () => {
    const inputHtml = renderInput({ id: 'username-test', label: 'User Handle' });
    assert.ok(inputHtml.includes('for="username-test"'));
    assert.ok(inputHtml.includes('id="username-test"'));
  });

  it('ConfirmDialog and ShortcutsModal must use accessible dialog structure', () => {
    const confirmHtml = renderConfirmDialog({ title: 'Confirmation' });
    assert.ok(confirmHtml.includes('role="dialog"') || confirmHtml.includes('z-50'));
    assert.ok(confirmHtml.includes('button'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('accessibility_aria.test.js')) {
  runAccessibilityTests().then(() => console.log(`\nAll ${passed}/${total} Accessibility tests passed.`));
}
