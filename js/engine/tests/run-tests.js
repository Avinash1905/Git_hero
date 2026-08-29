/**
 * GitQuest Engine - Master Automated Test Runner Entry Point
 */

import { MasterTestRunner } from './TestRunner.js';
import { createMovementAndPhysicsSuite } from './MovementAndPhysics.test.js';
import { createPullSystemSuite } from './PullSystem.test.js';
import { createCommandSystemSuite } from './CommandSystem.test.js';
import { createObjectivesAndPuzzlesSuite } from './ObjectivesAndPuzzles.test.js';
import { createStateAndCheckpointsSuite } from './StateAndCheckpoints.test.js';
import { createMultiRoomAndWorldSuite } from './MultiRoomAndWorld.test.js';
import { createProgressionAndScoringSuite } from './ProgressionAndScoring.test.js';
import { createLevelValidationAndSolvabilitySuite } from './LevelValidationAndSolvability.test.js';
import { createScenarioIntegrationSuite } from './ScenarioIntegration.test.js';
import { createGitDagSimulatorSuite } from './GitDagSimulator.test.js';
import { createCircuitAndLogicGatesSuite } from './CircuitAndLogicGates.test.js';
import { createLaserAndConveyorSuite } from './LaserAndConveyorSystems.test.js';
import { createPortalAndPatrolSuite } from './PortalAndPatrolAI.test.js';
import { createDungeonGeneratorSuite } from './DungeonGenerator.test.js';
import { createSokobanSolverAndDeadlocksSuite } from './SokobanSolverAndDeadlocks.test.js';
import { createPhysicsAndFluidsSuite } from './PhysicsAndFluids.test.js';
import { createReplayAndTelemetrySuite } from './ReplayAndTelemetry.test.js';
import { createDistributedGitAndPRsSuite } from './DistributedGitAndPRs.test.js';
import { createWorld1SolutionsSuite, createWorld2SolutionsSuite } from './World1And2Solutions.test.js';
import { createWorld3SolutionsSuite, createWorld4SolutionsSuite } from './World3And4Solutions.test.js';
import { createWorld5SolutionsSuite, createWorld6SolutionsSuite } from './World5And6Solutions.test.js';
import { createWorld7SolutionsSuite } from './World7Solutions.test.js';
import { createWorld8SolutionsSuite } from './World8Solutions.test.js';
import { createWorld9SolutionsSuite } from './World9Solutions.test.js';
import { createWorld10SolutionsSuite } from './World10Solutions.test.js';
import { createWorld11And12SolutionsSuite } from './World11And12Solutions.test.js';
import { createWorld13And14SolutionsSuite } from './World13And14Solutions.test.js';
import { createWorld15And16SolutionsSuite } from './World15And16Solutions.test.js';
import { createWorld17And18SolutionsSuite } from './World17And18Solutions.test.js';
import { createWorld19And20SolutionsSuite } from './World19And20Solutions.test.js';
import { createGitWorktreesAndToolsSuite } from './GitWorktreesAndTools.test.js';
import { createCommandAstAndHistorySuite } from './CommandAstAndHistory.test.js';
import { createGitGraphAndToolsSuite } from './GitGraphAndTools.test.js';
import { createHunkEditorAndPhantomsSuite } from './HunkEditorAndPhantoms.test.js';
import { createProceduralAndBehaviorsSuite } from './ProceduralAndBehaviors.test.js';
import { createMagneticAndConstraintPhysicsSuite } from './MagneticAndConstraintPhysics.test.js';
import { createLinterAndProfilerSuite } from './LinterAndProfiler.test.js';
import { createProtocolAndSteeringSuite } from './ProtocolAndSteering.test.js';
import { createGarbageCollectorAndPerceptionSuite } from './GarbageCollectorAndPerception.test.js';
import { createQuantumEntanglementAndSignaturesSuite } from './QuantumEntanglementAndSignatures.test.js';
import { createLevelBlueprintsAndRoomsSuite } from './LevelBlueprintsAndRooms.test.js';

export async function runGitQuestEngineTests() {
  const runner = new MasterTestRunner();

  runner.addSuite(createMovementAndPhysicsSuite());
  runner.addSuite(createPullSystemSuite());
  runner.addSuite(createCommandSystemSuite());
  runner.addSuite(createObjectivesAndPuzzlesSuite());
  runner.addSuite(createStateAndCheckpointsSuite());
  runner.addSuite(createMultiRoomAndWorldSuite());
  runner.addSuite(createProgressionAndScoringSuite());
  runner.addSuite(createLevelValidationAndSolvabilitySuite());
  runner.addSuite(createScenarioIntegrationSuite());
  runner.addSuite(createGitDagSimulatorSuite());
  runner.addSuite(createCircuitAndLogicGatesSuite());
  runner.addSuite(createLaserAndConveyorSuite());
  runner.addSuite(createPortalAndPatrolSuite());
  runner.addSuite(createDungeonGeneratorSuite());
  runner.addSuite(createSokobanSolverAndDeadlocksSuite());
  runner.addSuite(createPhysicsAndFluidsSuite());
  runner.addSuite(createReplayAndTelemetrySuite());
  runner.addSuite(createDistributedGitAndPRsSuite());
  runner.addSuite(createWorld1SolutionsSuite());
  runner.addSuite(createWorld2SolutionsSuite());
  runner.addSuite(createWorld3SolutionsSuite());
  runner.addSuite(createWorld4SolutionsSuite());
  runner.addSuite(createWorld5SolutionsSuite());
  runner.addSuite(createWorld6SolutionsSuite());
  runner.addSuite(createWorld7SolutionsSuite());
  runner.addSuite(createWorld8SolutionsSuite());
  runner.addSuite(createWorld9SolutionsSuite());
  runner.addSuite(createWorld10SolutionsSuite());
  runner.addSuite(createWorld11And12SolutionsSuite());
  runner.addSuite(createWorld13And14SolutionsSuite());
  runner.addSuite(createWorld15And16SolutionsSuite());
  runner.addSuite(createWorld17And18SolutionsSuite());
  runner.addSuite(createWorld19And20SolutionsSuite());
  runner.addSuite(createGitWorktreesAndToolsSuite());
  runner.addSuite(createCommandAstAndHistorySuite());
  runner.addSuite(createGitGraphAndToolsSuite());
  runner.addSuite(createHunkEditorAndPhantomsSuite());
  runner.addSuite(createProceduralAndBehaviorsSuite());
  runner.addSuite(createMagneticAndConstraintPhysicsSuite());
  runner.addSuite(createLinterAndProfilerSuite());
  runner.addSuite(createProtocolAndSteeringSuite());
  runner.addSuite(createGarbageCollectorAndPerceptionSuite());
  runner.addSuite(createQuantumEntanglementAndSignaturesSuite());
  runner.addSuite(createLevelBlueprintsAndRoomsSuite());

  const results = await runner.runAll();
  return results;
}

// Auto-run if executed in browser window
if (typeof window !== 'undefined') {
  window.runGitQuestEngineTests = runGitQuestEngineTests;
}
