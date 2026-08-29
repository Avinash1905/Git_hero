/**
 * GitQuest Engine Tests - Distributed Git & Pull Requests
 * Tests for RemotePeer, UpstreamMergeCoordinator, PR reviews, and simulated asynchronous network syncing.
 */

import { TestSuite } from './TestRunner.js';
import { RemotePeer, UpstreamMergeCoordinator } from '../distributed/RemotePeer.js';
import { NetworkSimulation } from '../distributed/NetworkSimulation.js';

export function createDistributedGitAndPRsSuite() {
  const suite = new TestSuite('Distributed Git & Pull Requests');

  suite.test('RemotePeer submits PR and UpstreamMergeCoordinator handles reviews', (assert) => {
    const coordinator = new UpstreamMergeCoordinator();
    const alice = new RemotePeer('Alice');
    coordinator.registerPeer(alice);

    const pr = alice.submitPullRequest('feature/new-level', 'main', 'feat: add puzzle level 57');
    assert.isTrue(pr.isOpen);
    assert.isFalse(pr.isApproved());

    coordinator.openPR(pr);

    // Merge fails without approvals
    const failedMerge = coordinator.mergePR(pr.id);
    assert.isFalse(failedMerge.success);

    // Lead architect approves PR
    coordinator.approvePR(pr.id, 'LeadMaintainer');
    assert.isTrue(pr.isApproved());

    const successMerge = coordinator.mergePR(pr.id);
    assert.isTrue(successMerge.success);
    assert.isTrue(pr.isMerged);
  });

  suite.test('NetworkSimulation handles online/offline packet queuing', (assert) => {
    const net = new NetworkSimulation(10);
    let received = false;

    net.send('git_fetch', { branch: 'main' }, () => {
      received = true;
    });

    net.flush();
    assert.isTrue(received);
  });

  return suite;
}
