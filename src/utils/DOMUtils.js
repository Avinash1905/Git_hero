/**
 * GitQuest Utility: DOM Manipulation, Safe Element Creation & Animation Helpers
 */

export class DOMUtils {
  static createElement(tag, attributes = {}, innerHtml = '') {
    const el = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) {
      if (key === 'className' || key === 'class') {
        el.className = value;
      } else if (key.startsWith('on') && typeof value === 'function') {
        el.addEventListener(key.substring(2).toLowerCase(), value);
      } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
      } else {
        el[key] = value;
      }
    }
    if (innerHtml) {
      el.innerHTML = innerHtml;
    }
    return el;
  }

  static addDelegatedListener(parentEl, eventType, selector, handler) {
    if (!parentEl) return () => {};
    const listener = (event) => {
      const target = event.target.closest(selector);
      if (target && parentEl.contains(target)) {
        handler(event, target);
      }
    };
    parentEl.addEventListener(eventType, listener);
    return () => parentEl.removeEventListener(eventType, listener);
  }

  static trapFocus(element) {
    if (!element) return () => {};
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    element.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => element.removeEventListener('keydown', handleKeyDown);
  }

  static triggerShake(element, durationMs = 400) {
    if (!element) return;
    element.classList.add('animate-shake');
    setTimeout(() => {
      element.classList.remove('animate-shake');
    }, durationMs);
  }

  static scrollToBottom(element, smooth = true) {
    if (!element) return;
    element.scrollTo({
      top: element.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }
}
