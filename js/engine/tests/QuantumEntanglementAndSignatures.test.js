/**
 * GitQuest Engine Tests - Quantum Entanglement & GPG Signature Verification
 * Tests for dual-crate entangled movement (synchronous, mirrored, inverted) and cryptographic GPG commit signatures.
 */

import { TestSuite } from './TestRunner.js';
import { QuantumEntangledPair, QuantumEntanglementSolver, EntanglementMode } from '../puzzles/mechanisms/QuantumEntanglementSolver.js';
import { GPGKey, GitCommitSignatureVerifier } from '../git/GitCommitSignatureVerifier.js';

export function createQuantumEntanglementAndSignaturesSuite() {
  const suite = new TestSuite('Quantum Entanglement & GPG Signatures');

  suite.test('QuantumEntanglementSolver calculates synchronous and mirrored partner crate steps', (assert) => {
    const worldMock = { isWalkable: () => true };
    const crateA = { id: 'crateA', position: { x: 2, y: 2 } };
    const crateB = { id: 'crateB', position: { x: 10, y: 2 } };

    const emMock = {
      updatePosition: (ent, nx, ny) => {
        ent.position.x = nx;
        ent.position.y = ny;
      }
    };

    const solver = new QuantumEntanglementSolver(worldMock, emMock);
    const pair = new QuantumEntangledPair('pair1', crateA, crateB, EntanglementMode.MIRROR_X);
    solver.registerPair(pair);

    // Moving crateA right (+1, 0) causes crateB to move left (-1, 0)
    solver.notifyCrateMoved(crateA, 1, 0);
    assert.equal(crateB.position.x, 9);
    assert.equal(crateB.position.y, 2);
  });

  suite.test('GitCommitSignatureVerifier signs and verifies GPG commit signatures', (assert) => {
    const verifier = new GitCommitSignatureVerifier();
    const gpgKey = new GPGKey('KEY_ALPHA_77', 'Linus Torvalds <linus@gitquest.dev>');
    verifier.importKey(gpgKey);

    const commitHash = 'e4a1b029486c9123847291a78942187648123984';
    const signature = verifier.signCommit(commitHash, 'KEY_ALPHA_77');

    assert.exists(signature);
    assert.isTrue(signature.includes('BEGIN PGP SIGNATURE'));

    const verification = verifier.verifyCommitSignature(commitHash, signature);
    assert.isTrue(verification.verified);
    assert.equal(verification.owner, 'Linus Torvalds <linus@gitquest.dev>');
  });

  return suite;
}
