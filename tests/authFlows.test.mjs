import { describe, test, assert, assertEqual } from './runTests.mjs';
import { AuthService } from '../js/services/authService.js';

describe('Authentication & Session Flow', () => {
  const auth = new AuthService();

  test('validates password length on login', async () => {
    let threw = false;
    try {
      await auth.login('ninja', '123');
    } catch (e) {
      threw = true;
    }
    assert(threw, 'Short password should throw error');
  });

  test('generates valid user session on registration', async () => {
    const res = await auth.register('code_warrior', 'warrior@githero.io', 'securePassword123');
    assert(res.success, 'Registration should succeed');
    assertEqual(res.user.username, '@code_warrior');
    assertEqual(res.user.email, 'warrior@githero.io');
  });
});
