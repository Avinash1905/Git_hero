/**
 * GitQuest Utility: Input, Account, and Level Validation Suite
 */

export class ValidationUtils {
  static isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  }

  static isValidUsername(username) {
    if (!username || typeof username !== 'string') return false;
    const clean = username.trim().replace(/^@/, '');
    return /^[a-zA-Z0-9_-]{3,24}$/.test(clean);
  }

  static isStrongPassword(password) {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 6;
  }

  static validateRegistrationInput(username, email, password) {
    const errors = [];
    if (!this.isValidUsername(username)) {
      errors.push('Username must be 3-24 alphanumeric characters or underscores.');
    }
    if (!this.isValidEmail(email)) {
      errors.push('A valid email address is required.');
    }
    if (!this.isStrongPassword(password)) {
      errors.push('Password must be at least 6 characters.');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validateLevelDefinition(levelDef) {
    const errors = [];
    if (!levelDef) {
      return { isValid: false, errors: ['Level definition cannot be null'] };
    }
    if (!levelDef.id) errors.push('Missing level.id');
    if (!levelDef.player || typeof levelDef.player.x !== 'number' || typeof levelDef.player.y !== 'number') {
      errors.push('Invalid or missing player start coordinate');
    }
    if (!levelDef.box || typeof levelDef.box.x !== 'number' || typeof levelDef.box.y !== 'number') {
      errors.push('Invalid or missing box payload coordinate');
    }
    if (!levelDef.goal || typeof levelDef.goal.x !== 'number' || typeof levelDef.goal.y !== 'number') {
      errors.push('Invalid or missing goal coordinate');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static sanitizeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
