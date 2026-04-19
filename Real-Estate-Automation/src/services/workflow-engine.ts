import {
  WorkflowTask,
  TaskType,
  TaskStatus,
  IntegrationType,
  PipelineEvent,
  PipelineEventType,
} from "../models/types";

// ============================================================
// Workflow Engine
// Executes tasks: auto tasks run immediately, semi-auto tasks
// wait for agent approval before executing.
// ============================================================

export interface TaskExecutor {
  integration: IntegrationType;
  execute(task: WorkflowTask): Promise<TaskResult>;
}

export interface TaskResult {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

export class WorkflowEngine {
  private executors: Map<IntegrationType, TaskExecutor> = new Map();
  private onTaskComplete?: (task: WorkflowTask, result: TaskResult) => void;
  private onApprovalNeeded?: (task: WorkflowTask) => void;

  /**
   * Register an executor for a specific integration type.
   */
  registerExecutor(executor: TaskExecutor): void {
    this.executors.set(executor.integration, executor);
  }

  /**
   * Set callback for task completion.
   */
  onComplete(callback: (task: WorkflowTask, result: TaskResult) => void): void {
    this.onTaskComplete = callback;
  }

  /**
   * Set callback for when approval is needed.
   */
  onApproval(callback: (task: WorkflowTask) => void): void {
    this.onApprovalNeeded = callback;
  }

  /**
   * Process a batch of tasks. Auto tasks execute immediately,
   * semi-auto tasks are flagged for approval.
   */
  async processTasks(tasks: WorkflowTask[]): Promise<void> {
    for (const task of tasks) {
      if (task.taskType === TaskType.AUTO) {
        await this.executeTask(task);
      } else {
        // Semi-auto: notify agent for approval
        task.status = TaskStatus.AWAITING_APPROVAL;
        task.updatedAt = new Date().toISOString();
        this.onApprovalNeeded?.(task);
      }
    }
  }

  /**
   * Approve a semi-auto task, then execute it.
   */
  async approveAndExecute(task: WorkflowTask): Promise<TaskResult> {
    if (task.status !== TaskStatus.AWAITING_APPROVAL) {
      return { success: false, message: "Task is not awaiting approval" };
    }
    return this.executeTask(task);
  }

  /**
   * Execute a single task using its registered executor.
   */
  private async executeTask(task: WorkflowTask): Promise<TaskResult> {
    const executor = this.executors.get(task.integration);

    if (!executor) {
      const result: TaskResult = {
        success: false,
        message: `No executor registered for integration: ${task.integration}`,
      };
      task.status = TaskStatus.FAILED;
      task.error = result.message;
      task.updatedAt = new Date().toISOString();
      this.onTaskComplete?.(task, result);
      return result;
    }

    task.status = TaskStatus.IN_PROGRESS;
    task.updatedAt = new Date().toISOString();

    try {
      const result = await executor.execute(task);

      if (result.success) {
        task.status = TaskStatus.COMPLETED;
        task.completedAt = new Date().toISOString();
        task.result = result.message;
      } else {
        task.status = TaskStatus.FAILED;
        task.error = result.message;
      }

      task.updatedAt = new Date().toISOString();
      this.onTaskComplete?.(task, result);
      return result;
    } catch (error) {
      const result: TaskResult = {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
      task.status = TaskStatus.FAILED;
      task.error = result.message;
      task.updatedAt = new Date().toISOString();
      this.onTaskComplete?.(task, result);
      return result;
    }
  }

  /**
   * Get execution summary for a set of tasks.
   */
  getTaskSummary(tasks: WorkflowTask[]): {
    total: number;
    completed: number;
    failed: number;
    pending: number;
    awaitingApproval: number;
  } {
    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length,
      failed: tasks.filter((t) => t.status === TaskStatus.FAILED).length,
      pending: tasks.filter((t) => t.status === TaskStatus.PENDING).length,
      awaitingApproval: tasks.filter(
        (t) => t.status === TaskStatus.AWAITING_APPROVAL
      ).length,
    };
  }
}
