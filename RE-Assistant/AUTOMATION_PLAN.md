# RE Assistant — Real Estate Workflow Automation Plan

## Overview

This system automates the end-to-end real estate agent workflow from lead generation through post-client relationship management. Tasks are classified as **Fully Automated** (green) or **Semi-Automated / Manual Trigger** (yellow) based on their nature.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  RE Assistant Engine                 │
│                                                     │
│  ┌───────────┐  ┌────────────┐  ┌────────────────┐  │
│  │  Pipeline  │  │  Workflow   │  │   Scheduler    │  │
│  │  Manager   │──│  Engine     │──│   (Cron/Event) │  │
│  └───────────┘  └────────────┘  └────────────────┘  │
│        │               │               │             │
│  ┌─────┴───────────────┴───────────────┴──────────┐  │
│  │              Integration Layer                  │  │
│  │  CRM │ Email │ SMS │ Social │ MLS │ Calendar    │  │
│  └────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Core Components

1. **Pipeline Manager** — Tracks each client through the 9 stages, manages state transitions
2. **Workflow Engine** — Executes tasks (automated or prompts agent for manual ones)
3. **Scheduler** — Handles time-based triggers (drip campaigns, birthdays, recurring updates)
4. **Integration Layer** — Connects to external services (CRM, email, social, MLS, etc.)

---

## Stage-by-Stage Automation Plan

### Stage 1: Marketing

**Goal:** Generate inbound leads across channels.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Facebook posts | Auto | Scheduled content via Facebook Graph API / Buffer |
| Instagram posts | Auto | Scheduled content via Instagram API / Buffer |
| TikTok posts | Auto | Scheduled content via TikTok API |
| Google/Facebook Ads | Auto | Campaign management via Google Ads API + Meta Ads API |
| Mailers | Semi | Generate mailing list + content; agent confirms send via print vendor API |
| Update CRM | Auto | Auto-log all marketing activity to CRM |

**Integrations:** Facebook Graph API, Instagram API, TikTok API, Google Ads API, Meta Ads API, Buffer/Hootsuite, CRM API, Print vendor API (e.g., Lob)

---

### Stage 2: Inbound Lead

**Goal:** Capture and route incoming leads.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Lead Form | Auto | Webhook capture from website forms → CRM entry + auto-response email |
| Email DM | Auto | Auto-detect inbound emails, create lead record, send acknowledgment |
| Phone Call | Semi | Log call in CRM after agent completes; AI call summary transcription |
| Texting | Semi | Template-based responses via SMS API; agent reviews before send |
| Update CRM | Auto | All lead interactions auto-logged |

**Integrations:** Website form webhooks, Gmail/Outlook API, Twilio (SMS), AI transcription (Whisper/Deepgram), CRM API

---

### Stage 3: Qualifying / Nurturing

**Goal:** Nurture leads until they convert to clients.

| Task | Type | Automation Approach |
|------|------|-------------------|
| 5-Email nurturing campaign | Auto | Drip email sequence triggered on lead creation |
| Communication via email and DMs | Auto | Template-based follow-ups on schedule |
| Ongoing texts | Auto | Scheduled SMS drip via Twilio |
| Market Update / Property alert emails | Auto | Auto-pull MLS data, generate market reports, email on schedule |
| Update CRM | Auto | Auto-update lead status, engagement tracking |

**Integrations:** Email service (SendGrid/Mailgun), Twilio, MLS data feed, CRM API

**Trigger:** Lead creation event
**Exit Condition:** Lead converted to client (manual decision by agent → triggers Stage 4)

---

### Stage 4: Listing Stage (Converted to Client)

**Goal:** Prepare, list, and market the property.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Sign a Listing Agreement | Semi | Generate agreement from template (DocuSign API); agent confirms |
| Schedule Photography/Measurements | Semi | Auto-send booking request to preferred photographer; agent confirms date |
| Seller's Checklist | Auto | Auto-generate and email seller checklist document |
| Home is ready to list | Auto | Triggered when checklist items marked complete |
| Update CRM | Auto | Auto-update listing status |
| Schedule an Open House | Auto | Create calendar event, send invites, post to social media |
| Property Evaluation + Market Report | Auto | Pull MLS comps, generate CMA report automatically |
| Marketing Materials | Auto | Auto-generate flyers, social posts, email blasts from listing data |
| Email explaining "the" Selling Process | Auto | Template email sent on listing agreement signed |
| List Home on the MLS | Auto | Push listing data to MLS via RETS/RESO API |
| Promote on social media | Auto | Auto-post listing to all social channels |
| Order Lawn Signs | Auto | Auto-order via vendor API when listing goes live |
| Sending Seller "Showing" reports | Auto | Auto-aggregate showing feedback, email weekly report |
| Analyzing Offers and Presenting | Auto | Parse offer documents, create comparison spreadsheet, email to seller |
| Ongoing Marketing | Auto | Recurring social posts, email blasts on schedule |
| Updating CRM | Auto | Continuous auto-sync |

**Integrations:** DocuSign API, photographer booking system, MLS RETS/RESO API, social media APIs, sign vendor API, calendar API, document generation (PDF)

---

### Stage 5: Pending Stage

**Goal:** Manage the transaction from accepted offer to closing.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Send seller "congratulations" email | Auto | Triggered on offer acceptance; template email |
| Send Contract Package to Lender/Mortgage Rep | Auto | Auto-email contract docs to designated contacts |
| Update status on MLS | Semi | Generate MLS update; agent confirms (some MLS require manual) |
| Post "Pending" on social media | Semi | Generate post; agent reviews before publishing |
| Complete brokerage checklist and submit | Semi | Auto-fill checklist from deal data; agent reviews and submits |
| Update your CRM | Auto | Auto-update deal stage |

**Trigger:** Offer accepted event

---

### Stage 6: Property Sold

**Goal:** Handle closing logistics and celebrations.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Congratulations article + utilities/change note | Auto | Generate and email congratulations package with utility transfer info |
| Order a gift basket for delivery | Semi | Auto-place order via vendor; agent selects basket type |
| Send final docs to lawyers | Auto | Auto-email closing documents to legal contacts |
| Submit final docs to the brokerage | Auto | Auto-submit via brokerage portal API |
| Post on Social Media | Auto | Auto-generate "SOLD" post across channels |
| Sold Sticker on Lawn Sign | Semi | Notify sign vendor to add sold rider; agent confirms |
| Order lawn sign to come down | Semi | Schedule sign removal via vendor; agent confirms timing |

**Trigger:** Closing confirmed event

---

### Stage 7: Possession Day

**Goal:** Finalize the transaction and hand off.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Hand over the keys | Auto | Send calendar reminder + checklist to agent |
| Send one final email to the seller | Auto | Template email with move-in resources |
| Send Thank you email to the other agent | Auto | Template email to co-operating agent |
| Update our CRM | Auto | Auto-mark deal as closed, move client to post-client pipeline |

**Trigger:** Possession date from contract

---

### Stage 8: Post-Client

**Goal:** Maintain relationship for referrals and repeat business.

| Task | Type | Automation Approach |
|------|------|-------------------|
| Send Market updates | Auto | Monthly automated market report emails |
| Happy birthday | Auto | Auto-send birthday card/email on stored date |
| Send client list + Google Review request | Auto | Template email with review link, sent post-closing |
| Ask for Referrals | Auto | Scheduled referral request emails (quarterly) |

**Trigger:** Deal closed → enters recurring automation loop

---

## Required Integrations

| Category | Service | Purpose |
|----------|---------|---------|
| CRM | Follow Up Boss / KVCore / HubSpot | Contact + deal management |
| Email | SendGrid / Mailgun | Transactional + drip emails |
| SMS | Twilio | Text messaging |
| Social Media | Buffer / direct APIs | Scheduled posting |
| MLS | RETS / RESO Web API | Listing data, comps, status updates |
| Documents | DocuSign | Agreement signing |
| PDF Generation | Puppeteer / PDFKit | Reports, checklists, marketing materials |
| Calendar | Google Calendar API | Scheduling |
| Ads | Google Ads + Meta Ads APIs | Campaign management |
| Sign Vendor | Custom API / Lob | Lawn sign orders |
| Gift Vendor | Custom API | Gift basket orders |
| Transcription | Whisper / Deepgram | Call summaries |

---

## Data Model Summary

### Core Entities

- **Contact** — Lead or client with full profile, communication history
- **Pipeline** — Tracks which stage a contact is in
- **Listing** — Property details, photos, MLS data
- **Task** — Individual action item (auto or manual) within a stage
- **Transaction** — Deal from offer to close with all parties
- **Communication** — Log of every email, text, call, social interaction
- **Template** — Reusable email/SMS/document templates
- **Schedule** — Recurring automation triggers

---

## Automation Engine Design

### Event-Driven Architecture

```
Event (e.g., "offer_accepted")
  → Pipeline Manager updates stage
    → Workflow Engine triggers all tasks for new stage
      → Auto tasks execute immediately
      → Semi tasks create notifications for agent approval
        → Agent approves → task executes
```

### Task Execution Flow

```
┌──────────┐    ┌──────────────┐    ┌────────────────┐
│  Event   │───>│  Task Queue  │───>│  Task Executor  │
│  Emitted │    │  (Priority)  │    │                  │
└──────────┘    └──────────────┘    │  Auto? ──> Run   │
                                     │  Semi? ──> Notify │
                                     └────────────────┘
```

### Key Design Decisions

1. **Stage transitions are explicit** — Agent manually converts lead to client, accepts offer, confirms closing
2. **Auto tasks fire immediately** on stage entry unless they have a schedule (drip campaigns, recurring)
3. **Semi tasks create approval requests** — Agent gets notification, reviews, approves with one click
4. **All actions are logged** — Every automated action is recorded in CRM and activity log
5. **Templates are customizable** — Agent can modify any email/SMS template
6. **Rollback support** — Failed automations retry with exponential backoff, alert agent on persistent failure

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-3)
- Data models and database schema
- Pipeline manager with stage transitions
- Task engine with auto/semi-auto execution
- CRM integration (read/write contacts, deals)
- Email integration (send transactional emails)

### Phase 2: Lead Management (Weeks 4-5)
- Lead capture webhooks
- 5-email drip campaign automation
- SMS integration
- Market update email generation

### Phase 3: Listing Automation (Weeks 6-8)
- MLS integration (list, update status, pull comps)
- Document generation (CMA reports, checklists, marketing materials)
- Social media auto-posting
- DocuSign integration

### Phase 4: Transaction Management (Weeks 9-10)
- Pending stage automations
- Closing document routing
- Brokerage submission automation
- Vendor order integrations (signs, gifts)

### Phase 5: Post-Client & Polish (Weeks 11-12)
- Birthday and anniversary automation
- Recurring market update emails
- Google Review request automation
- Referral request campaigns
- Dashboard and reporting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js / TypeScript |
| Framework | Express or Fastify |
| Database | PostgreSQL |
| Queue | BullMQ (Redis-backed) |
| Scheduler | node-cron + BullMQ repeatable jobs |
| ORM | Prisma |
| Email | SendGrid SDK |
| SMS | Twilio SDK |
| Auth | JWT + OAuth2 for integrations |
| API Style | REST + Webhooks |
| Deployment | Docker / Vercel / Railway |
