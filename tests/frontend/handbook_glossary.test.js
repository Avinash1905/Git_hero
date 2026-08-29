/**
 * Automated Frontend Test Suite: Handbook & Technical Glossary
 * Tests: Handbook command lookups, syntax schemas, glossary definitions, category indexing
 */

import assert from 'node:assert';
import { GIT_COMMAND_HANDBOOK } from '../../src/features/manual/GitCommandHandbook.js';
import { GIT_GLOSSARY } from '../../src/features/manual/GitGlossary.js';

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

export async function runHandbookGlossaryTests() {
  console.log('\n[Suite 24: Git Handbook & Technical Glossary]');

  it('Handbook must document core Git commands with synopsis, flags, and puzzle applications', () => {
    assert.ok(GIT_COMMAND_HANDBOOK.length >= 15);

    const requiredCommands = [
      'git init', 'git status', 'git add', 'git commit', 'git push',
      'git pull', 'git branch', 'git switch', 'git merge', 'git rebase',
      'git cherry-pick', 'git stash', 'git bisect', 'git worktree', 'git submodule'
    ];

    for (const req of requiredCommands) {
      const cmd = GIT_COMMAND_HANDBOOK.find(c => c.name === req);
      assert.ok(cmd, `Command "${req}" must be documented in handbook`);
      assert.ok(cmd.synopsis);
      assert.ok(cmd.description);
      assert.ok(cmd.puzzleApplication);
      assert.ok(Array.isArray(cmd.flags));
      assert.ok(Array.isArray(cmd.examples));
    }
  });

  it('Glossary must define foundational version control computer science terms', () => {
    assert.ok(GIT_GLOSSARY.length >= 20);

    const requiredTerms = [
      'Directed Acyclic Graph (DAG)', 'Blob Object', 'Tree Object',
      'Commit Object', 'HEAD', 'Detached HEAD', 'Index (Staging Area)',
      'Fast-Forward Merge', 'Lowest Common Ancestor (LCA)', 'Rebase',
      'Reflog', 'Worktree', 'Submodule', 'Sparse Checkout', 'Packfile'
    ];

    for (const termName of requiredTerms) {
      const entry = GIT_GLOSSARY.find(g => g.term.includes(termName) || termName.includes(g.term));
      assert.ok(entry, `Term "${termName}" must be defined in glossary`);
      assert.ok(entry.definition);
      assert.ok(entry.category);
    }
  });

  it('Handbook search filter should locate commands by partial keyword', () => {
    const searchMatches = GIT_COMMAND_HANDBOOK.filter(c => 
      c.name.toLowerCase().includes('rebase') || c.description.toLowerCase().includes('rebase')
    );
    assert.ok(searchMatches.length >= 1);
    assert.ok(searchMatches.some(c => c.name === 'git rebase'));
  });

  return { passed, total };
}

if (process.argv[1] && process.argv[1].endsWith('handbook_glossary.test.js')) {
  runHandbookGlossaryTests().then(() => console.log(`\nAll ${passed}/${total} Handbook & Glossary tests passed.`));
}
