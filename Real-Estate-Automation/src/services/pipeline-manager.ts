import {
  Contact,
  PipelineStage,
  PipelineEvent,
  PipelineEventType,
  WorkflowTask,
  TaskType,
  TaskStatus,
  IntegrationType,
} from "../models/types";
import { getStageDefinition, StageTaskDefinition } from "../config/stages";

// ============================================================
// Pipeline Manager
// Manages client progression through the 9 pipeline stages.
// On stage transition, generates workflow tasks for execution.
// ============================================================

export class PipelineManager {
  /**
   * Transition a contact to a new pipeline stage.
   * Returns the list of WorkflowTasks to be queued for execution.
   */
  transitionStage(
    contact: Contact,
    toStage: PipelineStage,
    metadata?: Record<string, unknown>
  ): { event: PipelineEvent; tasks: WorkflowTask[] } {
    const fromStage = contact.stage;
    const now = new Date().toISOString();

    // Create the pipeline event
    const event: PipelineEvent = {
      id: generateId(),
      contactId: contact.id,
      eventType: PipelineEventType.STAGE_CHANGED,
      fromStage,
      toStage,
      metadata,
      createdAt: now,
    };

    // Get task definitions for the new stage
    const stageDef = getStageDefinition(toStage);
    if (!stageDef) {
      return { event, tasks: [] };
    }

    // Generate workflow tasks from stage definitions
    const tasks = stageDef.tasks.map((taskDef) =>
      this.createWorkflowTask(taskDef, contact, now)
    );

    // Update contact stage
    contact.stage = toStage;
    contact.updatedAt = now;

    return { event, tasks };
  }

  /**
   * Create a WorkflowTask from a stage task definition.
   */
  private createWorkflowTask(
    taskDef: StageTaskDefinition,
    contact: Contact,
    now: string
  ): WorkflowTask {
    const scheduledAt = taskDef.delayMinutes
      ? new Date(Date.now() + taskDef.delayMinutes * 60_000).toISOString()
      : now;

    return {
      id: generateId(),
      stage: contact.stage,
      taskType: taskDef.taskType,
      name: taskDef.name,
      description: taskDef.description,
      contactId: contact.id,
      status:
        taskDef.taskType === TaskType.AUTO
          ? TaskStatus.PENDING
          : TaskStatus.AWAITING_APPROVAL,
      scheduledAt,
      integration: taskDef.integration,
      templateId: taskDef.templateId,
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Get the next stage in the pipeline, if any.
   */
  getNextStage(currentStage: PipelineStage): PipelineStage | undefined {
    const stageDef = getStageDefinition(currentStage);
    return stageDef?.nextStage;
  }

  /**
   * Check if all required tasks for a stage are complete.
   */
  isStageComplete(tasks: WorkflowTask[], stage: PipelineStage): boolean {
    const stageTasks = tasks.filter((t) => t.stage === stage);
    return stageTasks.every(
      (t) =>
        t.status === TaskStatus.COMPLETED || t.status === TaskStatus.SKIPPED
    );
  }

  /**
   * Get tasks that are ready to execute (dependencies met).
   */
  getReadyTasks(
    allTasks: WorkflowTask[],
    stage: PipelineStage
  ): WorkflowTask[] {
    const stageDef = getStageDefinition(stage);
    if (!stageDef) return [];

    return allTasks.filter((task) => {
      if (task.stage !== stage) return false;
      if (task.status !== TaskStatus.PENDING) return false;

      // Check dependencies
      const taskDef = stageDef.tasks.find((td) => td.name === task.name);
      if (!taskDef?.dependsOn?.length) return true;

      return taskDef.dependsOn.every((depName) => {
        const depTask = allTasks.find(
          (t) => t.name === depName && t.stage === stage
        );
        return depTask?.status === TaskStatus.COMPLETED;
      });
    });
  }
}

// Simple ID generator
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
