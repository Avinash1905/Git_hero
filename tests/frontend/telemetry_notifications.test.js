/**
 * Automated Frontend Test Suite: Telemetry & Notifications
 * Tests: Telemetry event logging, session analytics, NotificationCenter subscriber events
 */

import assert from 'node:assert';
import { TelemetryService } from '../../src/services/telemetryService.js';
import { NotificationCenter } from '../../src/components/notifications/NotificationCenter.js';

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

export async function runTelemetryNotificationsTests() {
  console.log('\n[Suite 21: Telemetry & Notification Center]');

  it('TelemetryService should record moves, pushes, pulls, commands and summarize stats', () => {
    const telemetry = new TelemetryService();
    telemetry.logEvent('GAME', 'MOVE');
    telemetry.logEvent('GAME', 'MOVE');
    telemetry.logEvent('GAME', 'PUSH');
    telemetry.logEvent('GAME', 'PULL');
    telemetry.logEvent('CLI', 'COMMAND', 'git status');

    const summary = telemetry.getSummary();
    assert.strictEqual(summary.totalMoves, 2);
    assert.strictEqual(summary.totalPushes, 1);
    assert.strictEqual(summary.totalPulls, 1);
    assert.strictEqual(summary.totalCommands, 1);
  });

  it('NotificationCenter should add broadcasts, track unread counts, and notify listeners', () => {
    const notif = new NotificationCenter();
    let notified = 0;

    const unsub = notif.subscribe((list, unread) => {
      notified++;
    });

    notif.addNotification({ title: 'New Sector', message: 'Sector 02 unlocked' });
    assert.strictEqual(notif.unreadCount, 1);
    assert.strictEqual(notif.notifications.length, 1);

    notif.markAllAsRead();
    assert.strictEqual(notif.unreadCount, 0);
    assert.strictEqual(notif.notifications[0].read, true);

    unsub();
  });

  it('NotificationCenter drawer should render semantic HTML list of broadcasts', () => {
    const html = NotificationCenter.renderDrawerHtml([
      { id: '1', title: 'Achievement Unlocked', message: 'First Commit', timestamp: '12:00', icon: 'military_tech', read: false }
    ], 1);

    assert.ok(html.includes('id="notification-drawer"'));
    assert.ok(html.includes('Transmissions'));
    assert.ok(html.includes('Achievement Unlocked'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('telemetry_notifications.test.js')) {
  runTelemetryNotificationsTests().then(() => console.log(`\nAll ${passed}/${total} Telemetry & Notifications tests passed.`));
}
