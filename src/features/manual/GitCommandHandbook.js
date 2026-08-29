/**
 * GitCommandHandbook
 * Authoritative encyclopedia of Git commands with syntax, flags, puzzle mechanics, and tactical examples.
 */

export const GIT_COMMAND_HANDBOOK = Object.freeze([
  {
    name: 'git init',
    category: 'Repository Setup',
    synopsis: 'git init [directory]',
    description: 'Creates an empty Git repository or reinitializes an existing one. Creates the .git folder containing objects, refs, and HEAD.',
    flags: [
      { flag: '-b <branch-name>', description: 'Use the specified name for the initial branch (e.g. main).' },
      { flag: '--bare', description: 'Create a bare repository without a working tree (typically for remote servers).' }
    ],
    puzzleApplication: 'Used in Sector 01 to initialize the tactical arena and enable commit staging.',
    examples: [
      'git init',
      'git init -b main',
      'git init --bare /srv/git/project.git'
    ]
  },
  {
    name: 'git status',
    category: 'Inspection & Working Tree',
    synopsis: 'git status [options]',
    description: 'Displays paths that have differences between the index file and the current HEAD commit, paths that have differences between the working tree and the index file, and paths in the working tree that are untracked.',
    flags: [
      { flag: '-s, --short', description: 'Give the output in the short-format.' },
      { flag: '-b, --branch', description: 'Show the branch and tracking info even in short-format.' }
    ],
    puzzleApplication: 'Inspects whether the active repository box is positioned on top of the designated goal node, ready for staging verification.',
    examples: [
      'git status',
      'git status -sb'
    ]
  },
  {
    name: 'git add',
    category: 'Staging Area (Index)',
    synopsis: 'git add <pathspec>...',
    description: 'Updates the index using the current content found in the working tree, to prepare the content staged for the next commit.',
    flags: [
      { flag: '-A, --all', description: 'Stage all modified, deleted, and newly created files.' },
      { flag: '-p, --patch', description: 'Interactively choose hunks of patch between the index and the work tree.' }
    ],
    puzzleApplication: 'Moves repository payload items into the staging index area.',
    examples: [
      'git add .',
      'git add index.js',
      'git add -p'
    ]
  },
  {
    name: 'git commit',
    category: 'Snapshot Creation',
    synopsis: 'git commit [-m <msg>] [options]',
    description: 'Records changes to the repository. Stores the current contents of the index in a new commit along with a log message from the user describing the changes.',
    flags: [
      { flag: '-m <msg>', description: 'Use the given msg as the commit message.' },
      { flag: '--amend', description: 'Replace the tip of the current branch by creating a new commit.' },
      { flag: '-S[<keyid>]', description: 'GPG-sign commits with cryptographic provenance.' }
    ],
    puzzleApplication: 'Finalizes the level solution once all boxes are staged onto goal nodes, triggering victory verification and XP awards.',
    examples: [
      'git commit -m "feat: complete sector staging"',
      'git commit --amend --no-edit'
    ]
  },
  {
    name: 'git push',
    category: 'Remote Synchronization',
    synopsis: 'git push [options] [<repository> [<refspec>...]]',
    description: 'Updates remote refs along with associated objects. Sends local branch commits to the remote peer.',
    flags: [
      { flag: '-u, --set-upstream', description: 'For every branch that is up to date or successfully pushed, add upstream tracking reference.' },
      { flag: '--force-with-lease', description: 'Safely force push only if remote ref matches expected lease.' }
    ],
    puzzleApplication: 'Tactical movement solver: pushes an adjacent repository box forward into target coordinate nodes.',
    examples: [
      'git push origin main',
      'git push -u origin feature',
      'git push'
    ]
  },
  {
    name: 'git pull',
    category: 'Remote Synchronization',
    synopsis: 'git pull [options] [<repository> [<refspec>...]]',
    description: 'Incorporates changes from a remote repository into the current branch. In its default mode, git pull is shorthand for git fetch followed by git merge FETCH_HEAD.',
    flags: [
      { flag: '--rebase', description: 'Rebase the current branch on top of the upstream branch after fetching.' },
      { flag: '--ff-only', description: 'Refuse to merge unless the current HEAD is already up-to-date or the merge can be resolved as a fast-forward.' }
    ],
    puzzleApplication: 'Tactical movement solver: pulls an adjacent repository box toward the hero operative.',
    examples: [
      'git pull',
      'git pull --rebase origin main',
      'git pull left'
    ]
  },
  {
    name: 'git branch',
    category: 'Branch Management',
    synopsis: 'git branch [options] [<branchname>]',
    description: 'List, create, or delete branches. Head of the current branch is indicated by an asterisk.',
    flags: [
      { flag: '-a, --all', description: 'List both remote-tracking branches and local branches.' },
      { flag: '-d, --delete', description: 'Delete a branch. The branch must be fully merged in its upstream branch.' },
      { flag: '-D', description: 'Shortcut for --delete --force.' }
    ],
    puzzleApplication: 'Spawns alternate puzzle topology timelines for parallel feature solving.',
    examples: [
      'git branch feature/laser-grid',
      'git branch -a',
      'git branch -d old-experiment'
    ]
  },
  {
    name: 'git switch',
    category: 'Branch Navigation',
    synopsis: 'git switch [<options>] <branch>',
    description: 'Switch to a specified branch. The working tree and the index are updated to match the branch.',
    flags: [
      { flag: '-c, --create <new-branch>', description: 'Create and switch to a new branch.' },
      { flag: '--detach', description: 'Switch to a commit in detached HEAD state.' }
    ],
    puzzleApplication: 'Transports the operative avatar across branched grid realities.',
    examples: [
      'git switch main',
      'git switch -c feature/teleporter'
    ]
  },
  {
    name: 'git merge',
    category: 'History Integration',
    synopsis: 'git merge [options] [<commit>...]',
    description: 'Incorporates changes from the named commits into the current branch.',
    flags: [
      { flag: '--no-ff', description: 'Create a merge commit even when the merge resolves as a fast-forward.' },
      { flag: '--abort', description: 'Abort the current conflict resolution process and try to reconstruct the pre-merge state.' },
      { flag: '--squash', description: 'Produce the working tree and index state as if a real merge happened, but do not make a commit.' }
    ],
    puzzleApplication: 'Merges separate sector branches together, opening locked inter-dimensional gateway doors.',
    examples: [
      'git merge feature/tactical',
      'git merge --no-ff staging',
      'git merge --abort'
    ]
  },
  {
    name: 'git rebase',
    category: 'History Linearization',
    synopsis: 'git rebase [-i | --interactive] [options] [<upstream>]',
    description: 'Reapply commits on top of another base tip to produce a clean linear history graph.',
    flags: [
      { flag: '-i, --interactive', description: 'Make a list of the commits which are about to be rebased. Let the user edit that list before rebasing.' },
      { flag: '--continue', description: 'Restart the rebasing process after having resolved a merge conflict.' },
      { flag: '--onto <newbase>', description: 'Starting point at which to create the new commits.' }
    ],
    puzzleApplication: 'Linearizes fragmented sector pathways to bypass security lasers.',
    examples: [
      'git rebase main',
      'git rebase -i HEAD~4',
      'git rebase --continue'
    ]
  },
  {
    name: 'git cherry-pick',
    category: 'Patch Extraction',
    synopsis: 'git cherry-pick [options] <commit>...',
    description: 'Given one or more existing commits, apply the change each one introduces, recording a new commit for each.',
    flags: [
      { flag: '-n, --no-commit', description: 'Apply the changes without making a commit.' },
      { flag: '-e, --edit', description: 'Edit the commit message prior to committing.' }
    ],
    puzzleApplication: 'Extracts single power keys from auxiliary branches into the primary path.',
    examples: [
      'git cherry-pick 7b3a9f1',
      'git cherry-pick -n dev~2'
    ]
  },
  {
    name: 'git stash',
    category: 'Workspace Preservation',
    synopsis: 'git stash [push [-m <message>]] | pop | list | drop',
    description: 'Use git stash when you want to record the current state of the working directory and the index, but want to go back to a clean working directory.',
    flags: [
      { flag: 'pop', description: 'Remove a single stashed state from the stash list and apply it on top of the current working tree.' },
      { flag: '-u, --include-untracked', description: 'All untracked files are also stashed and then cleaned up with git clean.' }
    ],
    puzzleApplication: 'Stores obstacles into memory buffers, allowing safe traversal past traps.',
    examples: [
      'git stash',
      'git stash pop',
      'git stash list'
    ]
  },
  {
    name: 'git bisect',
    category: 'Regression Diagnostics',
    synopsis: 'git bisect <subcommand> <options>',
    description: 'Uses binary search to find the commit that introduced a bug.',
    flags: [
      { flag: 'start', description: 'Initiate bisect session.' },
      { flag: 'bad', description: 'Mark current revision as broken.' },
      { flag: 'good', description: 'Mark previous known working revision as clean.' }
    ],
    puzzleApplication: 'Solves binary search mazes in World 06 Grandmaster Trials.',
    examples: [
      'git bisect start',
      'git bisect bad',
      'git bisect good v1.0'
    ]
  },
  {
    name: 'git worktree',
    category: 'Concurrent Trees',
    synopsis: 'git worktree add | list | remove',
    description: 'Manage multiple working trees attached to the same repository.',
    flags: [
      { flag: 'add <path> <branch>', description: 'Create a new working tree linked to specified branch.' },
      { flag: 'prune', description: 'Prune working tree information in $GIT_DIR/worktrees.' }
    ],
    puzzleApplication: 'Operates in multiple spatial rooms simultaneously in World 07.',
    examples: [
      'git worktree add ../hotfix hotfix-branch',
      'git worktree list'
    ]
  },
  {
    name: 'git submodule',
    category: 'Nested Repositories',
    synopsis: 'git submodule add | update | status',
    description: 'Inspects, updates and manages submodules embedded in the repository.',
    flags: [
      { flag: '--init', description: 'Initialize the submodules recorded in the index.' },
      { flag: '--recursive', description: 'Traverse submodules recursively.' }
    ],
    puzzleApplication: 'Navigates recursive Russian-doll puzzle structures in World 09.',
    examples: [
      'git submodule add https://github.com/lib/core vendor/core',
      'git submodule update --init --recursive'
    ]
  },
  {
    name: 'git reflog',
    category: 'Pointer History & Recovery',
    synopsis: 'git reflog [show] [options]',
    description: 'Reference logs record when the tips of branches and other references were updated in the local repository.',
    flags: [
      { flag: 'expire', description: 'Prune older reflog entries.' }
    ],
    puzzleApplication: 'Time-travel recovery mechanism restoring fallen operatives in World 05.',
    examples: [
      'git reflog',
      'git reset --hard HEAD@{2}'
    ]
  }
]);
