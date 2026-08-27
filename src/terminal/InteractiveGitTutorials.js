/**
 * InteractiveGitTutorials
 * Step-by-step interactive CLI tutorials guiding operatives through hands-on Git scenarios.
 */

export const CLI_TUTORIALS = [
  {
    id: 'intro_staging',
    title: '1. Staging & Commits',
    steps: [
      { text: 'Inspect the dirty working state using git status.', expected: 'git status', hint: 'Type: git status' },
      { text: 'Now stage your changes and create a commit.', expected: 'git commit -m "initial commit"', hint: 'Type: git commit -m "initial commit"' }
    ]
  },
  {
    id: 'intro_branching',
    title: '2. Branch Isolation',
    steps: [
      { text: 'Create a new feature branch called "feature/laser".', expected: 'git branch feature/laser', hint: 'Type: git branch feature/laser' },
      { text: 'Switch to your newly created branch.', expected: 'git switch feature/laser', hint: 'Type: git switch feature/laser' }
    ]
  },
  {
    id: 'intro_merging',
    title: '3. Fast-Forward Merges',
    steps: [
      { text: 'Switch back to the master branch.', expected: 'git switch master', hint: 'Type: git switch master' },
      { text: 'Merge the feature branch into master.', expected: 'git merge feature/laser', hint: 'Type: git merge feature/laser' }
    ]
  }
];

export class InteractiveGitTutorials {
  getTutorial(id) {
    return CLI_TUTORIALS.find(t => t.id === id) || CLI_TUTORIALS[0];
  }

  getAll() {
    return CLI_TUTORIALS;
  }
}

export const interactiveGitTutorials = new InteractiveGitTutorials();
