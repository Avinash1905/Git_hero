/**
 * useDebounce & useThrottle
 * Modular functional utilities for debouncing rapid terminal inputs and throttling scroll/resize events.
 */

export function debounce(fn, delayMs = 250) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
    }, delayMs);
  };
}

export function throttle(fn, limitMs = 100) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limitMs);
    }
  };
}
