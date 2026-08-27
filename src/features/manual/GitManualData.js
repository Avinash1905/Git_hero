/**
 * GitQuest Feature: Git Technical Reference & Interactive Command Encyclopedia
 */

export const GIT_MANUAL_SECTIONS = [
  {
    id: 'basics',
    title: 'Foundations & Working Tree',
    icon: 'terminal',
    commands: [
      {
        name: 'git status',
        syntax: 'git status',
        summary: 'Displays the state of the working directory and the staging area.',
        description: 'Lets you see which changes have been staged, which haven\'t, and which files aren\'t being tracked by Git. In GitQuest, this inspects your immediate grid quadrant and shows payload destination goals.',
        example: 'git status',
        flags: ['-s / --short (Give the output in short format)', '-b / --branch (Show branch and tracking info)'],
        category: 'Inspection'
      },
      {
        name: 'git push',
        syntax: 'git push [remote] [branch]',
        summary: 'Updates remote refs along with associated objects.',
        description: 'Transmits local commit payloads upstream to the origin server. In GitQuest, pushing propels the payload box forward in your current facing direction towards the goal.',
        example: 'git push origin main',
        flags: ['-u / --set-upstream (Add upstream tracking)', '-f / --force (Force update - hazardous)'],
        category: 'Sync'
      },
      {
        name: 'git pull',
        syntax: 'git pull [remote] [branch]',
        summary: 'Fetch from and integrate with another repository or a local branch.',
        description: 'Incorporates changes from a remote repository into the current branch. In GitQuest, directional pulls (git pull left/right/up/down) extract trapped payloads backward out of tight corridors.',
        example: 'git pull origin main',
        flags: ['--rebase (Rebase current branch on top of upstream)', '--no-commit (Do not auto-commit merge)'],
        category: 'Sync'
      },
      {
        name: 'git commit',
        syntax: 'git commit -m "<message>"',
        summary: 'Record changes to the repository.',
        description: 'Creates a new commit containing the current contents of the index and the given log message describing the changes. In GitQuest, this finalizes goal alignment to complete the level.',
        example: 'git commit -m "feat: complete staging corridor"',
        flags: ['-m "<msg>" (Set commit message)', '-a / --all (Automatically stage modified files)', '--amend (Amend previous commit)'],
        category: 'History'
      }
    ]
  },
  {
    id: 'branching',
    title: 'Branching & Switching Contexts',
    icon: 'alt_route',
    commands: [
      {
        name: 'git switch',
        syntax: 'git switch <branch-name>',
        summary: 'Switch between working branches.',
        description: 'Switches context to a specified branch, updating the working tree and HEAD pointer. In GitQuest, switching branches opens alternate gate pathways.',
        example: 'git switch feature-stage-2',
        flags: ['-c / --create (Create and switch to new branch)', '-d / --detach (Switch to detached HEAD state)'],
        category: 'Branching'
      },
      {
        name: 'git branch',
        syntax: 'git branch [branch-name]',
        summary: 'List, create, or delete branches.',
        description: 'Manages repository branches. When called without arguments, lists all local branches with active branch highlighted.',
        example: 'git branch -a',
        flags: ['-a / --all (List local and remote branches)', '-d / --delete (Delete branch safely)', '-D (Force delete branch)'],
        category: 'Branching'
      },
      {
        name: 'git merge',
        syntax: 'git merge <branch>',
        summary: 'Join two or more development histories together.',
        description: 'Incorporates changes from named commits into the current branch. Fast-forward merges move HEAD forward directly; three-way merges create a new merge commit.',
        example: 'git merge feature/auth',
        flags: ['--ff-only (Refuse to merge unless fast-forward)', '--no-ff (Create merge commit even if fast-forward)'],
        category: 'Merging'
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced History & Linearization',
    icon: 'history_edu',
    commands: [
      {
        name: 'git rebase',
        syntax: 'git rebase <upstream>',
        summary: 'Reapply commits on top of another base tip.',
        description: 'Linearizes history by moving or combining a sequence of commits to a new base commit, preventing diamond merge topologies in the project DAG.',
        example: 'git rebase -i HEAD~3',
        flags: ['-i / --interactive (Interactive rebase session)', '--onto <newbase> (Transplant topic branch onto upstream)'],
        category: 'History'
      },
      {
        name: 'git stash',
        syntax: 'git stash [push|pop|list|drop]',
        summary: 'Stash changes in a dirty working directory away.',
        description: 'Use git stash when you want to record the current state of the working directory and index, but want to go back to a clean working directory.',
        example: 'git stash push -m "wip portal"',
        flags: ['pop (Apply and remove top stash entry)', 'list (List all stash entries)', '--autostash (Auto stash before rebase)'],
        category: 'Stash'
      },
      {
        name: 'git cherry-pick',
        syntax: 'git cherry-pick <commit-hash>',
        summary: 'Apply changes introduced by existing commits.',
        description: 'Applies the changes introduced by one or more existing commits to the current branch HEAD.',
        example: 'git cherry-pick a1b2c3d',
        flags: ['-n / --no-commit (Apply changes without committing)', '-x (Record original commit hash in message)'],
        category: 'History'
      },
      {
        name: 'git reflog',
        syntax: 'git reflog [show]',
        summary: 'Manage reflog information.',
        description: 'Reference logs record when the tips of branches and other references were updated in the local repository. Essential for recovering dropped commits.',
        example: 'git reflog',
        flags: ['show (Show reflog for a ref)', 'expire (Prune older reflog entries)'],
        category: 'Recovery'
      }
    ]
  }
];
