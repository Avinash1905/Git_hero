/**
 * Automated Frontend Test Suite: Modals, Sidebar & Tutorial Pages
 * Tests: Sidebar responsive modes, LevelInfoModal briefing, AchievementUnlockModal celebration, TutorialsPage
 */

import assert from 'node:assert';
import { renderSidebar } from '../../src/components/navigation/Sidebar.js';
import { renderLevelInfoModal } from '../../src/components/modals/LevelInfoModal.js';
import { renderAchievementUnlockModal } from '../../src/components/modals/AchievementUnlockModal.js';
import { renderTutorialsPage } from '../../src/pages/TutorialsPage.js';

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

export async function runModalsSidebarTests() {
  console.log('\n[Suite 22: Modals, Sidebar & Tutorial Pages]');

  it('Sidebar should render route links and adapt to collapsed mode', () => {
    const expanded = renderSidebar('dashboard', false);
    assert.ok(expanded.includes('id="app-sidebar"'));
    assert.ok(expanded.includes('Dashboard'));
    assert.ok(expanded.includes('250 Sectors'));

    const collapsed = renderSidebar('dashboard', true);
    assert.ok(collapsed.includes('w-20'));
  });

  it('LevelInfoModal should display level title, world, difficulty, and launch trigger', () => {
    const modal = renderLevelInfoModal({
      id: '15',
      number: 15,
      name: 'Merge Summit',
      world: 2,
      difficulty: 'MEDIUM',
      gridSize: 7,
      xpReward: 350
    }, { completed: true, stars: 3 });

    assert.ok(modal.includes('Sector 15'));
    assert.ok(modal.includes('Merge Summit'));
    assert.ok(modal.includes('World 2'));
    assert.ok(modal.includes('+350 XP'));
    assert.ok(modal.includes('id="level-info-launch-btn"'));
  });

  it('AchievementUnlockModal should render celebration badge and XP reward', () => {
    const modal = renderAchievementUnlockModal({
      id: 'ach-first-push',
      title: 'First Push',
      description: 'Pushed your first staged commit to remote origin.',
      xp_reward: 500,
      icon: 'upload'
    });

    assert.ok(modal.includes('Badge Unlocked'));
    assert.ok(modal.includes('First Push'));
    assert.ok(modal.includes('+500 XP'));
    assert.ok(modal.includes('id="achievement-ack-btn"'));
  });

  it('TutorialsPage should render world selectors and active tutorial mission', () => {
    const pageHtml = renderTutorialsPage(1);
    assert.ok(pageHtml.includes('20-World Git Curriculum'));
    assert.ok(pageHtml.includes('World 01'));
    assert.ok(pageHtml.includes('World 20'));
    assert.ok(pageHtml.includes('The Sacred Three Trees'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('modals_sidebar.test.js')) {
  runModalsSidebarTests().then(() => console.log(`\nAll ${passed}/${total} Modals & Sidebar tests passed.`));
}
