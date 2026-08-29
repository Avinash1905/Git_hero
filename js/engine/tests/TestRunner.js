/**
 * GitQuest Engine - Automated Test Runner
 * Self-contained testing harness with assertions, test suites, timing, and formatting.
 */

export class Assert {
  static isTrue(val, msg = '') {
    if (!val) {
      throw new Error(`Assertion failed: Expected true, got ${val}. ${msg}`);
    }
  }

  static isFalse(val, msg = '') {
    if (val) {
      throw new Error(`Assertion failed: Expected false, got ${val}. ${msg}`);
    }
  }

  static equal(actual, expected, msg = '') {
    if (actual !== expected) {
      throw new Error(`Assertion failed: Expected ${expected}, got ${actual}. ${msg}`);
    }
  }

  static notEqual(actual, expected, msg = '') {
    if (actual === expected) {
      throw new Error(`Assertion failed: Expected values to differ, but both were ${actual}. ${msg}`);
    }
  }

  static deepEqual(actual, expected, msg = '') {
    const aStr = JSON.stringify(actual);
    const eStr = JSON.stringify(expected);
    if (aStr !== eStr) {
      throw new Error(`Assertion failed: Deep equality mismatch.\nActual:   ${aStr}\nExpected: ${eStr}\n${msg}`);
    }
  }

  static throws(fn, msg = '') {
    let threw = false;
    try {
      fn();
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new Error(`Assertion failed: Expected function to throw error. ${msg}`);
    }
  }

  static exists(val, msg = '') {
    if (val === null || val === undefined) {
      throw new Error(`Assertion failed: Expected value to exist, got ${val}. ${msg}`);
    }
  }
}

export class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
  }

  test(testName, testFn) {
    this.tests.push({ name: testName, fn: testFn });
  }

  async run() {
    const results = {
      name: this.name,
      passed: 0,
      failed: 0,
      total: this.tests.length,
      errors: []
    };

    for (const t of this.tests) {
      try {
        await t.fn(Assert);
        results.passed++;
      } catch (err) {
        results.failed++;
        results.errors.push({ test: t.name, error: err.message, stack: err.stack });
      }
    }

    return results;
  }
}

export class MasterTestRunner {
  constructor() {
    this.suites = [];
  }

  addSuite(suite) {
    this.suites.push(suite);
  }

  async runAll() {
    console.log('====================================================');
    console.log('🚀 Running GitQuest Game Engine Automated Test Suite');
    console.log('====================================================\n');

    let totalPassed = 0;
    let totalFailed = 0;
    let totalTests = 0;
    const suiteResults = [];

    for (const suite of this.suites) {
      const res = await suite.run();
      suiteResults.push(res);
      totalPassed += res.passed;
      totalFailed += res.failed;
      totalTests += res.total;

      const statusIcon = res.failed === 0 ? '✓' : '✗';
      console.log(`${statusIcon} ${res.name}: ${res.passed}/${res.total} passed`);

      if (res.errors.length > 0) {
        for (const err of res.errors) {
          console.error(`   - [FAIL] ${err.test}: ${err.error}`);
        }
      }
    }

    console.log('\n====================================================');
    console.log(`📊 Test Summary: ${totalPassed}/${totalTests} tests passed (${totalFailed} failed)`);
    console.log('====================================================\n');

    return {
      passed: totalPassed,
      failed: totalFailed,
      total: totalTests,
      allPassed: totalFailed === 0,
      suites: suiteResults
    };
  }
}
