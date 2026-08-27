// Frontend Unit Tests: API Resilience, Middleware & Export Services
import assert from 'node:assert';
import { ApiMiddleware } from '../../src/api/ApiMiddleware.js';
import { DiffAlgorithm } from '../../src/utils/DiffAlgorithm.js';

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

export async function runApiResilienceAndExportTests() {
  console.log('\n[Suite: API Resilience, Middleware & Diffing]');

  it('Should initialize API middleware resilience pipeline', () => {
    const middleware = new ApiMiddleware({ maxRetries: 2, baseDelayMs: 10 });
    assert.strictEqual(middleware.circuitState, 'CLOSED', 'Initial circuit breaker state should be CLOSED');
    assert.strictEqual(middleware.consecutiveFailures, 0, 'Initial failures should be 0');
  });

  it('Should compute Myers diff additions and deletions', () => {
    const oldText = 'const x = 1;\nconst y = 2;\nconsole.log(x);';
    const newText = 'const x = 1;\nconst y = 3;\nconsole.log(x);\nconsole.log(y);';

    const diff = DiffAlgorithm.computeDiff(oldText, newText);
    assert.ok(Array.isArray(diff) && diff.length > 0, 'Diff must be an array of tokens');
    const hasAdd = diff.some(d => d.type === 'add');
    assert.ok(hasAdd, 'Diff should contain added lines');
  });

  it('Should format diff tokens into ANSI terminal markup', () => {
    const oldText = 'const a = 1;';
    const newText = 'const a = 2;';
    const diff = DiffAlgorithm.computeDiff(oldText, newText);
    const ansiDiff = DiffAlgorithm.formatAnsiDiff(diff);
    assert.ok(typeof ansiDiff === 'string' && ansiDiff.length > 0, 'Formatted ANSI diff must be valid text');
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('api_resilience_export.test.js')) {
  runApiResilienceAndExportTests().then(() => console.log(`\nAll ${passed}/${total} API Resilience tests passed.`));
}

