/**
 * Automated Frontend Test Suite: Git Visualizers, Rebase Planner & Terminal Tools
 */

import assert from 'node:assert';
import { BranchTopologyVisualizer } from '../../src/features/visualizer/BranchTopologyVisualizer.js';
import { RebaseInteractivePlanner } from '../../src/features/visualizer/RebaseInteractivePlanner.js';
import { StashShelfVisualizer } from '../../src/features/visualizer/StashShelfVisualizer.js';
import { CherryPickMatrix } from '../../src/features/visualizer/CherryPickMatrix.js';
import { GitSyntaxValidator } from '../../src/utils/GitSyntaxValidator.js';
import { TerminalAutocompleteEngine } from '../../src/terminal/TerminalAutocompleteEngine.js';

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

export async function runVisualizersTerminalTests() {
  console.log('\n[Suite: Git Visualizers, Rebase Planner & Terminal Tools]');

  it('BranchTopologyVisualizer should compute lanes and render SVG DAG', () => {
    const viz = new BranchTopologyVisualizer();
    const commits = [
      { sha: 'c1', branch: 'master', parents: [] },
      { sha: 'c2', branch: 'feature', parents: ['c1'] }
    ];
    const { nodes, edges } = viz.computeGraphLanes(commits);
    assert.strictEqual(nodes.length, 2);
    assert.strictEqual(edges.length, 1);

    const svg = viz.renderSvg(commits, 'c2');
    assert.ok(svg.includes('<svg'));
  });

  it('RebaseInteractivePlanner should reorder commits and squash linear history', () => {
    const planner = new RebaseInteractivePlanner();
    const list = [
      { sha: 'c1', message: 'feat 1', action: 'pick' },
      { sha: 'c2', message: 'feat 2', action: 'squash' }
    ];
    const compiled = planner.compileLinearHistory(list);
    assert.strictEqual(compiled.length, 1);
    assert.ok(compiled[0].squashedShas.includes('c2'));
  });

  it('StashShelfVisualizer & CherryPickMatrix should render semantic HTML', () => {
    const stashViz = new StashShelfVisualizer();
    const stashHtml = stashViz.renderHtml([{ message: 'WIP test', branch: 'master' }]);
    assert.ok(stashHtml.includes('Git Stash Shelf'));

    const cp = new CherryPickMatrix();
    const cpHtml = cp.renderHtml([{ sha: 'c123456', message: 'cherry test', branch: 'feature' }]);
    assert.ok(cpHtml.includes('Cherry-Pick Multi-Branch Matrix'));
  });

  it('GitSyntaxValidator & TerminalAutocompleteEngine should parse commands and suggest tokens', () => {
    const validator = new GitSyntaxValidator();
    const valid = validator.validate('git commit -m "solve sector"');
    assert.strictEqual(valid.isValid, true);
    assert.strictEqual(valid.command, 'commit');

    const invalid = validator.validate('git foobar');
    assert.strictEqual(invalid.isValid, false);

    const ac = new TerminalAutocompleteEngine();
    const suggestions = ac.getSuggestions('git st');
    assert.ok(suggestions.includes('status'));
    assert.ok(suggestions.includes('stash'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('visualizers_terminal_tools.test.js')) {
  runVisualizersTerminalTests().then(() => console.log(`\nAll ${passed}/${total} Visualizer tests passed.`));
}
