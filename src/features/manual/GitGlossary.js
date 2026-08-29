/**
 * GitGlossary
 * Technical computer science terminology dictionary for version control systems.
 */

export const GIT_GLOSSARY = Object.freeze([
  {
    term: 'Directed Acyclic Graph (DAG)',
    definition: 'A mathematical data structure consisting of vertices (commits) and directed edges (parent pointers) with no cycles. In Git, children point backward to their parents, ensuring chronological immutability.',
    category: 'Computer Science & Topologies'
  },
  {
    term: 'Blob Object',
    definition: 'A fundamental Git object type representing pure file contents without metadata, filenames, or directory structures. Stored as a zlib-compressed hash of header + payload in .git/objects.',
    category: 'Object Model'
  },
  {
    term: 'Tree Object',
    definition: 'A Git object representing a directory hierarchy. Maps file modes, names, and child blob or tree SHA-1/SHA-256 hashes.',
    category: 'Object Model'
  },
  {
    term: 'Commit Object',
    definition: 'An immutable snapshot containing a top-level tree SHA, zero or more parent commit SHAs, author/committer identities, timestamps, and an explanatory message.',
    category: 'Object Model'
  },
  {
    term: 'HEAD',
    definition: 'A special symbolic reference file (.git/HEAD) indicating the currently active branch tip or commit in the working tree.',
    category: 'References & Pointers'
  },
  {
    term: 'Detached HEAD',
    definition: 'A state where HEAD points directly to an individual commit SHA rather than to a named branch reference. New commits created in this state risk becoming dangling objects if not tagged or branched before switching away.',
    category: 'References & Pointers'
  },
  {
    term: 'Index (Staging Area)',
    definition: 'A binary cache (.git/index) holding the proposed next commit snapshot. Mediates between the mutable working directory and immutable commit objects.',
    category: 'Architecture'
  },
  {
    term: 'Fast-Forward Merge',
    definition: 'A merge resolution where the target branch has no divergent commits from the source, allowing Git to simply advance the branch pointer without generating a merge commit.',
    category: 'Branching & Merging'
  },
  {
    term: 'Lowest Common Ancestor (LCA)',
    definition: 'The most recent shared ancestor commit from which two divergent branches originated. Serves as the base image during 3-way merge resolution.',
    category: 'Branching & Merging'
  },
  {
    term: 'Merge Conflict',
    definition: 'A discrepancy occurring when both branches modify the same line or region of a file differently relative to their common ancestor, requiring human or merge driver intervention.',
    category: 'Branching & Merging'
  },
  {
    term: 'Rebase',
    definition: 'The process of moving or combining a sequence of commits to a new base commit, creating brand new commit objects with identical changes but new parent hashes.',
    category: 'History Manipulation'
  },
  {
    term: 'Reflog',
    definition: 'Reference logs (.git/logs/refs/) tracking every historical movement of branch tips and HEAD locally on your machine, enabling recovery of orphaned commits.',
    category: 'Diagnostics & Recovery'
  },
  {
    term: 'Worktree',
    definition: 'A linked working directory tree allowing developers to checkout and build multiple branches concurrently from a single underlying repository storage.',
    category: 'Architecture'
  },
  {
    term: 'Submodule',
    definition: 'A mechanism embedding an external repository at a specific path, locked to a designated commit hash using a special gitlink tree entry mode.',
    category: 'Advanced'
  },
  {
    term: 'Sparse Checkout',
    definition: 'A client-side optimization allowing developers to populate only designated subdirectories into the working tree, critical for massive monorepos.',
    category: 'Performance'
  },
  {
    term: 'Packfile',
    definition: 'A delta-compressed file (.pack) and associated index (.idx) bundling hundreds of loose objects into an optimized disk layout using sliding-window delta compression.',
    category: 'Internal Storage'
  },
  {
    term: 'Garbage Collection (git gc)',
    definition: 'The housekeeping process identifying unreachable/dangling objects past expiration windows and packing loose objects into consolidated packfiles.',
    category: 'Internal Storage'
  },
  {
    term: 'GPG Commit Signature',
    definition: 'A cryptographic PGP or SSH signature embedded directly within a commit object header, proving the author identity cannot be spoofed.',
    category: 'Security'
  },
  {
    term: 'Clean and Smudge Filters',
    definition: 'Attribute-driven pipeline hooks: "clean" processes files before staging into the index, and "smudge" processes files before checkout into the working directory.',
    category: 'Automation'
  },
  {
    term: 'RERERE',
    definition: '"Reuse Recorded Resolution" - a capability that records how you resolved a merge conflict hunk so future identical conflicts are automatically resolved.',
    category: 'Advanced'
  }
]);
