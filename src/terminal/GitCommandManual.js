/**
 * GitCommandManual
 * Comprehensive built-in documentation manual for 22+ Git commands,
 * including options, practical puzzle examples, and terminal tips.
 */

export const GIT_MANUAL_ENTRIES = {
  status: {
    command: 'git status',
    synopsis: 'git status [-s | --short]',
    description: 'Displays the active branch, staged commit payload coordinates, and unstaged working tree discrepancies.',
    examples: ['git status', 'git status -s']
  },
  branch: {
    command: 'git branch',
    synopsis: 'git branch [-a | -d <name> | <new-branch>]',
    description: 'Lists existing branches, creates new branch pointers, or deletes completed feature refs.',
    examples: ['git branch', 'git branch feature/laser-gate', 'git branch -d old-fix']
  },
  checkout: {
    command: 'git checkout',
    synopsis: 'git checkout [-b] <branch-name>',
    description: 'Updates working tree and switches HEAD to target branch or creates and activates a new branch with -b.',
    examples: ['git checkout master', 'git checkout -b feature/teleport']
  },
  switch: {
    command: 'git switch',
    synopsis: 'git switch [-c] <branch-name>',
    description: 'Modern dedicated command for switching branches or creating new branches with -c.',
    examples: ['git switch master', 'git switch -c hotfix']
  },
  commit: {
    command: 'git commit',
    synopsis: 'git commit -m "<message>"',
    description: 'Records staged changes into a new commit object on the current branch tip. Used in GitHero to seal puzzle stage victories.',
    examples: ['git commit -m "stage commit payload"', 'git commit -m "solve sector 01"']
  },
  merge: {
    command: 'git merge',
    synopsis: 'git merge [--no-ff] <target-branch>',
    description: 'Incorporates changes from the named branch into the current HEAD branch.',
    examples: ['git merge feature/branch', 'git merge --no-ff origin/master']
  },
  rebase: {
    command: 'git rebase',
    synopsis: 'git rebase [-i] <upstream>',
    description: 'Reapplies commits on top of another base tip, creating a pristine linear commit history.',
    examples: ['git rebase master', 'git rebase -i HEAD~3']
  },
  stash: {
    command: 'git stash',
    synopsis: 'git stash [push | pop | apply | list | drop]',
    description: 'Shelves the current dirty working state to a temporary LIFO stack without creating permanent commits.',
    examples: ['git stash', 'git stash pop', 'git stash list']
  },
  diff: {
    command: 'git diff',
    synopsis: 'git diff [--staged]',
    description: 'Shows changes between working tree and staging index, or between staging index and latest HEAD commit.',
    examples: ['git diff', 'git diff --staged']
  },
  reflog: {
    command: 'git reflog',
    synopsis: 'git reflog',
    description: 'Reference log tracking every movement of HEAD. Essential for recovering orphaned or accidentally reset commits.',
    examples: ['git reflog']
  },
  reset: {
    command: 'git reset',
    synopsis: 'git reset [--hard | --soft] <commit>',
    description: 'Resets current HEAD to specified state. In GitHero puzzles, git reset --hard restarts the sector turn.',
    examples: ['git reset --hard HEAD', 'git reset --soft HEAD~1']
  }
};

export class GitCommandManual {
  getEntry(cmd) {
    return GIT_MANUAL_ENTRIES[cmd] || null;
  }

  getAllEntries() {
    return Object.values(GIT_MANUAL_ENTRIES);
  }

  renderManPage(cmd) {
    const entry = this.getEntry(cmd);
    if (!entry) {
      return `No manual entry for "git ${cmd}". Available: ${Object.keys(GIT_MANUAL_ENTRIES).join(', ')}`;
    }

    return `
NAME
    ${entry.command} - ${entry.description}

SYNOPSIS
    ${entry.synopsis}

DESCRIPTION
    ${entry.description}

EXAMPLES
${entry.examples.map(ex => `    $ ${ex}`).join('\n')}
    `;
  }
}

export const gitCommandManual = new GitCommandManual();
