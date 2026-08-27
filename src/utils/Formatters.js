/**
 * GitQuest Utility: String, Date, XP, and Git Diff Formatters
 */

export class Formatters {
  static formatTime(totalSeconds) {
    const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  }

  static formatTimeWithHours(totalSeconds) {
    const sec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
    const hours = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const remainingSecs = sec % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  }

  static formatXP(xpAmount) {
    const num = Number(xpAmount) || 0;
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return String(num);
  }

  static formatNumberWithCommas(num) {
    return (Number(num) || 0).toLocaleString();
  }

  static formatShortHash(fullHash) {
    if (!fullHash) return '0000000';
    return String(fullHash).substring(0, 7);
  }

  static formatDate(isoString) {
    if (!isoString) return 'Pending';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  }

  static formatRelativeTime(isoString) {
    if (!isoString) return 'just now';
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now - date;
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return `${diffSec}s ago`;
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDays = Math.floor(diffHour / 24);
      return `${diffDays}d ago`;
    } catch {
      return 'recently';
    }
  }

  static formatDiffHighlight(diffText) {
    if (!diffText) return '';
    return diffText
      .split('\n')
      .map(line => {
        if (line.startsWith('+')) {
          return `<div class="text-primary bg-primary/10 px-1 font-mono">${line}</div>`;
        }
        if (line.startsWith('-')) {
          return `<div class="text-error bg-error/10 px-1 font-mono">${line}</div>`;
        }
        if (line.startsWith('@@')) {
          return `<div class="text-secondary bg-secondary/10 px-1 font-mono">${line}</div>`;
        }
        return `<div class="text-on-surface-variant font-mono px-1">${line}</div>`;
      })
      .join('');
  }
}
