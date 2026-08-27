// Frontend Unit Tests: Password Security & Policy Evaluator
import assert from 'node:assert';
import { PasswordSecurity } from '../../src/auth/PasswordSecurity.js';

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

export async function runPasswordSecurityTests() {
  console.log('\n[Suite 33: Password Security & Complexity Policy]');

  it('Should reject short passwords as invalid', () => {
    const shortResult = PasswordSecurity.evaluate('abc');
    assert.strictEqual(shortResult.isValid, false, 'Short password must be marked invalid');
    assert.strictEqual(shortResult.strength, 'VERY_WEAK', 'Short password strength should be VERY_WEAK');
  });

  it('Should evaluate valid moderate password accurately', () => {
    const modResult = PasswordSecurity.evaluate('GitHero2026');
    assert.ok(modResult.passedRequirements.includes('length'), 'Must pass length requirement');
    assert.ok(modResult.passedRequirements.includes('uppercase'), 'Must pass uppercase requirement');
    assert.ok(modResult.passedRequirements.includes('lowercase'), 'Must pass lowercase requirement');
    assert.ok(modResult.passedRequirements.includes('number'), 'Must pass number requirement');
    assert.strictEqual(modResult.isValid, true, 'Moderate password must be valid');
  });

  it('Should compute high entropy score for complex passwords', () => {
    const strongResult = PasswordSecurity.evaluate('GitQuest#SecOps$2026!');
    assert.strictEqual(strongResult.isValid, true, 'Strong password must be valid');
    assert.ok(strongResult.entropy > 60, 'Strong password must have high entropy');
  });

  it('Should render HTML strength meter widget without throwing', () => {
    const widgetHtml = PasswordSecurity.renderStrengthMeter('SecurePass!99');
    assert.ok(typeof widgetHtml === 'string' && widgetHtml.includes('password-strength-widget'), 'Widget HTML must render properly');
  });

  return { passed, total };
}
