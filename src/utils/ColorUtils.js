/**
 * GitQuest Utility: Color Palette Resolvers & Neon Filter Utilities
 */

export const CyberpunkColors = Object.freeze({
  SURFACE_BG: '#081425',
  SURFACE_CONTAINER: '#152031',
  SURFACE_HIGH: '#1f2a3c',
  PRIMARY_EMERALD: '#4edea3',
  SECONDARY_CYAN: '#adc6ff',
  TERTIARY_AMBER: '#ffb95f',
  ERROR_RUBY: '#ffb4ab',
  ON_SURFACE: '#d8e3fb',
  ON_SURFACE_VARIANT: '#bbcabf'
});

export class ColorUtils {
  static hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  }

  static hexToRgba(hex, alpha = 1) {
    const { r, g, b } = this.hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static getDifficultyBadgeClass(difficulty) {
    switch (difficulty) {
      case 'EASY':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'MEDIUM':
        return 'text-primary bg-primary/10 border-primary/30';
      case 'HARD':
        return 'text-tertiary bg-tertiary/10 border-tertiary/30';
      case 'EXPERT':
        return 'text-secondary bg-secondary/10 border-secondary/30';
      case 'MASTER':
      case 'GRANDMASTER':
      case 'BOSS':
        return 'text-error bg-error/10 border-error/30';
      default:
        return 'text-on-surface-variant bg-surface-variant/40 border-outline-variant/30';
    }
  }
}
