/**
 * TutorialCatalog
 * Complete curriculum of 20 interactive hands-on Git tutorial missions,
 * one for each World in the GitQuest multiverse.
 */

export const TUTORIAL_CATALOG = Object.freeze([
  {
    world: 1,
    id: 'tut-01-foundations',
    title: 'Mission 01: The Sacred Three Trees',
    description: 'Learn the foundational separation between Working Tree, Staging Area, and Git Commit history.',
    gitConcept: 'Working Directory -> Staging Area -> Repository',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect the status of your working tree and notice untracked changes.',
        expectedCommand: 'git status',
        hint: 'Type "git status" in the terminal to inspect the staging area.',
        explanation: '"git status" displays paths that have differences between the index and current HEAD commit.'
      },
      {
        stepNumber: 2,
        instruction: 'Stage the repository payload by advancing your operative into the staging node.',
        expectedCommand: 'git push',
        hint: 'Use "git push" when facing an adjacent box to move it onto the target node.',
        explanation: '"git add / push" moves changes from the working tree into the index staging area.'
      },
      {
        stepNumber: 3,
        instruction: 'Commit the staged index payload to create an immutable commit object in repository history.',
        expectedCommand: 'git commit',
        hint: 'Type "git commit" to finalize changes and advance to the next sector.',
        explanation: '"git commit" creates a snapshot object recording author, tree, timestamp, and parent pointer.'
      }
    ]
  },
  {
    world: 2,
    id: 'tut-02-branching',
    title: 'Mission 02: Branch Divergence & HEAD Navigation',
    description: 'Master branch creation, pointer divergence, and switching active branch contexts.',
    gitConcept: 'Movable Branch References and HEAD pointer',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Create a new isolated branch named "feature/tactical".',
        expectedCommand: 'git branch feature/tactical',
        hint: 'Type "git branch <name>" to spawn a new branch reference.',
        explanation: 'A branch is simply a 41-byte reference file pointing to a commit hash in .git/refs/heads/.'
      },
      {
        stepNumber: 2,
        instruction: 'Switch your active working tree and HEAD pointer to "feature/tactical".',
        expectedCommand: 'git switch feature/tactical',
        hint: 'Type "git switch feature/tactical" or "git checkout feature/tactical".',
        explanation: '"git switch" updates HEAD to point to the designated branch without modifying working files.'
      },
      {
        stepNumber: 3,
        instruction: 'Commit a new changes payload on this branch.',
        expectedCommand: 'git commit',
        hint: 'Type "git commit" to advance the feature/tactical branch tip.',
        explanation: 'When committing on an active branch, that branch tip moves forward with HEAD.'
      }
    ]
  },
  {
    world: 3,
    id: 'tut-03-merging',
    title: 'Mission 03: 3-Way Recursive Merges & Fast-Forwards',
    description: 'Integrate divergent branch histories and resolve merge conflict hunks cleanly.',
    gitConcept: 'Lowest Common Ancestor (LCA) and 3-Way Merge',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Switch back to the primary integration branch "main".',
        expectedCommand: 'git switch main',
        hint: 'Type "git switch main".',
        explanation: 'Always switch to the destination branch before running a merge.'
      },
      {
        stepNumber: 2,
        instruction: 'Merge the feature branch into main.',
        expectedCommand: 'git merge feature/tactical',
        hint: 'Type "git merge feature/tactical" to trigger 3-way integration.',
        explanation: 'Git analyzes the common ancestor and combines orthogonal changes into a merge commit.'
      }
    ]
  },
  {
    world: 4,
    id: 'tut-04-rebasing',
    title: 'Mission 04: Linear History & Interactive Rebase',
    description: 'Replay commits onto new base tips to maintain a pristine, bisectable linear git log.',
    gitConcept: 'Linear commit replaying and squash consolidation',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Rebase current branch onto the updated tip of origin/main.',
        expectedCommand: 'git rebase main',
        hint: 'Type "git rebase main".',
        explanation: 'Rebase detaches current commits, moves the branch tip to target, and reapplies each commit as a patch.'
      },
      {
        stepNumber: 2,
        instruction: 'Inspect the resulting linear commit log.',
        expectedCommand: 'git status',
        hint: 'Type "git status" to verify clean tree state.',
        explanation: 'Rebased branches have no merge bubbles, making debugging with git bisect straightforward.'
      }
    ]
  },
  {
    world: 5,
    id: 'tut-05-cherry-pick',
    title: 'Mission 05: Cherry-Picking & Reflog Recovery',
    description: 'Extract specific critical commits across branches and recover detached commits via reflog.',
    gitConcept: 'Arbitrary patch extraction and safety reflog',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect the reference log to view historical HEAD movements.',
        expectedCommand: 'git reflog',
        hint: 'Type "git reflog" to display recent HEAD positions.',
        explanation: 'The reflog tracks every pointer update locally for at least 30 to 90 days.'
      },
      {
        stepNumber: 2,
        instruction: 'Cherry-pick commit payload into the current branch.',
        expectedCommand: 'git cherry-pick c2',
        hint: 'Type "git cherry-pick c2".',
        explanation: 'Cherry-pick generates a brand new commit on the active branch with identical code delta.'
      }
    ]
  },
  {
    world: 6,
    id: 'tut-06-bisect',
    title: 'Mission 06: Binary Regression Search with Git Bisect',
    description: 'Logarithmically isolate the exact commit that introduced a defect in the system.',
    gitConcept: 'O(log N) binary search over Directed Acyclic Graphs',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Start the git bisect search wizard.',
        expectedCommand: 'git bisect start',
        hint: 'Type "git bisect start".',
        explanation: 'Initializes internal bisect state machine in .git/BISECT_LOG.'
      },
      {
        stepNumber: 2,
        instruction: 'Mark the current broken HEAD commit as bad.',
        expectedCommand: 'git bisect bad',
        hint: 'Type "git bisect bad".',
        explanation: 'Notifies bisect that the current revision exhibits the regression.'
      },
      {
        stepNumber: 3,
        instruction: 'Mark a known working past commit as good.',
        expectedCommand: 'git bisect good c1',
        hint: 'Type "git bisect good c1".',
        explanation: 'Git checks out the midpoint commit between good and bad automatically.'
      }
    ]
  },
  {
    world: 7,
    id: 'tut-07-worktrees',
    title: 'Mission 07: Multi-Branch Worktrees',
    description: 'Check out multiple branches concurrently across separate directory trees.',
    gitConcept: 'Linked working trees sharing a single .git directory',
    steps: [
      {
        stepNumber: 1,
        instruction: 'List active linked working trees.',
        expectedCommand: 'git worktree list',
        hint: 'Type "git worktree list".',
        explanation: 'Shows all directory paths mapped to distinct branches in this repository.'
      }
    ]
  },
  {
    world: 8,
    id: 'tut-08-hooks',
    title: 'Mission 08: Tactical Git Automation Hooks',
    description: 'Automate pre-commit code verification and commit message policy enforcement.',
    gitConcept: 'Client-side and server-side lifecycle hook triggers',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect active repository status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Hooks intercept operations like pre-commit, prepare-commit-msg, and pre-push.'
      }
    ]
  },
  {
    world: 9,
    id: 'tut-09-submodules',
    title: 'Mission 09: Submodule Architecture',
    description: 'Embed external repositories into your repository tree locked to precise commit hashes.',
    gitConcept: 'Gitlinks and recursive nested repositories',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Check status of submodule tracking references.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Submodules store a special 160000 gitlink mode in the git tree pointing to a foreign commit.'
      }
    ]
  },
  {
    world: 10,
    id: 'tut-10-tags',
    title: 'Mission 10: Semantic Release Tags',
    description: 'Affix immutable cryptographic milestones to repository releases.',
    gitConcept: 'Annotated vs Lightweight tag objects',
    steps: [
      {
        stepNumber: 1,
        instruction: 'List existing tags in the repository.',
        expectedCommand: 'git tag',
        hint: 'Type "git tag".',
        explanation: 'Annotated tags contain their own SHA, tagger metadata, message, and optional GPG signature.'
      }
    ]
  },
  {
    world: 11,
    id: 'tut-11-remotes',
    title: 'Mission 11: Distributed Remote Topologies',
    description: 'Synchronize upstream and origin remotes across peer developer networks.',
    gitConcept: 'Remote tracking branches (refs/remotes/*)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'View registered remote endpoints.',
        expectedCommand: 'git remote -v',
        hint: 'Type "git remote -v".',
        explanation: 'Git allows bidirectional synchronization with arbitrary peer remotes.'
      }
    ]
  },
  {
    world: 12,
    id: 'tut-12-bundles',
    title: 'Mission 12: Airgapped Git Bundles',
    description: 'Transport git repository histories across offline sneakernet channels.',
    gitConcept: 'Self-contained binary packfile transport files',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect repository status before bundle packaging.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: '"git bundle" packages commits, tags, and blobs into a portable file.'
      }
    ]
  },
  {
    world: 13,
    id: 'tut-13-filter-repo',
    title: 'Mission 13: History Cleansing with Filter-Repo',
    description: 'Evict accidental passwords, API keys, and bulky assets across all historic commits.',
    gitConcept: 'Complete rewriting of DAG content hashes',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Run git status to prepare working tree.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Rewriting history changes all downstream commit SHAs.'
      }
    ]
  },
  {
    world: 14,
    id: 'tut-14-sparse-checkout',
    title: 'Mission 14: Monorepo Sparse Checkouts',
    description: 'Work productively in multi-gigabyte repositories with partial clones.',
    gitConcept: 'Cone mode sparse checkout and blob-less clones',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Verify working tree status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Sparse checkout only populates selected directories into the working tree.'
      }
    ]
  },
  {
    world: 15,
    id: 'tut-15-gc',
    title: 'Mission 15: Garbage Collection & Packfile Deltas',
    description: 'Compact loose object files into delta-compressed packfiles.',
    gitConcept: 'Packfile indices (.idx) and loose object compaction',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect repository object status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Git uses sliding-window delta compression to achieve high disk efficiency.'
      }
    ]
  },
  {
    world: 16,
    id: 'tut-16-gpg',
    title: 'Mission 16: Cryptographic Commit Provenance',
    description: 'Sign commits and tags using OpenPGP or SSH keys to ensure tamper-proof authenticity.',
    gitConcept: 'Cryptographic commit signatures and verification',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect status of working tree.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'GPG signatures are embedded directly within the commit header string.'
      }
    ]
  },
  {
    world: 17,
    id: 'tut-17-plumbing',
    title: 'Mission 17: Plumbing vs Porcelain Internals',
    description: 'Inspect low-level git plumbing objects: blobs, trees, commits, and tags directly.',
    gitConcept: 'Content-addressable storage via zlib deflated files',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect working tree status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'Porcelain commands (add, commit) wrap plumbing commands (hash-object, mktree).'
      }
    ]
  },
  {
    world: 18,
    id: 'tut-18-drivers',
    title: 'Mission 18: Custom Merge Drivers & .gitattributes',
    description: 'Configure custom binary diffing, merge drivers, and smudge/clean filters.',
    gitConcept: 'Path-specific attribute cascades',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Check repository status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: '.gitattributes dictates end-of-line normalization and custom diff drivers.'
      }
    ]
  },
  {
    world: 19,
    id: 'tut-19-rerere',
    title: 'Mission 19: RERERE Conflict Reuse Mechanism',
    description: 'Automatically record and reuse resolution decisions across repeating rebase conflicts.',
    gitConcept: 'Reuse Recorded Resolution (rerere)',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect repository status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'RERERE records pre-image and post-image diff hunks to replay resolutions automatically.'
      }
    ]
  },
  {
    world: 20,
    id: 'tut-20-synthesis',
    title: 'Mission 20: The Eternal Godhead Trial',
    description: 'The supreme test combining the entire spectrum of version control discipline.',
    gitConcept: 'Total topological mastery across all 250 sectors',
    steps: [
      {
        stepNumber: 1,
        instruction: 'Inspect active sector status.',
        expectedCommand: 'git status',
        hint: 'Type "git status".',
        explanation: 'You have mastered the mechanics of Git across 20 Worlds and 250 Sectors.'
      }
    ]
  }
]);
