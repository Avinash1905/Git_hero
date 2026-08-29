// Frontend Unit Tests: Engine Error Boundary & Resilience
import assert from 'node:assert';
import { EngineErrorBoundary } from '../../src/adapters/EngineErrorBoundary.js';

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

export async function runEngineErrorBoundaryTests() {
  console.log('\n[Suite 36: Engine Error Boundary & Self-Healing]');

  it('Should return result for normal safe execution', () => {
    const boundary = new EngineErrorBoundary(null);
    const res = boundary.safelyExecute('testAction', () => 42, 0);
    assert.strictEqual(res, 42, 'Successful execution should return output');
    assert.strictEqual(boundary.getErrorLog().length, 0, 'Error log must be empty');
  });

  it('Should catch exceptions, record error, and trigger adapter rollback', () => {
    let undoCalled = false;
    const mockAdapter = {
      currentLevelId: '01',
      undo: () => { undoCalled = true; },
      reset: () => {}
    };

    const boundary = new EngineErrorBoundary(mockAdapter);
    const fallbackRes = boundary.safelyExecute('failingAction', () => {
      throw new Error('Simulated engine exception');
    }, 'fallbackValue');

    assert.strictEqual(fallbackRes, 'fallbackValue', 'Should return fallback value on failure');
    assert.strictEqual(boundary.getErrorLog().length, 1, 'Error log should contain 1 error');
    assert.strictEqual(undoCalled, true, 'Error boundary should invoke undo rollback on adapter');
  });

  it('Should clear error log', () => {
    const boundary = new EngineErrorBoundary(null);
    boundary.handleEngineError('test', new Error('err'));
    boundary.clearErrors();
    assert.strictEqual(boundary.getErrorLog().length, 0, 'Clear errors should reset log');
  });

  return { passed, total };
}
