/**
 * Automated Frontend Test Suite: UI Component Library & Design System
 * Tests: Buttons, Inputs, Cards, Modals, Toasts, Star Displays, D-Pad Controls, Accessibility
 */

import assert from 'node:assert';
import { renderButton, renderInput, renderBadge, renderProgressBar } from '../../src/components/common/AtomicComponents.js';
import { renderDropdown, renderTabs } from '../../src/components/common/Dropdown.js';
import { renderAccordionItem, renderTooltip } from '../../src/components/common/Accordion.js';
import { renderChip, renderSpinner } from '../../src/components/common/Chip.js';
import { renderStarDisplay, renderKeyHints } from '../../src/components/hud/KeyHints.js';
import { renderToast, renderEmptyState } from '../../src/components/feedback/Toast.js';
import { renderConfirmDialog, renderShortcutsModal } from '../../src/components/dialogs/ConfirmDialog.js';
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

export async function runUIComponentsTests() {
  console.log('\n[Suite 7: UI Components & Stitch Design Integrity]');

  it('Button should render variants, labels, icons, and disabled states', () => {
    const primaryBtn = renderButton({ text: 'Commit Changes', variant: 'primary', icon: 'check' });
    assert.ok(primaryBtn.includes('Commit Changes'));
    assert.ok(primaryBtn.includes('bg-primary'));
    assert.ok(primaryBtn.includes('check'));

    const disabledBtn = renderButton({ text: 'Locked', disabled: true });
    assert.ok(disabledBtn.includes('disabled'));
    assert.ok(disabledBtn.includes('opacity-50'));
  });

  it('Input component should render label, placeholder, and error states', () => {
    const inputHtml = renderInput({
      id: 'cmd-in',
      label: 'Terminal Command',
      placeholder: 'Enter git command...',
      error: 'Syntax error detected'
    });
    assert.ok(inputHtml.includes('Terminal Command'));
    assert.ok(inputHtml.includes('Enter git command...'));
    assert.ok(inputHtml.includes('Syntax error detected'));
  });

  it('Dropdown and Tabs should render accessible interactive controls', () => {
    const dropHtml = renderDropdown({
      id: 'world-select',
      options: [{ value: '1', label: 'World 1', selected: true }, { value: '2', label: 'World 2' }]
    });
    assert.ok(dropHtml.includes('World 1'));
    assert.ok(dropHtml.includes('selected'));

    const tabsHtml = renderTabs({
      tabs: [{ id: 'global', label: 'Global Standings', active: true }]
    });
    assert.ok(tabsHtml.includes('Global Standings'));
    assert.ok(tabsHtml.includes('bg-primary'));
  });

  it('StarDisplay should render accurate star ratings with fill styles', () => {
    const stars3 = renderStarDisplay({ stars: 3, maxStars: 3 });
    assert.ok(stars3.includes("font-variation-settings: 'FILL' 1;"));

    const stars1 = renderStarDisplay({ stars: 1, maxStars: 3 });
    assert.ok(stars1.includes("font-variation-settings: 'FILL' 0;"));
  });

  it('KeyHints and GameControls should render movement cues and 4-way D-Pad', () => {
    const hints = renderKeyHints({ hints: [{ key: 'W', label: 'Move Up' }] });
    assert.ok(hints.includes('<kbd'));
    assert.ok(hints.includes('Move Up'));

    const dpad = GameControls.renderControlsHtml();
    assert.ok(dpad.includes('id="btn-dpad-up"'));
    assert.ok(dpad.includes('id="btn-dpad-down"'));
    assert.ok(dpad.includes('id="btn-dpad-left"'));
    assert.ok(dpad.includes('id="btn-dpad-right"'));
  });

  it('Feedback dialogs (Confirm, Shortcuts, Toasts) should render faithfully', () => {
    const confirm = renderConfirmDialog({ title: 'Restart Sector' });
    assert.ok(confirm.includes('Restart Sector'));

    const shortcuts = renderShortcutsModal();
    assert.ok(shortcuts.includes('Tactical Keybindings'));

    const toast = renderToast({ id: 't1', message: 'Sync complete', type: 'success' });
    assert.ok(toast.includes('Sync complete'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('ui_components.test.js')) {
  runUIComponentsTests().then(() => console.log(`\nAll ${passed}/${total} UI Component tests passed.`));
}
