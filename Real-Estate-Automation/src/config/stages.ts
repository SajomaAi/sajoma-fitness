import {
  PipelineStage,
  TaskType,
  IntegrationType,
  PipelineEventType,
} from "../models/types";

// ============================================================
// Stage & Task Definitions — Derived from Workflow Flowchart
// ============================================================

export interface StageTaskDefinition {
  name: string;
  description: string;
  taskType: TaskType;
  integration: IntegrationType;
  templateId?: string;
  delayMinutes?: number; // delay after stage entry before executing
  cronSchedule?: string; // for recurring tasks
  dependsOn?: string[]; // task names this depends on
}

export interface StageDefinition {
  stage: PipelineStage;
  displayName: string;
  entryEvent: PipelineEventType;
  tasks: StageTaskDefinition[];
  nextStage?: PipelineStage;
}

export const PIPELINE_STAGES: StageDefinition[] = [
  // ── Stage 1: Marketing ──
  {
    stage: PipelineStage.MARKETING,
    displayName: "Marketing",
    entryEvent: PipelineEventType.LEAD_CREATED,
    tasks: [
      {
        name: "facebook_post",
        description: "Publish marketing content to Facebook",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
        cronSchedule: "0 9 * * 1,3,5", // Mon/Wed/Fri at 9am
      },
      {
        name: "instagram_post",
        description: "Publish marketing content to Instagram",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
        cronSchedule: "0 10 * * 2,4", // Tue/Thu at 10am
      },
      {
        name: "tiktok_post",
        description: "Publish marketing content to TikTok",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
        cronSchedule: "0 12 * * 1,4", // Mon/Thu at noon
      },
      {
        name: "google_facebook_ads",
        description: "Manage Google and Facebook ad campaigns",
        taskType: TaskType.AUTO,
        integration: IntegrationType.ADS,
        cronSchedule: "0 8 * * 1", // Weekly review Monday 8am
      },
      {
        name: "mailers",
        description: "Generate and send physical mailers",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.INTERNAL,
        cronSchedule: "0 9 1 * *", // Monthly on the 1st
      },
      {
        name: "update_crm_marketing",
        description: "Log marketing activities in CRM",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.INBOUND_LEAD,
  },

  // ── Stage 2: Inbound Lead ──
  {
    stage: PipelineStage.INBOUND_LEAD,
    displayName: "Inbound Lead",
    entryEvent: PipelineEventType.LEAD_CREATED,
    tasks: [
      {
        name: "capture_lead_form",
        description: "Capture lead from website form and create CRM entry",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
      {
        name: "email_dm_response",
        description: "Send auto-acknowledgment email to new lead",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "lead_acknowledgment",
      },
      {
        name: "phone_call_log",
        description: "Log phone call details and AI transcription summary",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.CRM,
      },
      {
        name: "texting_response",
        description: "Send template SMS response; agent reviews before send",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.SMS,
        templateId: "lead_text_response",
      },
      {
        name: "update_crm_lead",
        description: "Update CRM with lead details",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.QUALIFYING_NURTURING,
  },

  // ── Stage 3: Qualifying / Nurturing ──
  {
    stage: PipelineStage.QUALIFYING_NURTURING,
    displayName: "Qualifying / Nurturing",
    entryEvent: PipelineEventType.STAGE_CHANGED,
    tasks: [
      {
        name: "five_email_nurture_campaign",
        description: "Trigger 5-email drip campaign",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "nurture_drip_1",
      },
      {
        name: "email_dm_communication",
        description: "Scheduled follow-up emails and DMs",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        cronSchedule: "0 10 * * 3", // Wednesdays at 10am
      },
      {
        name: "ongoing_texts",
        description: "Automated nurturing text messages",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SMS,
        cronSchedule: "0 11 * * 5", // Fridays at 11am
        templateId: "nurture_text",
      },
      {
        name: "market_update_emails",
        description: "Send market updates and property alerts",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        cronSchedule: "0 9 * * 1", // Mondays at 9am
        templateId: "market_update",
      },
      {
        name: "update_crm_nurturing",
        description: "Update CRM with engagement data",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.LISTING,
  },

  // ── Stage 4: Listing Stage (after "Converted to Client") ──
  {
    stage: PipelineStage.LISTING,
    displayName: "Listing Stage",
    entryEvent: PipelineEventType.LISTING_CREATED,
    tasks: [
      {
        name: "sign_listing_agreement",
        description: "Generate listing agreement via DocuSign for signature",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.DOCUSIGN,
        templateId: "listing_agreement",
      },
      {
        name: "schedule_photography",
        description: "Send booking request to preferred photographer",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.CALENDAR,
      },
      {
        name: "seller_checklist",
        description: "Generate and email seller preparation checklist",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "seller_checklist",
        dependsOn: ["sign_listing_agreement"],
      },
      {
        name: "email_selling_process",
        description: "Email explaining the selling process",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "selling_process",
        dependsOn: ["sign_listing_agreement"],
      },
      {
        name: "property_evaluation_report",
        description: "Generate CMA report with MLS comp data",
        taskType: TaskType.AUTO,
        integration: IntegrationType.MLS,
      },
      {
        name: "home_ready_to_list",
        description: "Mark home as ready when checklist complete",
        taskType: TaskType.AUTO,
        integration: IntegrationType.INTERNAL,
        dependsOn: ["seller_checklist"],
      },
      {
        name: "list_on_mls",
        description: "Push listing to MLS",
        taskType: TaskType.AUTO,
        integration: IntegrationType.MLS,
        dependsOn: ["home_ready_to_list"],
      },
      {
        name: "marketing_materials",
        description: "Auto-generate flyers, social posts, email blasts",
        taskType: TaskType.AUTO,
        integration: IntegrationType.PDF_GENERATION,
        dependsOn: ["home_ready_to_list"],
      },
      {
        name: "promote_social_media",
        description: "Post listing to all social channels",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
        dependsOn: ["list_on_mls"],
      },
      {
        name: "schedule_open_house",
        description: "Create open house event and send invitations",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CALENDAR,
        dependsOn: ["list_on_mls"],
      },
      {
        name: "order_lawn_signs",
        description: "Order lawn signs from vendor",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SIGN_VENDOR,
        dependsOn: ["list_on_mls"],
      },
      {
        name: "showing_reports",
        description: "Aggregate showing feedback and email weekly report",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        cronSchedule: "0 17 * * 5", // Friday at 5pm
        templateId: "showing_report",
      },
      {
        name: "analyze_offers",
        description: "Parse offers, create comparison, email to seller",
        taskType: TaskType.AUTO,
        integration: IntegrationType.PDF_GENERATION,
      },
      {
        name: "ongoing_marketing",
        description: "Recurring social and email marketing for listing",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
        cronSchedule: "0 10 * * 1,4", // Mon/Thu at 10am
      },
      {
        name: "update_crm_listing",
        description: "Sync listing status to CRM",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.PENDING,
  },

  // ── Stage 5: Pending Stage ──
  {
    stage: PipelineStage.PENDING,
    displayName: "Pending Stage",
    entryEvent: PipelineEventType.OFFER_ACCEPTED,
    tasks: [
      {
        name: "congratulations_email",
        description: "Send congratulations email to seller",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "congratulations_pending",
      },
      {
        name: "send_contract_to_lender",
        description: "Email contract package to lender/mortgage rep",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "contract_to_lender",
      },
      {
        name: "update_mls_status",
        description: "Update listing status to Pending on MLS",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.MLS,
      },
      {
        name: "post_pending_social",
        description: "Post 'Pending' update to social media",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
      },
      {
        name: "brokerage_checklist",
        description: "Auto-fill brokerage checklist; agent reviews and submits",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.INTERNAL,
      },
      {
        name: "update_crm_pending",
        description: "Update CRM deal stage to Pending",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.PROPERTY_SOLD,
  },

  // ── Stage 6: Property Sold ──
  {
    stage: PipelineStage.PROPERTY_SOLD,
    displayName: "Property Sold",
    entryEvent: PipelineEventType.PROPERTY_SOLD,
    tasks: [
      {
        name: "congrats_utilities_note",
        description: "Send congratulations package with utility transfer info",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "congrats_sold",
      },
      {
        name: "order_gift_basket",
        description: "Place gift basket order; agent selects type",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.GIFT_VENDOR,
      },
      {
        name: "send_docs_to_lawyers",
        description: "Email closing documents to legal contacts",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "docs_to_lawyer",
      },
      {
        name: "submit_docs_to_brokerage",
        description: "Submit final documents to brokerage",
        taskType: TaskType.AUTO,
        integration: IntegrationType.INTERNAL,
      },
      {
        name: "post_sold_social",
        description: "Post 'SOLD' announcement to social media",
        taskType: TaskType.AUTO,
        integration: IntegrationType.SOCIAL_MEDIA,
      },
      {
        name: "sold_sticker_sign",
        description: "Notify vendor to add sold rider to lawn sign",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.SIGN_VENDOR,
      },
      {
        name: "order_sign_removal",
        description: "Schedule lawn sign removal",
        taskType: TaskType.SEMI_AUTO,
        integration: IntegrationType.SIGN_VENDOR,
      },
    ],
    nextStage: PipelineStage.POSSESSION_DAY,
  },

  // ── Stage 7: Possession Day ──
  {
    stage: PipelineStage.POSSESSION_DAY,
    displayName: "Possession Day",
    entryEvent: PipelineEventType.POSSESSION_COMPLETE,
    tasks: [
      {
        name: "hand_over_keys",
        description: "Send calendar reminder and key handoff checklist",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CALENDAR,
      },
      {
        name: "final_email_to_seller",
        description: "Send final email with move-in resources",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "final_seller_email",
      },
      {
        name: "thank_you_other_agent",
        description: "Send thank you email to co-operating agent",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "thank_you_agent",
      },
      {
        name: "update_crm_closed",
        description: "Mark deal as closed, move to post-client pipeline",
        taskType: TaskType.AUTO,
        integration: IntegrationType.CRM,
      },
    ],
    nextStage: PipelineStage.POST_CLIENT,
  },

  // ── Stage 8: Post-Client ──
  {
    stage: PipelineStage.POST_CLIENT,
    displayName: "Post-Client",
    entryEvent: PipelineEventType.POSSESSION_COMPLETE,
    tasks: [
      {
        name: "send_market_updates",
        description: "Monthly market report emails to past clients",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        cronSchedule: "0 9 1 * *", // 1st of every month
        templateId: "market_update_client",
      },
      {
        name: "happy_birthday",
        description: "Auto-send birthday card/email",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        templateId: "happy_birthday",
      },
      {
        name: "google_review_request",
        description: "Send Google Review request email",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        delayMinutes: 10080, // 7 days after possession
        templateId: "google_review",
      },
      {
        name: "ask_for_referrals",
        description: "Quarterly referral request email",
        taskType: TaskType.AUTO,
        integration: IntegrationType.EMAIL,
        cronSchedule: "0 9 1 1,4,7,10 *", // Quarterly
        templateId: "referral_request",
      },
    ],
  },
];

// Helper to get stage definition
export function getStageDefinition(
  stage: PipelineStage
): StageDefinition | undefined {
  return PIPELINE_STAGES.find((s) => s.stage === stage);
}

// Helper to get all auto tasks for a stage
export function getAutoTasks(stage: PipelineStage): StageTaskDefinition[] {
  const def = getStageDefinition(stage);
  return def?.tasks.filter((t) => t.taskType === TaskType.AUTO) ?? [];
}

// Helper to get all semi-auto tasks for a stage
export function getSemiAutoTasks(stage: PipelineStage): StageTaskDefinition[] {
  const def = getStageDefinition(stage);
  return def?.tasks.filter((t) => t.taskType === TaskType.SEMI_AUTO) ?? [];
}
