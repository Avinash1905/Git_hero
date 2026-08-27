import { describe, test, assert, assertEqual } from './runTests.mjs';
import { GameState } from '../js/engine/GameState.js';
import { GridEngine } from '../js/engine/GridEngine.js';
import { GitCLI } from '../js/terminal/GitCLI.js';

describe('Exhaustive Step-by-Step Verification for Levels 10, 11 & 12', () => {

  test('Level 10: The Pull Matrix Puzzle Full Resolution', () => {
    const state = new GameState('10');
    const engine = new GridEngine(state);
    let levelCompleted = false;

    const cli = new GitCLI(
      state,
      engine,
      () => { levelCompleted = true; }
    );

    // Initial check: Level 10 Player at (2,3), Box at (2,2), Goal at (4,4)
    assertEqual(state.player.x, 2);
    assertEqual(state.player.y, 3);
    assertEqual(state.box.x, 2);
    assertEqual(state.box.y, 2);
    assert(!state.checkGoal(), 'Should not start on goal');

    // 1. Inspect status
    cli.execute('git status');
    assertEqual(state.statusCount, 1);

    // 2. Pull box down: Player is at (2,3), box is above at (2,2)
    cli.execute('git pull up');
    assertEqual(state.box.x, 2);
    assertEqual(state.box.y, 3);
    assertEqual(state.player.x, 2);
    assertEqual(state.player.y, 4);

    // 3. Navigate around the partition
    cli.execute('git down'); // player at (2,5)
    cli.execute('git right'); // player at (3,5)
    cli.execute('git right'); // player at (4,5)
    cli.execute('git up');    // player at (4,4)
    cli.execute('git up');    // player at (4,3)
    cli.execute('git up');    // player at (4,2)
    cli.execute('git left');  // player at (3,2)
    cli.execute('git down');  // player at (3,3)
    cli.execute('git left');  // player at (2,3) -> blocked by box, face box left or use pull
    
    // Step above the box and push it down toward goal
    cli.execute('git up');    // player at (3,2)
    cli.execute('git left');  // player at (2,2) - facing left
    cli.execute('git down');  // player at (2,2) faces down towards box at (2,3)
    cli.execute('git push');  // box at (2,4), player at (2,2)
    assertEqual(state.box.y, 4);

    // Step down and push box to the right toward (4,4)
    cli.execute('git down');  // player at (2,3)
    cli.execute('git down');  // player blocked or step right
    cli.execute('git right'); // player at (3,3)
    cli.execute('git down');  // player at (3,4)
    cli.execute('git left');  // player at (3,4) faces left towards box at (2,4)
    cli.execute('git pull left'); // box pulled to (3,4), player steps to (4,4)
    assertEqual(state.box.x, 3);
    assertEqual(state.box.y, 4);

    // Push box right onto goal at (4,4)
    cli.execute('git down'); // player at (4,5)
    cli.execute('git left'); // player at (3,5)
    cli.execute('git up');   // player at (3,5) faces up
    cli.execute('git left'); // player at (2,5)
    cli.execute('git up');   // player at (2,4)
    cli.execute('git right');// player at (2,4) faces right towards box at (3,4)
    cli.execute('git push'); // push box onto (4,4)
    
    assertEqual(state.box.x, 4);
    assertEqual(state.box.y, 4);
    assert(state.checkGoal(), 'Level 10 Box must be on goal (4,4)');

    // Finalize commit
    cli.execute('git commit');
    assert(state.isCommitted, 'Level 10 must be committed');
  });

  test('Level 11: Branch Switch Substation Full Resolution', () => {
    const state = new GameState('11');
    const engine = new GridEngine(state);
    let levelCompleted = false;

    const cli = new GitCLI(
      state,
      engine,
      () => { levelCompleted = true; }
    );

    // Level 11: Player at (1,1), Box at (2,2), Goal at (4,1), Gate at (3,2), Switch at (1,3)
    assert(!state.worldEngine.gates[0].isOpen, 'Gate should be closed initially');

    // 1. Step on switch at (1,3)
    cli.execute('git down'); // (1,2)
    cli.execute('git down'); // (1,3) - triggers switch
    assert(state.worldEngine.gates[0].isOpen, 'Gate should open when switch is activated');

    // 2. Move to box and push it through the gate to goal
    cli.execute('git up');   // (1,2)
    cli.execute('git right');// faces box at (2,2)
    cli.execute('git push'); // box pushed to (3,2) (through open gate)
    assertEqual(state.box.x, 3);
    assertEqual(state.box.y, 2);

    cli.execute('git right'); // player at (2,2)
    cli.execute('git push');  // box pushed to (4,2)
    assertEqual(state.box.x, 4);
    assertEqual(state.box.y, 2);

    cli.execute('git down');  // player at (2,3)
    cli.execute('git right'); // player at (3,3)
    cli.execute('git right'); // player at (4,3)
    cli.execute('git up');    // player at (4,3) faces up towards box at (4,2)
    cli.execute('git push');  // box pushed up to goal at (4,1)

    assertEqual(state.box.x, 4);
    assertEqual(state.box.y, 1);
    assert(state.checkGoal(), 'Level 11 Box must be on goal (4,1)');

    // Commit
    cli.execute('git commit');
    assert(state.isCommitted, 'Level 11 must be committed');
  });

  test('Level 12: Merge Conflict Substation Full Resolution', () => {
    const state = new GameState('12');
    const engine = new GridEngine(state);
    let levelCompleted = false;

    const cli = new GitCLI(
      state,
      engine,
      () => { levelCompleted = true; }
    );

    // Level 12: Player at (1,2), Box at (2,3), Goal at (4,4), Switch at (2,4), Gate at (4,3)
    // 1. Move to box and push onto switch at (2,4)
    cli.execute('git down');  // player at (1,3)
    cli.execute('git right'); // player at (1,3) faces box at (2,3)
    cli.execute('git up');    // player at (1,2)
    cli.execute('git right'); // player at (2,2)
    cli.execute('git down');  // player at (2,2) faces down towards box at (2,3)
    cli.execute('git push');  // box pushed down onto switch at (2,4)

    assertEqual(state.box.x, 2);
    assertEqual(state.box.y, 4);
    assert(state.worldEngine.gates[0].isOpen, 'Gate_12 should open when box is on switch (2,4)');

    // 2. Push box to goal at (4,4)
    cli.execute('git left'); // player at (1,2)
    cli.execute('git down'); // player at (1,3)
    cli.execute('git down'); // player at (1,4)
    cli.execute('git right');// player at (1,4) faces box at (2,4)
    cli.execute('git push'); // box pushed to (3,4)
    assertEqual(state.box.x, 3);
    assertEqual(state.box.y, 4);

    cli.execute('git right'); // player at (2,4)
    cli.execute('git push');  // box pushed to goal at (4,4)
    assertEqual(state.box.x, 4);
    assertEqual(state.box.y, 4);
    assert(state.checkGoal(), 'Level 12 Box must be on goal (4,4)');

    // Commit
    cli.execute('git commit');
    assert(state.isCommitted, 'Level 12 must be committed');
  });
});
