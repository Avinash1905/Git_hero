/**
 * GitQuest Game Engine - Git Maintenance Scheduler
 * Automates periodic repository housekeeping: commit-graph updates,
 * incremental packfile repacks, loose object pruning, and reflog expirations.
 */

export class MaintenanceTask {
  constructor(name, intervalMs, executeFn, description = '') {
    this.name = name;
    this.intervalMs = intervalMs;
    this.executeFn = executeFn;
    this.description = description;
    this.lastRun = 0;
    this.runCount = 0;
    this.isRunning = false;
  }
}

export class GitMaintenanceScheduler {
  constructor() {
    this.tasks = new Map();
    this.initDefaultTasks();
  }

  initDefaultTasks() {
    this.registerTask(new MaintenanceTask(
      'commit-graph',
      3600000, // Hourly
      () => ({ status: 'success', nodesIndexed: 250, message: 'Commit-graph reachability cache updated' }),
      'Generates commit-graph file for fast DAG traversals'
    ));

    this.registerTask(new MaintenanceTask(
      'loose-objects',
      7200000, // 2-hourly
      () => ({ status: 'success', pruned: 14, message: 'Consolidated loose objects into packfile' }),
      'Packs loose objects into single compressed packfile'
    ));

    this.registerTask(new MaintenanceTask(
      'incremental-repack',
      86400000, // Daily
      () => ({ status: 'success', savingsBytes: 45000, message: 'Multi-pack index optimized' }),
      'Repacks unreachable objects and prunes redundant data'
    ));
  }

  registerTask(task) {
    this.tasks.set(task.name, task);
  }

  runTask(taskName) {
    const task = this.tasks.get(taskName);
    if (!task) return { success: false, reason: 'Task not found' };

    task.isRunning = true;
    const result = task.executeFn();
    task.lastRun = Date.now();
    task.runCount++;
    task.isRunning = false;

    return {
      success: true,
      task: task.name,
      result
    };
  }

  runAllPending() {
    const results = [];
    for (const task of this.tasks.values()) {
      const res = this.runTask(task.name);
      results.push(res);
    }
    return results;
  }

  listTasks() {
    return Array.from(this.tasks.values()).map(t => ({
      name: t.name,
      description: t.description,
      lastRun: t.lastRun ? new Date(t.lastRun).toISOString() : 'Never',
      runCount: t.runCount
    }));
  }
}
