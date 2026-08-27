/**
 * TerminalAnsiRenderer
 * Full ANSI escape sequence parser and color token renderer converting terminal ANSI outputs into styled HTML.
 */

export class TerminalAnsiRenderer {
  /**
   * Convert ANSI escape codes to HTML styled spans
   */
  static renderToHtml(ansiText = '') {
    if (!ansiText) return '';

    let html = ansiText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Standard ANSI colors
    html = html
      .replace(/\x1b\[31m(.*?)\x1b\[0m/g, '<span class="text-rose-400 font-bold">$1</span>')
      .replace(/\x1b\[32m(.*?)\x1b\[0m/g, '<span class="text-primary font-bold">$1</span>')
      .replace(/\x1b\[33m(.*?)\x1b\[0m/g, '<span class="text-amber-400 font-bold">$1</span>')
      .replace(/\x1b\[34m(.*?)\x1b\[0m/g, '<span class="text-sky-400 font-bold">$1</span>')
      .replace(/\x1b\[35m(.*?)\x1b\[0m/g, '<span class="text-purple-400 font-bold">$1</span>')
      .replace(/\x1b\[36m(.*?)\x1b\[0m/g, '<span class="text-cyan-400 font-bold">$1</span>')
      .replace(/\x1b\[1m(.*?)\x1b\[0m/g, '<span class="font-bold text-white">$1</span>')
      .replace(/\x1b\[2m(.*?)\x1b\[0m/g, '<span class="opacity-60">$1</span>')
      .replace(/\x1b\[\d+m/g, ''); // Strip remaining unhandled escapes

    return html;
  }
}
