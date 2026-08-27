/**
 * Automated Frontend Test Suite: Resilient API, Offline Queue & Response Caching
 */

import assert from 'node:assert';
import { ResilientApiClient } from '../../src/api/ResilientApiClient.js';
import { OfflineRequestQueue } from '../../src/api/OfflineRequestQueue.js';
import { ResponseCacheManager } from '../../src/api/ResponseCacheManager.js';
import { TelemetryAnalyticsPipeline } from '../../src/services/TelemetryAnalyticsPipeline.js';

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

export async function runApiOfflineCacheTests() {
  console.log('\n[Suite: Resilient API, Offline Queue & Cache Manager]');

  it('ResilientApiClient should initialize with configurable baseUrl and retry limits', () => {
    const client = new ResilientApiClient({ baseUrl: 'http://localhost:3000/api', maxRetries: 2 });
    assert.strictEqual(client.baseUrl, 'http://localhost:3000/api');
    assert.strictEqual(client.maxRetries, 2);
  });

  it('OfflineRequestQueue should enqueue actions and manage queue lifecycle', () => {
    const queue = new OfflineRequestQueue();
    queue.clear();
    const item = queue.enqueue({ endpoint: '/progress/complete', body: { level_id: '01' } });
    assert.strictEqual(item.endpoint, '/progress/complete');
    assert.strictEqual(queue.getQueue().length, 1);
    queue.clear();
    assert.strictEqual(queue.getQueue().length, 0);
  });

  it('ResponseCacheManager should handle TTL expiration and tag-based invalidation', () => {
    const cache = new ResponseCacheManager({ defaultTtlMs: 1000 });
    cache.set('key1', { data: 'test' }, { tags: ['levels'] });
    assert.deepStrictEqual(cache.get('key1'), { data: 'test' });

    cache.invalidateByTag('levels');
    assert.strictEqual(cache.get('key1'), null);
  });

  it('TelemetryAnalyticsPipeline should buffer events and aggregate metrics', () => {
    const pipeline = new TelemetryAnalyticsPipeline();
    pipeline.flush();
    pipeline.logEvent('gameplay', 'level_completed', { level: '01' });
    pipeline.logEvent('error', 'laser_collision', { turn: 5 });

    const metrics = pipeline.getMetricsSummary();
    assert.strictEqual(metrics.totalEvents, 2);
    assert.strictEqual(metrics.errorCount, 1);
    assert.strictEqual(metrics.levelSolves, 1);
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('api_offline_cache.test.js')) {
  runApiOfflineCacheTests().then(() => console.log(`\nAll ${passed}/${total} API Cache tests passed.`));
}
