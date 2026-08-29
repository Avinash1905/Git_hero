/**
 * Automated Frontend Test Suite: Git Attributes & Git Ignore
 * Tests: GitAttributesManager rules and GitIgnoreManager pattern exclusion engine
 */

import assert from 'node:assert';
import { GitAttributesManager } from '../../src/features/attributes/GitAttributesManager.js';
import { GitIgnoreManager } from '../../src/features/ignore/GitIgnoreManager.js';
import { renderGitAttributesPage } from '../../src/pages/GitAttributesPage.js';
import { renderGitIgnorePage } from '../../src/pages/GitIgnorePage.js';

let passed = 0;
let total = 0;

function it(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✕ ${name}`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

export async function runAttributesIgnoreTests() {
  console.log('\n[Suite 31: Git Attributes & Exclusion Patterns]');

  it('GitAttributesManager should manage path-specific attributes', () => {
    const manager = new GitAttributesManager();
    assert.strictEqual(manager.attributes.length, 5);

    manager.addAttribute('*.pdf', 'diff=pdf', 'Binary Diffing');
    assert.ok(manager.attributes.some(a => a.pattern === '*.pdf'));

    manager.removeAttribute('*.pdf');
    assert.ok(!manager.attributes.some(a => a.pattern === '*.pdf'));
  });

  it('GitIgnoreManager should match wildcard, directory, and secret file patterns', () => {
    const ignore = new GitIgnoreManager();

    assert.strictEqual(ignore.isPathIgnored('node_modules/express/index.js'), true);
    assert.strictEqual(ignore.isPathIgnored('server.log'), true);
    assert.strictEqual(ignore.isPathIgnored('.env.local'), true);
    assert.strictEqual(ignore.isPathIgnored('src/app.js'), false);
    assert.strictEqual(ignore.isPathIgnored('package.json'), false);
  });

  it('Pages should render HTML successfully without throwing', () => {
    assert.ok(renderGitAttributesPage().includes('Git Attributes Configuration'));
    assert.ok(renderGitIgnorePage().includes('Git Ignore Rules (.gitignore)'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('attributes_ignore.test.js')) {
  runAttributesIgnoreTests().then(() => console.log(`\nAll ${passed}/${total} Attributes & Ignore tests passed.`));
}
