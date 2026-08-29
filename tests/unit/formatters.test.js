/**
 * Unit Tests: Formatters & Validation Utilities
 */

import assert from 'node:assert';
import { Formatters } from '../../src/utils/Formatters.js';
import { ValidationUtils } from '../../src/utils/ValidationUtils.js';

export function runFormatterAndValidationTests() {
  console.log('Running Formatters & Validation Unit Tests...');

  // Time formatters
  assert.strictEqual(Formatters.formatTime(0), '00:00');
  assert.strictEqual(Formatters.formatTime(65), '01:05');
  assert.strictEqual(Formatters.formatTime(3600), '60:00');
  assert.strictEqual(Formatters.formatTimeWithHours(3665), '01:01:05');

  // XP formatters
  assert.strictEqual(Formatters.formatXP(500), '500');
  assert.strictEqual(Formatters.formatXP(14500), '14.5k');
  assert.strictEqual(Formatters.formatXP(1200000), '1.2M');

  // Validation
  assert.strictEqual(ValidationUtils.isValidEmail('pilot@gitquest.io'), true);
  assert.strictEqual(ValidationUtils.isValidEmail('not-an-email'), false);

  assert.strictEqual(ValidationUtils.isValidUsername('@cyber_ninja'), true);
  assert.strictEqual(ValidationUtils.isValidUsername('ab'), false); // Too short

  const regCheck = ValidationUtils.validateRegistrationInput('dev_user', 'dev@repo.io', 'secure123');
  assert.strictEqual(regCheck.isValid, true);

  console.log('  ✓ Formatters & Validation tests passed successfully.');
}

if (process.argv[1]?.endsWith('formatters.test.js')) {
  runFormatterAndValidationTests();
}
