/**
 * Sanitizer
 * Cross-Site Scripting (XSS) prevention and string sanitization utilities.
 */

export class Sanitizer {
  /**
   * Escape HTML special characters for safe template string interpolation
   */
  static escapeHtml(str = '') {
    if (typeof str !== 'string') return String(str);
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Strip HTML tags from raw user strings
   */
  static stripTags(str = '') {
    if (typeof str !== 'string') return String(str);
    return str.replace(/<\/?[^>]+(>|$)/g, '');
  }

  /**
   * Sanitize username and display titles
   */
  static sanitizeIdentifier(str = '') {
    if (typeof str !== 'string') return '';
    return str.replace(/[^a-zA-Z0-9_\-\. ]/g, '').trim();
  }
}
