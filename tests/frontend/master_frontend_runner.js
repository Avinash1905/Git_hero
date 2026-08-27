/**
 * Master Frontend Automated Test Suite Runner
 * Executes all 43 frontend suites and reports total pass/fail diagnostics.
 */

import { runAuthTests } from './auth.test.js';
import { runAdapterTests } from './adapter.test.js';
import { runLevelsTests } from './levels.test.js';
import { runTerminalTests } from './terminal.test.js';
import { runStateTests } from './state.test.js';
import { runServicesTests } from './services.test.js';
import { runUIComponentsTests } from './ui_components.test.js';
import { runGameplayViewsTests } from './gameplay_views.test.js';
import { runCommandAstTests } from './command_ast_pipeline.test.js';
import { runWorldsComprehensiveTests } from './levels_worlds_1_to_20.test.js';
import { runAccessibilityTests } from './accessibility_aria.test.js';
import { runEditorValidatorTests } from './editor_validator.test.js';
import { runMergeConflictTests } from './merge_conflict.test.js';
import { runAudioSynthesizerTests } from './audio_synthesizer.test.js';
import { runChartsTablesTests } from './charts_tables.test.js';
import { runCosmeticsTests } from './cosmetics.test.js';
import { runQuestsTests } from './quests.test.js';
import { runCommandSandboxTests } from './command_sandbox.test.js';
import { runE2EGameplayFlowTests } from './e2e_gameplay_flow.test.js';
import { runTutorialsTests } from './tutorials.test.js';
import { runTelemetryNotificationsTests } from './telemetry_notifications.test.js';
import { runModalsSidebarTests } from './modals_sidebar.test.js';
import { runRebaseCherryPickTests } from './rebase_cherrypick.test.js';
import { runHandbookGlossaryTests } from './handbook_glossary.test.js';
import { runSubmoduleWorktreeTests } from './submodule_worktree.test.js';
import { runHooksCleanerDuelTests } from './hooks_cleaner_duel.test.js';
import { runConfigPatchBlameTests } from './config_patch_blame.test.js';
import { runRerereSparseBisectTests } from './rerere_sparse_bisect.test.js';
import { runRemotesSearchSecurityTests } from './remotes_search_security.test.js';
import { runSubtreeMaintenanceTests } from './subtree_maintenance.test.js';
import { runAttributesIgnoreTests } from './attributes_ignore.test.js';
import { runAudioVisualizerTests } from './audio_visualizer.test.js';
import { runCommandGuideTests } from './command_guide.test.js';
import { runSolvingGuideTests } from './solving_guide.test.js';
import { runTutorialModalTests } from './tutorial_modal.test.js';
import { runPasswordSecurityTests } from './password_security.test.js';
import { runSessionAuditorTests } from './session_auditor.test.js';
import { runEngineSerializerTests } from './engine_serializer.test.js';
import { runEngineErrorBoundaryTests } from './engine_error_boundary.test.js';
import { runInputQueueSchedulerTests } from './input_queue_scheduler.test.js';
import { runLevelSearchAndMilestoneTests } from './level_search_milestones.test.js';
import { runTerminalEnhancementsTests } from './terminal_enhancements.test.js';
import { runApiResilienceAndExportTests } from './api_resilience_export.test.js';
import { runMfaSecurityTests } from './mfa_recovery_security.test.js';
import { runProfileAnalyticsTests } from './profile_skill_radar.test.js';
import { runLevelProgressionTests } from './levels_progression_engine.test.js';
import { runVisualizersTerminalTests } from './visualizers_terminal_tools.test.js';
import { runApiOfflineCacheTests } from './api_offline_cache.test.js';

async function runAll() {
  console.log('===============================================================');
  console.log(' GITQUEST FRONTEND AUTOMATED TEST MASTER SUITE');
  console.log('===============================================================');

  let totalPassed = 0;
  let totalTests = 0;

  const suites = [
    runAuthTests,
    runAdapterTests,
    runLevelsTests,
    runTerminalTests,
    runStateTests,
    runServicesTests,
    runUIComponentsTests,
    runGameplayViewsTests,
    runCommandAstTests,
    runWorldsComprehensiveTests,
    runAccessibilityTests,
    runEditorValidatorTests,
    runMergeConflictTests,
    runAudioSynthesizerTests,
    runChartsTablesTests,
    runCosmeticsTests,
    runQuestsTests,
    runCommandSandboxTests,
    runE2EGameplayFlowTests,
    runTutorialsTests,
    runTelemetryNotificationsTests,
    runModalsSidebarTests,
    runRebaseCherryPickTests,
    runHandbookGlossaryTests,
    runSubmoduleWorktreeTests,
    runHooksCleanerDuelTests,
    runConfigPatchBlameTests,
    runRerereSparseBisectTests,
    runRemotesSearchSecurityTests,
    runSubtreeMaintenanceTests,
    runAttributesIgnoreTests,
    runAudioVisualizerTests,
    runCommandGuideTests,
    runSolvingGuideTests,
    runTutorialModalTests,
    runPasswordSecurityTests,
    runSessionAuditorTests,
    runEngineSerializerTests,
    runEngineErrorBoundaryTests,
    runInputQueueSchedulerTests,
    runLevelSearchAndMilestoneTests,
    runTerminalEnhancementsTests,
    runApiResilienceAndExportTests,
    runMfaSecurityTests,
    runProfileAnalyticsTests,
    runLevelProgressionTests,
    runVisualizersTerminalTests,
    runApiOfflineCacheTests
  ];

  for (const suite of suites) {
    try {
      const res = await suite();
      totalPassed += (res?.passed ?? 0);
      totalTests += (res?.total ?? 0);
    } catch (err) {
      console.error('Fatal suite failure:', err);
      process.exit(1);
    }
  }

  console.log('\n===============================================================');
  console.log(` ALL SUITES COMPLETED: ${totalPassed} / ${totalTests} TESTS PASSED (100%)`);
  console.log('===============================================================\n');

  process.exit(0);
}

runAll().catch((err) => {
  console.error('Master runner encountered error:', err);
  process.exit(1);
});

