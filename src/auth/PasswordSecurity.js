// GitHero Password Security & Complexity Evaluator
// Authoritative client-side password policy validation and entropy calculation.

export class PasswordSecurity {
  /**
   * Password policy requirements
   */
  static REQUIREMENTS = [
    { id: 'length', label: 'At least 8 characters long', test: (pwd) => pwd.length >= 8 },
    { id: 'lowercase', label: 'Contains at least one lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
    { id: 'uppercase', label: 'Contains at least one uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
    { id: 'number', label: 'Contains at least one numeric digit (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
    { id: 'special', label: 'Contains at least one special character (!@#$%^&*)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  /**
   * Calculate password entropy in bits
   * @param {string} password 
   * @returns {number}
   */
  static calculateEntropy(password) {
    if (!password) return 0;
    let poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += 33;
    if (poolSize === 0) return 0;
    return Math.round(password.length * (Math.log(poolSize) / Math.log(2)));
  }

  /**
   * Evaluate full password strength metrics
   * @param {string} password 
   * @returns {{
   *   score: number,
   *   strength: 'VERY_WEAK' | 'WEAK' | 'MODERATE' | 'STRONG' | 'EXCELLENT',
   *   color: string,
   *   entropy: number,
   *   passedRequirements: string[],
   *   failedRequirements: string[],
   *   isValid: boolean,
   *   feedback: string
   * }}
   */
  static evaluate(password = '') {
    const passed = [];
    const failed = [];

    for (const req of this.REQUIREMENTS) {
      if (req.test(password)) {
        passed.push(req.id);
      } else {
        failed.push(req.id);
      }
    }

    const entropy = this.calculateEntropy(password);
    let score = passed.length;
    if (password.length >= 14) score += 1;
    if (password.length >= 18) score += 1;

    let strength = 'VERY_WEAK';
    let color = '#ff5555';
    let feedback = 'Password is too short and easily guessable.';

    if (score <= 2 || entropy < 25) {
      strength = 'VERY_WEAK';
      color = '#ff5555';
      feedback = 'Very weak. Add uppercase, numbers, and special symbols.';
    } else if (score === 3 || entropy < 40) {
      strength = 'WEAK';
      color = '#ffb86c';
      feedback = 'Weak. Consider increasing length and character variety.';
    } else if (score === 4 || entropy < 60) {
      strength = 'MODERATE';
      color = '#f1fa8c';
      feedback = 'Moderate strength. Meets baseline security standards.';
    } else if (score === 5 && entropy >= 60 && entropy < 80) {
      strength = 'STRONG';
      color = '#50fa7b';
      feedback = 'Strong password! Resistant to dictionary and brute-force attacks.';
    } else {
      strength = 'EXCELLENT';
      color = '#8be9fd';
      feedback = 'Excellent cryptographic complexity. Highly secure.';
    }

    const isValid = passed.length >= 4 && password.length >= 8;

    return {
      score,
      strength,
      color,
      entropy,
      passedRequirements: passed,
      failedRequirements: failed,
      isValid,
      feedback
    };
  }

  /**
   * Render real-time password strength meter HTML widget
   * @param {string} password 
   * @returns {string}
   */
  static renderStrengthMeter(password = '') {
    const evalResult = this.evaluate(password);
    const percentage = Math.min(100, Math.round((evalResult.score / 7) * 100));

    const checkList = this.REQUIREMENTS.map(req => {
      const isPassed = evalResult.passedRequirements.includes(req.id);
      return `
        <div class="flex items-center gap-2 text-xs ${isPassed ? 'text-primary' : 'text-outline'}">
          <span class="material-symbols-Outlined text-sm">${isPassed ? 'check_circle' : 'radio_button_unchecked'}</span>
          <span>${req.label}</span>
        </div>
      `;
    }).join('');

    return `
      <div id="password-strength-widget" class="mt-2 p-3 bg-surface-container-low rounded border border-outline-variant/30 text-xs">
        <div class="flex justify-between items-center mb-1">
          <span class="text-on-surface-variant font-medium">Password Strength:</span>
          <span class="font-bold" style="color: ${evalResult.color}">${evalResult.strength} (${evalResult.entropy} bits)</span>
        </div>
        <div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-2">
          <div class="h-full transition-all duration-300 rounded-full" style="width: ${percentage}%; background-color: ${evalResult.color}"></div>
        </div>
        <div class="space-y-1 mb-2">
          ${checkList}
        </div>
        <p class="text-on-surface-variant italic">${evalResult.feedback}</p>
      </div>
    `;
  }
}
