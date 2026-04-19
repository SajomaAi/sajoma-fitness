import { PipelineStage } from "../models/types";
import { PIPELINE_STAGES, StageTaskDefinition } from "../config/stages";

// ============================================================
// Scheduler
// Manages cron-based recurring tasks and one-time delayed tasks.
// Uses node-cron for scheduling and BullMQ for reliable execution.
// ============================================================

export interface ScheduledTaskEntry {
  taskName: string;
  stage: PipelineStage;
  cronExpression: string;
  description: string;
  contactId?: string; // undefined = applies to all contacts in stage
  enabled: boolean;
}

export class Scheduler {
  private scheduledTasks: ScheduledTaskEntry[] = [];

  /**
   * Initialize all recurring tasks from stage definitions.
   */
  initialize(): ScheduledTaskEntry[] {
    this.scheduledTasks = [];

    for (const stageDef of PIPELINE_STAGES) {
      for (const task of stageDef.tasks) {
        if (task.cronSchedule) {
          this.scheduledTasks.push({
            taskName: task.name,
            stage: stageDef.stage,
            cronExpression: task.cronSchedule,
            description: task.description,
            enabled: true,
          });
        }
      }
    }

    return this.scheduledTasks;
  }

  /**
   * Get all scheduled tasks.
   */
  getScheduledTasks(): ScheduledTaskEntry[] {
    return this.scheduledTasks;
  }

  /**
   * Get scheduled tasks for a specific stage.
   */
  getScheduledTasksForStage(stage: PipelineStage): ScheduledTaskEntry[] {
    return this.scheduledTasks.filter((t) => t.stage === stage);
  }

  /**
   * Enable or disable a scheduled task.
   */
  setTaskEnabled(taskName: string, enabled: boolean): boolean {
    const task = this.scheduledTasks.find((t) => t.taskName === taskName);
    if (task) {
      task.enabled = enabled;
      return true;
    }
    return false;
  }

  /**
   * Calculate the next run time for a one-time delayed task.
   */
  calculateDelayedRunTime(delayMinutes: number): Date {
    return new Date(Date.now() + delayMinutes * 60_000);
  }

  /**
   * Get a summary of all scheduled automations.
   */
  getSummary(): {
    totalRecurring: number;
    enabledRecurring: number;
    byStage: Record<string, number>;
  } {
    const byStage: Record<string, number> = {};
    for (const task of this.scheduledTasks) {
      byStage[task.stage] = (byStage[task.stage] || 0) + 1;
    }

    return {
      totalRecurring: this.scheduledTasks.length,
      enabledRecurring: this.scheduledTasks.filter((t) => t.enabled).length,
      byStage,
    };
  }
}
