// Real Estate Automation — Core Data Models

// --- Pipeline Stages ---

export enum PipelineStage {
  MARKETING = "marketing",
  INBOUND_LEAD = "inbound_lead",
  QUALIFYING_NURTURING = "qualifying_nurturing",
  LISTING = "listing",
  PENDING = "pending",
  PROPERTY_SOLD = "property_sold",
  POSSESSION_DAY = "possession_day",
  POST_CLIENT = "post_client",
}

// --- Task Automation Type ---

export enum TaskType {
  AUTO = "auto",
  SEMI_AUTO = "semi_auto",
}

export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  AWAITING_APPROVAL = "awaiting_approval",
  COMPLETED = "completed",
  FAILED = "failed",
  SKIPPED = "skipped",
}

// --- Contact ---

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  source: LeadSource;
  stage: PipelineStage;
  assignedAgentId: string;
  birthday?: string; // ISO date
  address?: string;
  notes?: string;
  tags: string[];
  crmExternalId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum LeadSource {
  FACEBOOK = "facebook",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
  GOOGLE_ADS = "google_ads",
  MAILER = "mailer",
  WEBSITE_FORM = "website_form",
  EMAIL = "email",
  PHONE = "phone",
  TEXT = "text",
  REFERRAL = "referral",
  OTHER = "other",
}

// --- Listing ---

export interface Listing {
  id: string;
  contactId: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description: string;
  photos: string[];
  mlsId?: string;
  mlsStatus: MLSStatus;
  listDate?: string;
  pendingDate?: string;
  soldDate?: string;
  possessionDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum MLSStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  PENDING = "pending",
  SOLD = "sold",
  WITHDRAWN = "withdrawn",
}

// --- Transaction ---

export interface Transaction {
  id: string;
  listingId: string;
  buyerContactId?: string;
  sellerContactId: string;
  agentId: string;
  cooperatingAgentName?: string;
  cooperatingAgentEmail?: string;
  offerPrice: number;
  finalPrice?: number;
  lenderName?: string;
  lenderEmail?: string;
  lawyerName?: string;
  lawyerEmail?: string;
  closingDate?: string;
  possessionDate?: string;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionStatus {
  OFFER_RECEIVED = "offer_received",
  OFFER_ACCEPTED = "offer_accepted",
  PENDING = "pending",
  CLOSING = "closing",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

// --- Workflow Task ---

export interface WorkflowTask {
  id: string;
  stage: PipelineStage;
  taskType: TaskType;
  name: string;
  description: string;
  contactId: string;
  listingId?: string;
  transactionId?: string;
  status: TaskStatus;
  scheduledAt?: string;
  completedAt?: string;
  result?: string;
  error?: string;
  integration: IntegrationType;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export enum IntegrationType {
  CRM = "crm",
  EMAIL = "email",
  SMS = "sms",
  SOCIAL_MEDIA = "social_media",
  MLS = "mls",
  CALENDAR = "calendar",
  DOCUSIGN = "docusign",
  PDF_GENERATION = "pdf_generation",
  SIGN_VENDOR = "sign_vendor",
  GIFT_VENDOR = "gift_vendor",
  ADS = "ads",
  INTERNAL = "internal",
}

// --- Communication Log ---

export interface CommunicationLog {
  id: string;
  contactId: string;
  channel: "email" | "sms" | "phone" | "social" | "in_person";
  direction: "inbound" | "outbound";
  subject?: string;
  body?: string;
  taskId?: string;
  createdAt: string;
}

// --- Email/SMS Template ---

export interface Template {
  id: string;
  name: string;
  stage: PipelineStage;
  channel: "email" | "sms";
  subject?: string;
  body: string;
  variables: string[]; // e.g., ["{{firstName}}", "{{propertyAddress}}"]
  createdAt: string;
  updatedAt: string;
}

// --- Scheduled Job ---

export interface ScheduledJob {
  id: string;
  contactId: string;
  taskName: string;
  cronExpression?: string;
  runAt?: string; // one-time schedule
  recurring: boolean;
  enabled: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
}

// --- Pipeline Event ---

export interface PipelineEvent {
  id: string;
  contactId: string;
  eventType: PipelineEventType;
  fromStage?: PipelineStage;
  toStage?: PipelineStage;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export enum PipelineEventType {
  LEAD_CREATED = "lead_created",
  STAGE_CHANGED = "stage_changed",
  TASK_COMPLETED = "task_completed",
  TASK_FAILED = "task_failed",
  APPROVAL_REQUESTED = "approval_requested",
  APPROVAL_GRANTED = "approval_granted",
  LISTING_CREATED = "listing_created",
  OFFER_RECEIVED = "offer_received",
  OFFER_ACCEPTED = "offer_accepted",
  PROPERTY_SOLD = "property_sold",
  POSSESSION_COMPLETE = "possession_complete",
}
