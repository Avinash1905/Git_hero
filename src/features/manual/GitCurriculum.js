/**
 * GitCurriculum
 * Authoritative syllabus detailing all 20 Worlds and their underlying Git computer science mechanics.
 */

export const GIT_CURRICULUM = Object.freeze([
  {
    world: 1,
    title: 'Foundations of Git',
    description: 'Working tree, index staging area, blob objects, commit hashing, and status lifecycle.',
    sectors: '01 - 05',
    commandsTaught: ['git init', 'git status', 'git add', 'git commit', 'git up', 'git down'],
    keyConcepts: [
      'The Three Trees Architecture: Working Directory, Staging Index, Git Repository',
      'SHA-1 / SHA-256 Content-Addressable Object Store',
      'Anatomy of a Git Commit: Tree Pointer, Parent Hashes, Author, Commit Message'
    ]
  },
  {
    world: 2,
    title: 'Branch Valley',
    description: 'Branch topologies, moving HEAD pointers, and parallel feature isolation.',
    sectors: '06 - 18',
    commandsTaught: ['git branch', 'git switch', 'git checkout -b', 'git push origin'],
    keyConcepts: [
      'Branches are lightweight, movable pointers to commit hashes',
      'The HEAD reference points to the currently active branch or commit',
      'Parallel stream divergence without workspace contamination'
    ]
  },
  {
    world: 3,
    title: 'Merge Peaks',
    description: 'Fast-forward integration, three-way merge commits, common ancestor detection, conflict hunks.',
    sectors: '19 - 31',
    commandsTaught: ['git merge', 'git merge --abort', 'git diff', 'git status'],
    keyConcepts: [
      'Fast-forward merges move branch pointers without generating merge commits',
      'Three-way recursive merge identifies Lowest Common Ancestor (LCA)',
      'Conflict markers: <<<<<<< HEAD, =======, >>>>>>> branch'
    ]
  },
  {
    world: 4,
    title: 'Rebase Wasteland',
    description: 'Linearizing repository history, interactive rebase, squashing, and commit rewriting.',
    sectors: '32 - 44',
    commandsTaught: ['git rebase', 'git rebase -i', 'git rebase --continue', 'git rebase --abort'],
    keyConcepts: [
      'Rebase replays a sequence of commits onto a new base tip',
      'Interactive rebasing permits squash, fixup, reword, and drop operations',
      'The Golden Rule of Rebasing: Never rebase public shared branches'
    ]
  },
  {
    world: 5,
    title: 'Kernel Core',
    description: 'Cherry-picking individual commits, stashing uncommitted modifications, and reflog time recovery.',
    sectors: '45 - 57',
    commandsTaught: ['git cherry-pick', 'git stash', 'git stash pop', 'git reflog'],
    keyConcepts: [
      'Cherry-pick extracts patch changes from arbitrary commits into the current branch',
      'Stash saves working directory state onto an internal LIFO stack',
      'The Reflog records every update made to the tip of branches for recovery'
    ]
  },
  {
    world: 6,
    title: 'Grandmaster Trials',
    description: 'Binary search debugging with bisect, line-by-line attribution with blame, and regression testing.',
    sectors: '58 - 70',
    commandsTaught: ['git bisect start', 'git bisect bad', 'git bisect good', 'git blame'],
    keyConcepts: [
      'Automated logarithmic search isolating the commit that introduced a bug',
      'Determining author, commit date, and rationale for every code line with git blame'
    ]
  },
  {
    world: 7,
    title: 'Community Expansions',
    description: 'Multiple isolated working trees via git worktree and detached HEAD workflows.',
    sectors: '71 - 83',
    commandsTaught: ['git worktree add', 'git worktree list', 'git worktree remove'],
    keyConcepts: [
      'Checking out multiple branches simultaneously across linked directory trees',
      'Zero stash overhead when switching contexts across long builds'
    ]
  },
  {
    world: 8,
    title: 'Grandmaster Infinity',
    description: 'Client-side and server-side Git hooks, lint automation, and smudge/clean filters.',
    sectors: '84 - 96',
    commandsTaught: ['pre-commit hooks', 'commit-msg', 'git config core.hooksPath'],
    keyConcepts: [
      'Automating tests, formatting, and commit message policy enforcement',
      'Smudge and Clean content filters via .gitattributes'
    ]
  },
  {
    world: 9,
    title: 'Secret Omniverse',
    description: 'Submodule trees, nested repositories, and subtree synchronization.',
    sectors: '97 - 109',
    commandsTaught: ['git submodule add', 'git submodule update --init --recursive'],
    keyConcepts: [
      'Tracking exact commit SHAs of external repositories within a parent project'
    ]
  },
  {
    world: 10,
    title: 'Ascension Matrix',
    description: 'Semantic version tags, annotated tags, and release artifact generation.',
    sectors: '110 - 122',
    commandsTaught: ['git tag -a', 'git tag -l', 'git push --tags'],
    keyConcepts: [
      'Lightweight vs annotated tags containing GPG signatures and release notes'
    ]
  },
  {
    world: 11,
    title: 'Multiverse Nexus',
    description: 'Distributed remotes, upstream tracking, and asymmetrical peer topologies.',
    sectors: '123 - 135',
    commandsTaught: ['git remote -v', 'git remote add upstream', 'git fetch --prune'],
    keyConcepts: [
      'Synchronizing across multiple distributed remote peers without central server dependencies'
    ]
  },
  {
    world: 12,
    title: 'Godhead Infinity',
    description: 'Airgapped repository bundles and offline sneakernet transports.',
    sectors: '136 - 148',
    commandsTaught: ['git bundle create', 'git bundle verify'],
    keyConcepts: [
      'Packaging branch histories into single portable files for offline delivery'
    ]
  },
  {
    world: 13,
    title: 'Cataclysm Core',
    description: 'Disaster recovery, scrubbed secrets, and large asset eviction with filter-repo.',
    sectors: '149 - 161',
    commandsTaught: ['git filter-repo', 'git fsck --full'],
    keyConcepts: [
      'Permanent redaction of passwords and large binaries across all historic commits'
    ]
  },
  {
    world: 14,
    title: 'Eternal Genesis',
    description: 'Monorepo scalability, sparse-checkout, and blobless partial clones.',
    sectors: '162 - 174',
    commandsTaught: ['git sparse-checkout init', 'git clone --filter=blob:none'],
    keyConcepts: [
      'Working on gigabyte-scale repositories by checking out only relevant subdirectories'
    ]
  },
  {
    world: 15,
    title: 'Infinity Nexus',
    description: 'Garbage collection, delta compression, and packfile indexing.',
    sectors: '175 - 187',
    commandsTaught: ['git gc --prune=now', 'git count-objects -v', 'git pack-refs'],
    keyConcepts: [
      'How loose object files are packed into delta-compressed packfiles'
    ]
  },
  {
    world: 16,
    title: 'Supreme Pantheon',
    description: 'Cryptographic commit signatures, GPG keys, and identity verification.',
    sectors: '188 - 200',
    commandsTaught: ['git commit -S', 'git verify-commit', 'git tag -v'],
    keyConcepts: [
      'Cryptographic provenance proving commit authors cannot be forged'
    ]
  },
  {
    world: 17,
    title: 'Infinite Chambers',
    description: 'Git configuration hierarchy (system, global, local, worktree) and custom plumbing.',
    sectors: '201 - 213',
    commandsTaught: ['git config --list --show-origin', 'git cat-file -p'],
    keyConcepts: [
      'Configuration cascades and direct inspection of git raw internal object structures'
    ]
  },
  {
    world: 18,
    title: 'Omniverse Pantheon',
    description: 'Custom merge drivers, union strategies, and diff engines.',
    sectors: '214 - 226',
    commandsTaught: ['git config merge.tool', 'git mergetool'],
    keyConcepts: [
      'Defining specialized conflict resolution logic for custom binary and text formats'
    ]
  },
  {
    world: 19,
    title: 'Omnipotent Ascendancy',
    description: 'Complex rebase topologies, cherry-pick ranges, and rerere reuse.',
    sectors: '227 - 239',
    commandsTaught: ['git config rerere.enabled true', 'git rebase --onto'],
    keyConcepts: [
      'RERERE (Reuse Recorded Resolution) remembers and automatically resolves repeating conflicts'
    ]
  },
  {
    world: 20,
    title: 'The Eternal Godhead',
    description: 'Master synthesis trial challenging your grasp of all 250 repository sectors.',
    sectors: '240 - 250',
    commandsTaught: ['git status', 'git push', 'git pull', 'git commit'],
    keyConcepts: [
      'Complete mastery of version control: from single commit to cosmic distributed networks'
    ]
  }
]);
