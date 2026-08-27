/**
 * GitHero Production-Grade Automated Test Runner (Zero Dependencies)
 * Discovers and executes all unit, integration, and puzzle verification test suites.
 */

// Setup mock browser globals for Node.js test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear()
  };
}

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

export function describe(suiteName, fn) {
  console.log(`\n\x1b[36m▶ [SUITE] ${suiteName}\x1b[0m`);
  fn();
}

export function test(testName, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  \x1b[32m✔\x1b[0m ${testName}`);
  } catch (error) {
    failedTests++;
    console.error(`  \x1b[31m✖ ${testName}\x1b[0m`);
    console.error(`    \x1b[90m${error.stack || error.message}\x1b[0m`);
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new Error(message);
  }
}

export function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message} Expected: ${JSON.stringify(expected)}, but received: ${JSON.stringify(actual)}`);
  }
}

export function assertDeepEqual(actual, expected, message = '') {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message} Expected: ${JSON.stringify(expected)}, but received: ${JSON.stringify(actual)}`);
  }
}

// Auto-run if executed directly via Node
async function main() {
  console.log('\x1b[35m====================================================\x1b[0m');
  console.log('\x1b[35m       GITHERO AUTOMATED TEST SUITE RUNNER         \x1b[0m');
  console.log('\x1b[35m====================================================\x1b[0m');

  await import('./commandParser.test.mjs');
  await import('./movementEngine.test.mjs');
  await import('./pullMechanism.test.mjs');
  await import('./levelProgression.test.mjs');
  await import('./levels10_11_12.test.mjs');
  await import('./terminalHistory.test.mjs');
  await import('./gameStateTransitions.test.mjs');
  await import('./authFlows.test.mjs');

  console.log('\n\x1b[35m====================================================\x1b[0m');
  console.log(`\x1b[1mTEST SUMMARY:\x1b[0m Total: ${totalTests} | \x1b[32mPassed: ${passedTests}\x1b[0m | \x1b[31mFailed: ${failedTests}\x1b[0m`);
  console.log('\x1b[35m====================================================\x1b[0m');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

if (process.argv[1]?.endsWith('runTests.mjs')) {
  main();
}
