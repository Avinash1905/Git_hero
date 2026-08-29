/**
 * AnimationController
 * Frame ticker, interpolation utilities, and easing curves for UI and arena sprite animations.
 */

export class AnimationController {
  /**
   * Linear interpolation between two numbers
   */
  static lerp(start, end, alpha) {
    return start + (end - start) * Math.max(0, Math.min(1, alpha));
  }

  /**
   * Cubic ease out curve
   */
  static easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Ease in-out quad curve
   */
  static easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  /**
   * Spring / elastic easing
   */
  static easeOutElastic(t) {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  }

  /**
   * Run a timed tween animation
   * @param {Object} options
   * @param {number} options.duration - Duration in milliseconds
   * @param {Function} options.onUpdate - Callback(progress: 0..1)
   * @param {Function} [options.onComplete] - Callback on finish
   * @param {Function} [options.easing] - Easing function
   * @returns {Function} Cancel function
   */
  static animate({ duration = 300, onUpdate, onComplete, easing = this.easeOutCubic }) {
    const startTime = performance.now();
    let cancelled = false;
    let animId;

    const tick = (now) => {
      if (cancelled) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = easing(progress);

      if (typeof onUpdate === 'function') {
        onUpdate(eased);
      }

      if (progress < 1) {
        animId = requestAnimationFrame(tick);
      } else {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (animId) cancelAnimationFrame(animId);
    };
  }
}
