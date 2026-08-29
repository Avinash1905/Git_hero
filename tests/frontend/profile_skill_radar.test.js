/**
 * Automated Frontend Test Suite: Skill Mastery Radar, Heatmaps & Badges
 */

import assert from 'node:assert';
import { SkillMasteryRadar } from '../../src/features/profile/SkillMasteryRadar.js';
import { ActivityHeatmap } from '../../src/features/profile/ActivityHeatmap.js';
import { BadgeShowcase } from '../../src/features/profile/BadgeShowcase.js';
import { AvatarTitleStudio } from '../../src/features/profile/AvatarTitleStudio.js';

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

export async function runProfileAnalyticsTests() {
  console.log('\n[Suite: Skill Mastery Radar, Activity Heatmap & Badges]');

  it('SkillMasteryRadar should calculate 6 discipline mastery scores and render SVG', () => {
    const radar = new SkillMasteryRadar();
    const scores = radar.evaluateSkills([{ id: 1, worldId: 1 }, { id: 25, worldId: 3 }], ['first_commit']);
    assert.strictEqual(typeof scores.branching, 'number');
    assert.strictEqual(typeof scores.merging, 'number');

    const svg = radar.renderSvg(scores);
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('Git Skill Mastery Radar'));
  });

  it('ActivityHeatmap should generate 26-week calendar matrix and streak stats', () => {
    const heatmap = new ActivityHeatmap({ weeks: 10 });
    const history = [
      { date: new Date().toISOString().split('T')[0], count: 3 }
    ];
    const matrix = heatmap.generateActivityMatrix(history);
    assert.strictEqual(matrix.activeDays, 1);
    assert.ok(matrix.cells.length > 0);

    const html = heatmap.renderHtml(history);
    assert.ok(html.includes('Sector Activity Matrix'));
  });

  it('BadgeShowcase should manage pinned badges and render slot cards', () => {
    const showcase = new BadgeShowcase();
    const pinned = showcase.getPinnedBadges(['first_commit'], ['first_commit']);
    assert.strictEqual(pinned.length, 1);
    assert.strictEqual(pinned[0].name, 'First Commit');

    const html = showcase.renderHtml(['first_commit'], ['first_commit']);
    assert.ok(html.includes('Showcase Badges'));
  });

  it('AvatarTitleStudio should evaluate title unlocks and avatar icons', () => {
    const studio = new AvatarTitleStudio();
    const titles = studio.getAvailableTitles(25, 25, 3);
    const unlockedTitles = titles.filter(t => t.unlocked);
    assert.ok(unlockedTitles.length >= 2);

    const html = studio.renderHtml({ level: 15, title: 'Branch Weaver', avatar: 'cyber_hero' });
    assert.ok(html.includes('Operative Identity & Titles'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('profile_skill_radar.test.js')) {
  runProfileAnalyticsTests().then(() => console.log(`\nAll ${passed}/${total} Profile tests passed.`));
}
