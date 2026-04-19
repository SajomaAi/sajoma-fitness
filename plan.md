# Real Estate Automation — Workflow Plan

## Overview

Build an automation system inside `Real-Estate-Automation/` that orchestrates the full real estate agent workflow from **Marketing → Post-Client**, automating green tasks and flagging yellow (manual) tasks for human action.

---

## Flowchart Analysis (from image)

### Stage 1: Marketing (all automatable ✅)
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Facebook posts | ✅ | Facebook/Meta Graph API — schedule posts |
| Instagram posts | ✅ | Instagram Graph API — schedule posts |
| TikTok posts | ✅ | TikTok API — schedule/upload content |
| Google/Facebook Ads | ✅ | Google Ads API + Meta Ads API — campaign management |
| Mailers | ✅ | Direct mail API (e.g. Lob) — trigger mailings |
| Update CRM | ✅ | CRM API integration (auto-log activity) |

### Stage 2: Inbound Lead
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Lead Form | ✅ | Webhook capture from website forms → CRM |
| Email DM | ✅ | Email parsing + auto-response templates |
| Phone Call | ⚠️ | Notify agent, log call in CRM (can't fully automate) |
| Texting | ⚠️ | SMS API (Twilio) for templates, but human review needed |
| Update CRM | ✅ | Auto-update on lead capture |

### Stage 3: Qualifying/Nurturing (all automatable ✅)
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| 5-Email nurturing campaign | ✅ | Email drip sequence (SendGrid/Mailchimp) |
| Communication via email and DMs | ✅ | Automated email + DM sequences |
| Ongoing texts | ✅ | SMS drip via Twilio |
| Market Update/Property alert emails | ✅ | MLS data feed → templated emails |
| Update CRM | ✅ | Auto-update pipeline stage |

### Stage 4: Converted to "Client" (Decision Point)
- Pipeline stage transition trigger — moves lead to client status in CRM
- Triggers all downstream Listing Stage automations

### Stage 5: Listing Stage
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Sign a Listing Agreement | ⚠️ | Send via DocuSign/e-sign API, but requires manual negotiation |
| Schedule Photography/Measurements | ⚠️ | Calendar booking, but needs coordination |
| Seller's Checklist | ✅ | Auto-send checklist email/doc |
| Home is ready to list | ✅ | Status trigger in CRM |
| Update CRM | ✅ | Auto-update |
| Schedule an Open House | ✅ | Calendar integration + notify contacts |
| Property Evaluation + Market Report | ✅ | Pull MLS comps → generate report |
| Marketing Materials | ✅ | Template-based flyer/brochure generation |
| Email explaining "the" Selling Process | ✅ | Templated email auto-send |
| List Home on the MLS | ✅ | MLS API submission |
| Promote on social media | ✅ | Cross-post to FB/IG/TikTok |
| Order Lawn Signs | ✅ | Vendor API or auto-order email |
| Sending Seller "Showing" reports | ✅ | Auto-generate from showing feedback data |
| Analyzing Offers and Presenting | ✅ | Offer comparison dashboard/report |
| Ongoing Marketing | ✅ | Recurring social + email campaigns |
| Updating CRM | ✅ | Auto-update |

### Stage 6: Pending Stage
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Send seller "congratulations" email | ✅ | Triggered email template |
| Send Contract Package to Lender/Mortgage Rep | ✅ | Auto-email with attachments |
| Update status on MLS | ⚠️ | MLS API (some MLSs don't support full automation) |
| Post "Pending" on social media | ⚠️ | Draft post for review before publishing |
| Complete brokerage checklist and submit | ⚠️ | Pre-fill form, but human review required |
| Update your CRM | ✅ | Auto-update pipeline stage |

### Stage 7: Property Sold
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Congratulations article + utilities/change note | ✅ | Templated email with local utility info |
| Order a gift basket for delivery | ⚠️ | Gift vendor API, but agent may want to personalize |
| Send final docs to lawyers | ✅ | Auto-email with document attachments |
| Submit final docs to brokerage | ✅ | Auto-submit via brokerage portal/API |
| Post on Social Media | ✅ | Auto-post "SOLD" content |
| Sold Sticker on Lawn Sign | ⚠️ | Notify vendor — physical action required |
| Order lawn sign to come down | ⚠️ | Notify vendor — physical action required |

### Stage 8: Possession Day
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Hand over the keys | ✅ | Calendar reminder + checklist (physical handoff) |
| Send one final email to the seller | ✅ | Triggered email template |
| Send Thank You email to the other agent | ✅ | Triggered email template |
| Update our CRM | ✅ | Auto-update, mark deal closed |

### Stage 9: Post-Client (all automatable ✅)
| Task | Auto? | Automation Approach |
|------|-------|-------------------|
| Send Market update | ✅ | Recurring email with MLS data |
| Happy birthday | ✅ | Date-triggered email |
| Send client list & Google Review request | ✅ | Triggered email with review link |
| Ask them for Referrals | ✅ | Scheduled email campaign |

---

## Architecture

```
Real-Estate-Automation/
├── README.md                     # Project overview
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── src/
│   ├── index.ts                  # Main entry point
│   ├── config/
│   │   └── integrations.ts       # API keys, service config
│   ├── types/
│   │   └── index.ts              # Core types (Lead, Client, Listing, etc.)
│   ├── pipeline/
│   │   ├── stages.ts             # Stage definitions & transitions
│   │   └── engine.ts             # Workflow engine — runs automations per stage
│   ├── automations/
│   │   ├── marketing.ts          # Social media scheduling, ads, mailers
│   │   ├── lead-capture.ts       # Form webhooks, email parsing, CRM entry
│   │   ├── nurturing.ts          # Email drips, SMS sequences, market alerts
│   │   ├── listing.ts            # MLS, photography, open house, materials
│   │   ├── pending.ts            # Congrats email, contract packages, status updates
│   │   ├── sold.ts               # Docs, gift basket, social posts, sign removal
│   │   ├── possession.ts         # Final emails, CRM close
│   │   └── post-client.ts        # Market updates, birthdays, referrals
│   ├── integrations/
│   │   ├── crm.ts                # CRM adapter (generic interface)
│   │   ├── email.ts              # Email service (SendGrid/SES)
│   │   ├── sms.ts                # SMS service (Twilio)
│   │   ├── social-media.ts       # Facebook, Instagram, TikTok APIs
│   │   ├── mls.ts                # MLS data feed integration
│   │   ├── calendar.ts           # Google Calendar integration
│   │   ├── documents.ts          # DocuSign / e-signature
│   │   └── direct-mail.ts        # Physical mailer service (Lob)
│   └── utils/
│       ├── templates.ts          # Email/SMS template engine
│       └── logger.ts             # Logging utility
```

---

## Core Types

```typescript
type PipelineStage =
  | 'marketing'
  | 'inbound_lead'
  | 'qualifying_nurturing'
  | 'client'
  | 'listing'
  | 'pending'
  | 'sold'
  | 'possession'
  | 'post_client';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'facebook' | 'instagram' | 'tiktok' | 'google_ads' | 'mailer' | 'referral' | 'website';
  stage: PipelineStage;
  createdAt: Date;
  convertedAt?: Date;
}

interface Client extends Lead {
  stage: 'client' | 'listing' | 'pending' | 'sold' | 'possession' | 'post_client';
  convertedAt: Date;
  listing?: Listing;
  birthday?: Date;
}

interface Listing {
  id: string;
  clientId: string;
  address: string;
  mlsId?: string;
  price: number;
  status: 'pre_list' | 'active' | 'pending' | 'sold' | 'closed';
  photos: string[];
  listDate?: Date;
  soldDate?: Date;
  possessionDate?: Date;
}

interface AutomationTask {
  id: string;
  stage: PipelineStage;
  name: string;
  automatable: boolean;       // green = true, yellow = false
  status: 'pending' | 'running' | 'completed' | 'needs_human' | 'failed';
  triggeredAt?: Date;
  completedAt?: Date;
}
```

---

## Workflow Engine

The engine listens for **stage transitions** and fires the corresponding automations:

1. **Event-driven**: When a lead/client moves to a new stage, all automatable tasks for that stage execute automatically
2. **Human tasks**: Yellow tasks create notifications/reminders for the agent to complete manually
3. **Sequential + parallel**: Some tasks run in order (e.g., list on MLS → then promote), others run in parallel (e.g., send emails + update CRM)
4. **Idempotent**: Tasks track completion to avoid duplicate execution

---

## Implementation Order

### Phase 1: Foundation
1. Project scaffolding (`Real-Estate-Automation/` structure, types, config)
2. Pipeline stage definitions and workflow engine
3. CRM integration adapter (generic interface)
4. Email service integration
5. Template engine for emails/SMS

### Phase 2: Lead Pipeline
6. Lead capture (webhook handler for forms)
7. Email nurturing sequences (5-email drip)
8. SMS integration (Twilio)
9. Market update/property alert automation

### Phase 3: Listing Automation
10. MLS integration
11. Social media cross-posting
12. Marketing materials generation
13. Open house scheduling
14. Showing report automation

### Phase 4: Transaction Management
15. Pending stage automations (congrats, contract packages)
16. Sold stage automations (docs, social posts)
17. Possession day automations (final emails, CRM close)

### Phase 5: Post-Client
18. Birthday reminders
19. Market update recurring emails
20. Google Review / referral campaigns

---

## Key Integration Points

| Service | Purpose | API |
|---------|---------|-----|
| CRM | Contact/deal management | Generic adapter (Follow Up Boss, KVCore, etc.) |
| SendGrid / SES | Email automation | SendGrid API v3 |
| Twilio | SMS automation | Twilio REST API |
| Meta Graph API | Facebook + Instagram | Graph API v18+ |
| TikTok | Video posting | TikTok Content Posting API |
| Google Ads | Ad management | Google Ads API |
| MLS | Listing data | RESO Web API / RETS |
| Google Calendar | Scheduling | Calendar API v3 |
| DocuSign | E-signatures | DocuSign eSign API |
| Lob | Direct mail | Lob API v1 |
