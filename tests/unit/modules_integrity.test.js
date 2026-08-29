/**
 * Automated Verification: All JS Modules Import & Static Syntax Integrity
 */

import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else if (file.endsWith('.js')) {
      results.push(fullPath);
    }
  });
  return results;
}

export async function testAllModulesIntegrity() {
  console.log('Running Complete Codebase Modules Integrity Suite...');

  const engineFiles = getFiles('./js/engine');
  const srcFiles = getFiles('./src');
  const allFiles = [...engineFiles, ...srcFiles];

  let failed = 0;
  for (const f of allFiles) {
    try {
      const url = 'file:///' + path.resolve(f).replace(/\\/g, '/');
      await import(url);
    } catch (e) {
      console.error(`  ✕ Failed import for ${f}:`, e.message);
      failed++;
    }
  }

  assert.strictEqual(failed, 0, `All ${allFiles.length} modules must import with zero errors.`);
  console.log(`  ✓ Successfully imported and verified all ${allFiles.length} modules.`);
}

if (process.argv[1]?.endsWith('modules_integrity.test.js')) {
  testAllModulesIntegrity();
}
