/**
 * Automated Frontend Test Suite: Data Tables & Visualization Charts
 * Tests: DataTable, LevelProgressTable, ActivityHeatmap, WorldProgressRadar, CommandDistributionChart
 */

import assert from 'node:assert';
import { DataTable } from '../../src/components/tables/DataTable.js';
import { LevelProgressTable } from '../../src/components/tables/LevelProgressTable.js';
import { ActivityHeatmap } from '../../src/components/charts/ActivityHeatmap.js';
import { WorldProgressRadar, CommandDistributionChart } from '../../src/components/charts/WorldProgressRadar.js';

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

export async function runChartsTablesTests() {
  console.log('\n[Suite 15: Data Tables & Analytics Charts]');

  it('DataTable should render semantic table with columns and data cells', () => {
    const html = DataTable.renderTableHtml({
      columns: [
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name' }
      ],
      data: [
        { id: '1', name: 'Alpha' },
        { id: '2', name: 'Beta' }
      ]
    });

    assert.ok(html.includes('<table'));
    assert.ok(html.includes('scope="col"'));
    assert.ok(html.includes('Alpha'));
    assert.ok(html.includes('Beta'));
  });

  it('DataTable should render friendly empty message when data is empty', () => {
    const html = DataTable.renderTableHtml({ columns: [], data: [], emptyMessage: 'Zero items found' });
    assert.ok(html.includes('Zero items found'));
  });

  it('LevelProgressTable should generate rows with sector badges, stars, and launch buttons', () => {
    const levels = [
      { id: '01', number: 1, name: 'First Commit', world: 1, difficulty: 'EASY' },
      { id: '02', number: 2, name: 'Branching Out', world: 1, difficulty: 'MEDIUM' }
    ];
    const progress = {
      '01': { completed: true, stars: 3 },
      '02': { status: 'UNLOCKED', completed: false }
    };

    const html = LevelProgressTable.render(levels, progress);
    assert.ok(html.includes('#1'));
    assert.ok(html.includes('CLEARED'));
    assert.ok(html.includes('READY'));
    assert.ok(html.includes('Launch'));
  });

  it('ActivityHeatmap should generate 52-week SVG grid cells', () => {
    const html = ActivityHeatmap.renderHtml();
    assert.ok(html.includes('<svg'));
    assert.ok(html.includes('52-Week Repository Contributions'));
    assert.ok(html.includes('rect'));
  });

  it('WorldProgressRadar and CommandDistributionChart should render graphics properly', () => {
    const radarHtml = WorldProgressRadar.renderRadarSvg();
    assert.ok(radarHtml.includes('<polygon'));
    assert.ok(radarHtml.includes('Repository Discipline Radar'));

    const barHtml = CommandDistributionChart.renderHtml();
    assert.ok(barHtml.includes('git push'));
    assert.ok(barHtml.includes('git pull'));
    assert.ok(barHtml.includes('Command Frequency Distribution'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('charts_tables.test.js')) {
  runChartsTablesTests().then(() => console.log(`\nAll ${passed}/${total} Charts & Tables tests passed.`));
}
