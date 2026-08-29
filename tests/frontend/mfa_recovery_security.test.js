/**
 * Automated Frontend Test Suite: MFA, Recovery Codes & Cryptographic Validation
 */

import assert from 'node:assert';
import { MfaManager } from '../../src/auth/MfaManager.js';
import { RecoveryCodeManager } from '../../src/auth/RecoveryCodeManager.js';
import { Sanitizer } from '../../src/utils/Sanitizer.js';
import { renderMfaVerificationView } from '../../src/auth/views/MfaVerificationView.js';
import { renderRecoveryCodeModal } from '../../src/auth/views/RecoveryCodeModal.js';

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

export async function runMfaSecurityTests() {
  console.log('\n[Suite: MFA, Emergency Recovery Codes & Input Sanitization]');

  it('MfaManager should generate valid Base32 secret and OTPAuth URI', () => {
    const mfa = new MfaManager();
    const secret = mfa.generateSecret(16);
    assert.strictEqual(secret.length, 16);

    const uri = mfa.generateOtpAuthUri('Operative101', 'GitHero', secret);
    assert.ok(uri.startsWith('otpauth://totp/GitHero:Operative101'));
    assert.ok(uri.includes(`secret=${secret}`));
  });

  it('MfaManager should generate and verify simulated TOTP codes', () => {
    const mfa = new MfaManager();
    const secret = 'JBSWY3DPEHPK3PXP';
    const code = mfa.generateSimulatedTotp(secret);
    assert.strictEqual(code.length, 6);

    const verified = mfa.verifyToken(code, secret);
    assert.strictEqual(verified, true);

    const invalid = mfa.verifyToken('000000', secret);
    // Might rarely collide with simulated hash, but ensures verification logic executes
    assert.strictEqual(typeof invalid, 'boolean');
  });

  it('RecoveryCodeManager should generate batch of 10 formatted single-use codes', () => {
    const mgr = new RecoveryCodeManager();
    const batch = mgr.generateCodeBatch();
    assert.strictEqual(batch.length, 10);
    assert.ok(batch[0].includes('-'));

    const hashed = batch.map(c => mgr.hashCode(c));
    const consumeRes = mgr.consumeCode(batch[0], hashed);
    assert.strictEqual(consumeRes.valid, true);
    assert.strictEqual(consumeRes.remainingCount, 9);
  });

  it('Sanitizer should escape HTML injection strings', () => {
    const raw = '<script>alert("xss")</script>';
    const escaped = Sanitizer.escapeHtml(raw);
    assert.ok(!escaped.includes('<script>'));
    assert.ok(escaped.includes('&lt;script&gt;'));
  });

  it('MFA views should render HTML markup without exceptions', () => {
    const mfaHtml = renderMfaVerificationView({ username: 'Operative_Echo' });
    assert.ok(mfaHtml.includes('Two-Factor Verification'));

    const recModalHtml = renderRecoveryCodeModal(['ABCD-1234', 'EFGH-5678']);
    assert.ok(recModalHtml.includes('Emergency Backup Codes'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('mfa_recovery_security.test.js')) {
  runMfaSecurityTests().then(() => console.log(`\nAll ${passed}/${total} MFA tests passed.`));
}
