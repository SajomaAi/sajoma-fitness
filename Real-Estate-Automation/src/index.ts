import {
  Contact,
  PipelineStage,
  LeadSource,
  TaskStatus,
} from "./models/types";
import { PipelineManager } from "./services/pipeline-manager";
import { WorkflowEngine } from "./services/workflow-engine";
import { Scheduler } from "./services/scheduler";
import { createAllExecutors } from "./services/integrations";

export function createRealEstateAutomation() {
  const pipelineManager = new PipelineManager();
  const workflowEngine = new WorkflowEngine();
  const scheduler = new Scheduler();

  // Register all integration executors
  for (const executor of createAllExecutors()) {
    workflowEngine.registerExecutor(executor);
  }

  // Log task completions
  workflowEngine.onComplete((task, result) => {
    console.log(
      `[${result.success ? "OK" : "FAIL"}] ${task.name}: ${result.message}`
    );
  });

  // Log approval requests
  workflowEngine.onApproval((task) => {
    console.log(`[APPROVAL NEEDED] ${task.name}: ${task.description}`);
  });

  // Initialize recurring schedules
  const scheduledTasks = scheduler.initialize();
  console.log(
    `Scheduler initialized with ${scheduledTasks.length} recurring tasks`
  );

  return {
    pipelineManager,
    workflowEngine,
    scheduler,

    /**
     * Create a new lead and start the pipeline.
     */
    async createLead(leadData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      source: LeadSource;
      agentId: string;
    }) {
      const contact: Contact = {
        id: `contact-${Date.now()}`,
        ...leadData,
        stage: PipelineStage.INBOUND_LEAD,
        assignedAgentId: leadData.agentId,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Transition to inbound lead stage
      const { event, tasks } = pipelineManager.transitionStage(
        contact,
        PipelineStage.INBOUND_LEAD
      );

      // Execute auto tasks, queue semi-auto for approval
      await workflowEngine.processTasks(tasks);

      return { contact, event, tasks };
    },

    /**
     * Advance a contact to the next stage.
     */
    async advanceStage(
      contact: Contact,
      toStage: PipelineStage,
      metadata?: Record<string, unknown>
    ) {
      const { event, tasks } = pipelineManager.transitionStage(
        contact,
        toStage,
        metadata
      );

      await workflowEngine.processTasks(tasks);

      return { event, tasks };
    },

    /**
     * Approve a semi-auto task.
     */
    async approveTask(task: { id: string; status: TaskStatus } & Record<string, any>) {
      return workflowEngine.approveAndExecute(task as any);
    },
  };
}

// ── Boot ──
if (require.main === module) {
  console.log("Real Estate Automation — Workflow Engine");
  console.log("========================================\n");

  const assistant = createRealEstateAutomation();

  // Print scheduler summary
  const summary = assistant.scheduler.getSummary();
  console.log(`\nRecurring automations: ${summary.totalRecurring}`);
  console.log("By stage:", summary.byStage);
  console.log("\nReal Estate Automation ready. Waiting for events...\n");
}
