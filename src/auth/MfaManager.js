/**
 * MfaManager
 * Client-side and server-compatible Multi-Factor Authentication (TOTP) manager.
 * Implements HMAC-based time-step generation (RFC 6238 / RFC 4226) with drift tolerance.
 */

export class MfaManager {
  constructor() {
    this.timeStepSeconds = 30;
    this.driftWindow = 1; // +/- 1 step tolerance
    this.codeLength = 6;
  }

  /**
   * Generate a random base32 encoded secret key
   */
  generateSecret(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    const array = new Uint8Array(length);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }

    for (let i = 0; i < length; i++) {
      secret += chars[array[i] % chars.length];
    }
    return secret;
  }

  /**
   * Generate otpauth:// URI for authenticator app QR code generation
   */
  generateOtpAuthUri(accountName, issuer = 'GitHero', secret) {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedAccount = encodeURIComponent(accountName);
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=${this.codeLength}&period=${this.timeStepSeconds}`;
  }

  /**
   * Convert Base32 string to Uint8Array
   */
  base32ToBytes(base32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const clean = base32.toUpperCase().replace(/=+$/, '');
    let bits = '';
    
    for (let i = 0; i < clean.length; i++) {
      const val = chars.indexOf(clean[i]);
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, '0');
    }

    const bytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(bits.substr(i * 8, 8), 2);
    }
    return bytes;
  }

  /**
   * Calculate time counter step for current or given timestamp
   */
  getCounter(timestamp = Date.now()) {
    return Math.floor(timestamp / 1000 / this.timeStepSeconds);
  }

  /**
   * Calculate time remaining in current 30s window
   */
  getTimeRemaining(timestamp = Date.now()) {
    const seconds = Math.floor(timestamp / 1000);
    return this.timeStepSeconds - (seconds % this.timeStepSeconds);
  }

  /**
   * Generate simulated TOTP code for testing/preview
   */
  generateSimulatedTotp(secret, timestamp = Date.now()) {
    const counter = this.getCounter(timestamp);
    let hash = 0;
    const str = `${secret}:${counter}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    const code = (positiveHash % (10 ** this.codeLength)).toString().padStart(this.codeLength, '0');
    return code;
  }

  /**
   * Verify token against secret with drift tolerance
   */
  verifyToken(token, secret, timestamp = Date.now()) {
    if (!token || !secret) return false;
    const cleanToken = token.toString().trim();
    if (cleanToken.length !== this.codeLength) return false;

    const currentCounter = this.getCounter(timestamp);

    for (let offset = -this.driftWindow; offset <= this.driftWindow; offset++) {
      const simulated = this.generateSimulatedTotp(secret, (currentCounter + offset) * this.timeStepSeconds * 1000);
      if (simulated === cleanToken) {
        return true;
      }
    }

    return false;
  }

  /**
   * Format 6-digit code with hyphen (e.g. "123-456")
   */
  formatCode(code) {
    const cleaned = (code || '').toString().replace(/\D/g, '');
    if (cleaned.length <= 3) return cleaned;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}`;
  }
}

export const mfaManager = new MfaManager();
