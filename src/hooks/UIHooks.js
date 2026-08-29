/**
 * GitQuest Custom Hooks: Terminal, Responsive Layout, Audio, and Global Keyboard Management
 */

export function useTerminal(gitCli) {
  const execute = (rawCommand) => {
    if (!gitCli) return null;
    return gitCli.execute(rawCommand);
  };

  const getPreviousHistory = () => {
    return gitCli ? gitCli.getPreviousHistory() : '';
  };

  const getNextHistory = () => {
    return gitCli ? gitCli.getNextHistory() : '';
  };

  return {
    execute,
    getPreviousHistory,
    getNextHistory
  };
}

export function useResponsive() {
  const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 768;
  const isTablet = () => typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
  const isDesktop = () => typeof window !== 'undefined' && window.innerWidth >= 1024;

  const onResize = (callback) => {
    if (typeof window === 'undefined') return () => {};
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  };

  return { isMobile, isTablet, isDesktop, onResize };
}

export function useKeyboard(keyMap = {}) {
  const attach = () => {
    if (typeof window === 'undefined') return () => {};
    const handler = (e) => {
      const handlerFn = keyMap[e.key] || keyMap[e.code];
      if (handlerFn) {
        handlerFn(e);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  };

  return { attach };
}
