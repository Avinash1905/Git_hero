// Frontend Unit Tests: Session Auditor & Multi-Tab Sync
import assert from 'node:assert';
import { SessionAuditor } from '../../src/auth/SessionAuditor.js';

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

export async function runSessionAuditorTests() {
  console.log('\n[Suite 34: Session Auditor & Cross-Tab Activity]');

  it('Should initialize and enter listening state', () => {
    const auditor = new SessionAuditor({ idleTimeoutMs: 1000, refreshIntervalMs: 500 });
    auditor.start();
    assert.strictEqual(auditor.isListening, true, 'Auditor should be in listening state');
    auditor.stop();
  });

  it('Should record user activity timestamps', () => {
    const auditor = new SessionAuditor({ idleTimeoutMs: 1000 });
    auditor.start();
    const initialTime = auditor.lastActivityTime;
    auditor.recordActivity();
    assert.ok(auditor.lastActivityTime >= initialTime, 'recordActivity should update timestamp');
    auditor.stop();
  });

  it('Should trigger session expiration when idle time threshold is exceeded', () => {
    let expired = false;
    const auditor = new SessionAuditor({
      idleTimeoutMs: 100,
      onSessionExpired: () => { expired = true; }
    });
    auditor.start();
    auditor.lastActivityTime = Date.now() - 2000;
    auditor.checkIdleStatus();
    assert.strictEqual(expired, true, 'checkIdleStatus should trigger expiration');
  });

  it('Should cleanly stop listeners and timers', () => {
    const auditor = new SessionAuditor();
    auditor.start();
    auditor.stop();
    assert.strictEqual(auditor.isListening, false, 'Auditor should stop listening');
  });

  return { passed, total };
}
