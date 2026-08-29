/**
 * RecoveryCodeManager
 * Generates, hashes, stores, and validates single-use emergency backup recovery codes.
 */

export class RecoveryCodeManager {
  constructor() {
    this.codeCount = 10;
    this.codeSegmentLength = 4;
    this.codeSegments = 2; // e.g. XXXX-XXXX
    this.charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid easily confused characters (0, O, 1, I)
  }

  /**
   * Generate a batch of emergency recovery codes
   */
  generateCodeBatch() {
    const codes = [];
    for (let i = 0; i < this.codeCount; i++) {
      codes.push(this.generateSingleCode());
    }
    return codes;
  }

  /**
   * Generate a single formatted code
   */
  generateSingleCode() {
    const segments = [];
    for (let s = 0; s < this.codeSegments; s++) {
      let segment = '';
      for (let c = 0; c < this.codeSegmentLength; c++) {
        const randIndex = Math.floor(Math.random() * this.charset.length);
        segment += this.charset[randIndex];
      }
      segments.push(segment);
    }
    return segments.join('-');
  }

  /**
   * Simple hash for comparing recovery codes in offline/client store
   */
  hashCode(code) {
    const normalized = (code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    let hash = 5381;
    for (let i = 0; i < normalized.length; i++) {
      hash = ((hash << 5) + hash) + normalized.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Validate code against active hash list and mark consumed
   */
  consumeCode(inputCode, hashedList = []) {
    const targetHash = this.hashCode(inputCode);
    const index = hashedList.indexOf(targetHash);
    if (index !== -1) {
      const remaining = [...hashedList];
      remaining.splice(index, 1);
      return {
        valid: true,
        remainingCount: remaining.length,
        remainingHashedList: remaining
      };
    }
    return {
      valid: false,
      remainingCount: hashedList.length,
      remainingHashedList: hashedList
    };
  }

  /**
   * Export codes formatted for text download or printing
   */
  formatForExport(username, codes = [], generatedAt = new Date()) {
    const dateStr = generatedAt.toISOString().split('T')[0];
    const header = `=======================================================\n` +
                   ` GITHERO EMERGENCY RECOVERY CODES\n` +
                   ` Account: ${username}\n` +
                   ` Generated: ${dateStr}\n` +
                   `=======================================================\n\n` +
                   `Keep these codes safe. Each code can be used ONCE to\n` +
                   `access your GitHero operative account if you lose your MFA device.\n\n`;

    const codeList = codes.map((c, i) => ` [ ] ${(i + 1).toString().padStart(2, '0')}. ${c}`).join('\n');
    const footer = `\n\n-------------------------------------------------------\n` +
                   `Store these in a secure password manager or safe place.\n` +
                   `=======================================================`;

    return header + codeList + footer;
  }
}

export const recoveryCodeManager = new RecoveryCodeManager();
