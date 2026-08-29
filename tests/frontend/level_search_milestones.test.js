// Frontend Unit Tests: Level Search, Filter & Milestone Rewards Tree
import assert from 'node:assert';
import { LevelSearchFilter } from '../../src/features/levels/LevelSearchFilter.js';
import { MilestoneRewardsTree } from '../../src/levels/MilestoneRewardsTree.js';
import { LevelDetailInspector } from '../../src/levels/LevelDetailInspector.js';

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

export async function runLevelSearchAndMilestoneTests() {
  console.log('\n[Suite: Level Search, Multi-Facet Filters & Milestone Rewards]');

  const mockLevels = [
    { id: '01', name: 'Init', world: 1, difficulty: 'EASY', tags: ['PULL'] },
    { id: '02', name: 'Branching Out', world: 1, difficulty: 'EASY', tags: ['PULL'] },
    { id: '11', name: 'Laser Citadel', world: 2, difficulty: 'MEDIUM', tags: ['LASER'] },
    { id: '100', name: 'Circuit Nexus', world: 8, difficulty: 'HARD', tags: ['CIRCUIT'] }
  ];

  const mockProgress = {
    '01': { completed: true, stars: 3, unlocked: true },
    '02': { completed: false, stars: 0, unlocked: true },
    '11': { completed: false, stars: 0, unlocked: false },
    '100': { completed: false, stars: 0, unlocked: false }
  };

  it('Should filter levels by search query keyword', () => {
    const searchResults = LevelSearchFilter.filterLevels(mockLevels, mockProgress, { searchQuery: 'Laser' });
    assert.strictEqual(searchResults.length, 1, 'Search query should find 1 match');
    assert.strictEqual(searchResults[0].id, '11', 'Matched level should be 11');
  });

  it('Should filter levels by world and difficulty tier', () => {
    const worldResults = LevelSearchFilter.filterLevels(mockLevels, mockProgress, { world: 1, difficulty: 'EASY' });
    assert.strictEqual(worldResults.length, 2, 'Should match 2 levels in World 1');
  });

  it('Should filter levels by completion status', () => {
    const completedResults = LevelSearchFilter.filterLevels(mockLevels, mockProgress, { status: 'COMPLETED' });
    assert.strictEqual(completedResults.length, 1, 'Should find 1 completed level');
  });

  it('Should evaluate progression milestone unlock thresholds', () => {
    const milestones = MilestoneRewardsTree.evaluateMilestones(35);
    assert.strictEqual(milestones.length, MilestoneRewardsTree.MILESTONES.length, 'Should evaluate all milestones');
    assert.strictEqual(milestones[0].isUnlocked, true, 'First milestone (10 stars) should be unlocked');
    assert.strictEqual(milestones[1].isUnlocked, true, 'Second milestone (20 stars) should be unlocked');
    assert.strictEqual(milestones[2].isUnlocked, false, 'Third milestone (50 stars) should be locked');
  });

  it('Should render comprehensive level briefing card HTML', () => {
    const briefingHtml = LevelDetailInspector.renderBriefingCard(mockLevels[0], mockProgress['01']);
    assert.ok(typeof briefingHtml === 'string' && (briefingHtml.includes('Sector Entrance') || briefingHtml.includes('Init')), 'Briefing card should render');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('level_search_milestones.test.js')) {
  runLevelSearchAndMilestoneTests().then(() => console.log(`\nAll ${passed}/${total} Level Search tests passed.`));
}

