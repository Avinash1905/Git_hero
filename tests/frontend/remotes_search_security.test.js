/**
 * Automated Frontend Test Suite: Remotes, Search Engine & Security Center
 * Tests: Remote refspecs, CommitSearchEngine pickaxe filtering, GPG signature verification
 */

import assert from 'node:assert';
import { RemoteTopologyMapper } from '../../src/features/remotes/RemoteTopologyMapper.js';
import { CommitSearchEngine } from '../../src/features/search/CommitSearchEngine.js';
import { GitSecurityCenter } from '../../src/features/security/GitSecurityCenter.js';
import { renderRemoteTopologyPage } from '../../src/pages/RemoteTopologyPage.js';
import { renderCommitSearchPage } from '../../src/pages/CommitSearchPage.js';
import { renderGitSecurityPage } from '../../src/pages/GitSecurityPage.js';

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

export async function runRemotesSearchSecurityTests() {
  console.log('\n[Suite 29: Remotes, Search Engine & Cryptographic Security]');

  it('RemoteTopologyMapper should add new remotes and configure refspecs', () => {
    const mapper = new RemoteTopologyMapper();
    const res = mapper.addRemote('staging', 'https://github.com/gitquest/staging.git');
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.remote.fetchRefspec, '+refs/heads/*:refs/remotes/staging/*');

    const duplicate = mapper.addRemote('staging', 'https://github.com/gitquest/staging.git');
    assert.strictEqual(duplicate.success, false);

    const removed = mapper.removeRemote('staging');
    assert.strictEqual(removed, true);
  });

  it('CommitSearchEngine should filter by author, query, and Pickaxe (-S) token', () => {
    const engine = new CommitSearchEngine();

    const authorFilter = engine.search({ author: 'Alpha' });
    assert.strictEqual(authorFilter.length, 2);

    const queryFilter = engine.search({ query: 'clipping' });
    assert.strictEqual(queryFilter.length, 1);
    assert.strictEqual(queryFilter[0].sha, 'c102');

    // Pickaxe: commits that introduce or remove 'teleportTo'
    const pickaxeFilter = engine.search({ pickaxe: 'teleportTo' });
    assert.strictEqual(pickaxeFilter.length, 2); // c103 introduced it, c104 removed it
  });

  it('GitSecurityCenter should verify signed commits against keyring', () => {
    const security = new GitSecurityCenter();

    const unsignedCommit = { sha: 'c101', signed: false };
    assert.strictEqual(security.verifyCommitSignature(unsignedCommit).status, 'UNVERIFIED');

    const signedValid = { sha: 'c102', signed: true, authorEmail: 'alpha@gitquest.internal' };
    assert.strictEqual(security.verifyCommitSignature(signedValid).status, 'VERIFIED');

    const signedUnknown = { sha: 'c103', signed: true, authorEmail: 'unknown@external.com' };
    assert.strictEqual(security.verifyCommitSignature(signedUnknown).status, 'UNKNOWN_KEY');
  });

  it('Pages should render HTML successfully without errors', () => {
    assert.ok(renderRemoteTopologyPage().includes('Git Remote Topology & Refspecs'));
    assert.ok(renderCommitSearchPage().includes('Git Commit Search & Pickaxe'));
    assert.ok(renderGitSecurityPage().includes('Git Security & Keyring Center'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('remotes_search_security.test.js')) {
  runRemotesSearchSecurityTests().then(() => console.log(`\nAll ${passed}/${total} Remotes, Search, Security tests passed.`));
}
