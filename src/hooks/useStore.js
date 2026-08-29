/**
 * useStore Hook
 * Provides reactive subscription binding for arbitrary state stores within DOM components.
 */

export function createStoreHook(store) {
  return function useStore(selector = (s) => s, onChange = () => {}) {
    let currentState = selector(store.getState());

    const unsubscribe = store.subscribe((newState) => {
      const selected = selector(newState);
      if (selected !== currentState) {
        currentState = selected;
        onChange(selected);
      }
    });

    return {
      getState: () => selector(store.getState()),
      unsubscribe
    };
  };
}

/**
 * Convenience utility to bind store state changes to a DOM element's lifecycle
 * @param {Object} store
 * @param {Function} selector
 * @param {Function} renderFn
 * @returns {Function} Unsubscribe
 */
export function bindStoreToElement(store, selector, renderFn) {
  let prevVal = selector(store.getState());
  renderFn(prevVal);

  return store.subscribe((nextState) => {
    const nextVal = selector(nextState);
    if (nextVal !== prevVal) {
      prevVal = nextVal;
      renderFn(nextVal);
    }
  });
}
