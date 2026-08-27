// Frontend Unit Tests: Input Queue Scheduler
import assert from 'node:assert';
import { InputQueueScheduler } from '../../src/adapters/InputQueueScheduler.js';

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

export async function runInputQueueSchedulerTests() {
  console.log('\n[Suite 37: Input Queue Scheduler]');

  it('Should enqueue input actions', () => {
    const scheduler = new InputQueueScheduler({ intervalMs: 10, maxQueueSize: 5 });
    scheduler.enqueue('MOVE', { dir: 'up' });
    scheduler.enqueue('MOVE', { dir: 'right' });
    assert.strictEqual(scheduler.length, 2, 'Queue length should be 2');
    scheduler.clear();
  });

  it('Should cap maximum queue size to prevent buffer bloat', () => {
    const scheduler = new InputQueueScheduler({ intervalMs: 10, maxQueueSize: 5 });
    for (let i = 0; i < 10; i++) {
      scheduler.enqueue('MOVE', { dir: 'down' });
    }
    assert.ok(scheduler.length <= 5, 'Queue length should be capped at maxQueueSize');
    scheduler.clear();
  });

  it('Should clear all queued inputs', () => {
    const scheduler = new InputQueueScheduler({ intervalMs: 10, maxQueueSize: 5 });
    scheduler.enqueue('MOVE', { dir: 'left' });
    scheduler.clear();
    assert.strictEqual(scheduler.length, 0, 'Clear should empty the queue');
  });

  return { passed, total };
}
