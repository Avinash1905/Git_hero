/**
 * Automated Frontend Test Suite: Daily & Weekly Quests
 * Tests: Quest tracking, telemetry event ingestion, completion, reward claiming
 */

import assert from 'node:assert';
import { QuestManager } from '../../src/features/quests/QuestManager.js';
import { QuestWidget } from '../../src/features/quests/QuestWidget.js';
import { playerStore } from '../../src/state/PlayerStore.js';

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

export async function runQuestsTests() {
  console.log('\n[Suite 17: Daily Quests & Mission Bounties]');

  const manager = new QuestManager();

  it('QuestManager should initialize daily and weekly quest templates', () => {
    const quests = manager.getActiveQuests();
    assert.ok(quests.length >= 4, 'Must load default active quests');
    assert.ok(quests.some(q => q.type === 'push_count'));
    assert.ok(quests.some(q => q.type === 'complete_levels'));
  });

  it('Recording telemetry events should advance progress', () => {
    const pushQuest = manager.getActiveQuests().find(q => q.type === 'push_count');
    const initialProgress = pushQuest.progress;

    manager.recordEvent('PUSH');
    assert.strictEqual(pushQuest.progress, initialProgress + 1);

    // Complete target
    manager.recordEvent('PUSH');
    manager.recordEvent('PUSH');
    assert.strictEqual(pushQuest.completed, true);
  });

  it('Claiming completed quest should award XP to PlayerStore', () => {
    const pushQuest = manager.getActiveQuests().find(q => q.type === 'push_count');
    pushQuest.completed = true;
    pushQuest.claimed = false;

    const initialXp = playerStore.getState().profile.xp || 0;
    const claimRes = manager.claimReward(pushQuest.id);

    assert.strictEqual(claimRes.success, true);
    assert.strictEqual(playerStore.getState().profile.xp, initialXp + pushQuest.rewardXp);
    assert.strictEqual(pushQuest.claimed, true);
  });

  it('QuestWidget should generate HTML bento card with progress bars', () => {
    const html = QuestWidget.renderHtml();
    assert.ok(html.includes('Active Assignments & Bounties'));
    assert.ok(html.includes('Precision Pusher'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('quests.test.js')) {
  runQuestsTests().then(() => console.log(`\nAll ${passed}/${total} Quests tests passed.`));
}
