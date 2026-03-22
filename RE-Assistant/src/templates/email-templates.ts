import { Template, PipelineStage } from "../models/types";

// ============================================================
// Email & SMS Templates
// Templates with {{variable}} placeholders for personalization.
// ============================================================

export const EMAIL_TEMPLATES: Omit<Template, "id" | "createdAt" | "updatedAt">[] = [
  // ── Inbound Lead ──
  {
    name: "Lead Acknowledgment",
    stage: PipelineStage.INBOUND_LEAD,
    channel: "email",
    subject: "Thanks for reaching out, {{firstName}}!",
    body: `Hi {{firstName}},

Thank you for your interest! I received your inquiry and would love to help you with your real estate needs.

I'll be in touch shortly to learn more about what you're looking for. In the meantime, feel free to reply to this email with any questions.

Best regards,
{{agentName}}
{{agentPhone}}`,
    variables: ["firstName", "agentName", "agentPhone"],
  },

  // ── Nurturing Drip Campaign (1 of 5) ──
  {
    name: "Nurture Drip Email 1",
    stage: PipelineStage.QUALIFYING_NURTURING,
    channel: "email",
    subject: "Your local real estate market update",
    body: `Hi {{firstName}},

I wanted to share some insights about the {{city}} real estate market.

{{marketSummary}}

If you're thinking about buying or selling, now is a great time to start planning. I'd love to chat about your goals.

Best,
{{agentName}}`,
    variables: ["firstName", "city", "marketSummary", "agentName"],
  },

  // ── Market Update ──
  {
    name: "Market Update",
    stage: PipelineStage.QUALIFYING_NURTURING,
    channel: "email",
    subject: "{{city}} Market Update — {{month}} {{year}}",
    body: `Hi {{firstName}},

Here's your monthly market update for {{city}}:

{{marketReport}}

Interested in a more detailed analysis for your neighborhood? Just reply and I'll put one together for you.

Best,
{{agentName}}`,
    variables: ["firstName", "city", "month", "year", "marketReport", "agentName"],
  },

  // ── Seller Checklist ──
  {
    name: "Seller Checklist",
    stage: PipelineStage.LISTING,
    channel: "email",
    subject: "Your Seller's Preparation Checklist",
    body: `Hi {{firstName}},

Congratulations on deciding to list your home at {{propertyAddress}}! Here's your preparation checklist to get the best possible results:

{{sellerChecklist}}

Once you've completed these items, let me know and we'll get your home on the market!

Best,
{{agentName}}`,
    variables: ["firstName", "propertyAddress", "sellerChecklist", "agentName"],
  },

  // ── Selling Process Explanation ──
  {
    name: "Selling Process",
    stage: PipelineStage.LISTING,
    channel: "email",
    subject: "What to Expect: The Home Selling Process",
    body: `Hi {{firstName}},

Now that we've signed the listing agreement, I want to walk you through what to expect:

1. **Preparation** — We'll get your home photo-ready and complete the seller's checklist
2. **Photography & Measurements** — Professional photos and measurements scheduled
3. **Listing Goes Live** — Your home will be listed on the MLS and promoted across channels
4. **Showings & Open Houses** — I'll coordinate all showings and send you weekly reports
5. **Offers & Negotiation** — I'll present all offers with a detailed comparison
6. **Closing** — Once an offer is accepted, we manage the entire closing process

I'm here every step of the way. Don't hesitate to reach out with questions!

Best,
{{agentName}}
{{agentPhone}}`,
    variables: ["firstName", "agentName", "agentPhone"],
  },

  // ── Showing Report ──
  {
    name: "Weekly Showing Report",
    stage: PipelineStage.LISTING,
    channel: "email",
    subject: "Showing Report — {{propertyAddress}} (Week of {{weekDate}})",
    body: `Hi {{firstName}},

Here's your weekly showing report for {{propertyAddress}}:

**Total Showings This Week:** {{showingCount}}
**Total Showings to Date:** {{totalShowings}}

**Feedback Summary:**
{{showingFeedback}}

{{agentCommentary}}

Best,
{{agentName}}`,
    variables: [
      "firstName", "propertyAddress", "weekDate", "showingCount",
      "totalShowings", "showingFeedback", "agentCommentary", "agentName",
    ],
  },

  // ── Congratulations (Pending) ──
  {
    name: "Congratulations Pending",
    stage: PipelineStage.PENDING,
    channel: "email",
    subject: "Congratulations! We have an accepted offer! 🎉",
    body: `Hi {{firstName}},

Great news — the offer on {{propertyAddress}} has been accepted!

**Offer Price:** {{offerPrice}}
**Closing Date:** {{closingDate}}
**Possession Date:** {{possessionDate}}

Here's what happens next:
- Contract package sent to lender/mortgage representative
- MLS status updated to Pending
- Brokerage paperwork completed
- We'll guide you through to closing day

Congratulations!

Best,
{{agentName}}`,
    variables: [
      "firstName", "propertyAddress", "offerPrice",
      "closingDate", "possessionDate", "agentName",
    ],
  },

  // ── Contract to Lender ──
  {
    name: "Contract to Lender",
    stage: PipelineStage.PENDING,
    channel: "email",
    subject: "Contract Package — {{propertyAddress}}",
    body: `Hi {{lenderName}},

Please find attached the accepted contract package for:

**Property:** {{propertyAddress}}
**Seller:** {{sellerName}}
**Buyer:** {{buyerName}}
**Accepted Price:** {{offerPrice}}
**Closing Date:** {{closingDate}}

Please don't hesitate to reach out if you need anything.

Best,
{{agentName}}
{{agentPhone}}`,
    variables: [
      "lenderName", "propertyAddress", "sellerName", "buyerName",
      "offerPrice", "closingDate", "agentName", "agentPhone",
    ],
  },

  // ── Congratulations Sold ──
  {
    name: "Congratulations Sold",
    stage: PipelineStage.PROPERTY_SOLD,
    channel: "email",
    subject: "Your home is officially SOLD!",
    body: `Hi {{firstName}},

Congratulations — {{propertyAddress}} is officially SOLD!

As you prepare for your move, here are some helpful reminders:

**Utilities to Transfer/Cancel:**
{{utilitiesList}}

**Change of Address:**
- Update your address with Canada Post / USPS
- Notify your bank, insurance, and subscriptions

**Possession Day:** {{possessionDate}}

I'll be in touch as we approach possession day. Congratulations again!

Best,
{{agentName}}`,
    variables: [
      "firstName", "propertyAddress", "utilitiesList",
      "possessionDate", "agentName",
    ],
  },

  // ── Docs to Lawyer ──
  {
    name: "Documents to Lawyer",
    stage: PipelineStage.PROPERTY_SOLD,
    channel: "email",
    subject: "Closing Documents — {{propertyAddress}}",
    body: `Hi {{lawyerName}},

Please find attached the closing documents for:

**Property:** {{propertyAddress}}
**Closing Date:** {{closingDate}}
**Possession Date:** {{possessionDate}}

Please let me know if you need any additional documentation.

Best,
{{agentName}}
{{agentPhone}}`,
    variables: [
      "lawyerName", "propertyAddress", "closingDate",
      "possessionDate", "agentName", "agentPhone",
    ],
  },

  // ── Final Email to Seller ──
  {
    name: "Final Seller Email",
    stage: PipelineStage.POSSESSION_DAY,
    channel: "email",
    subject: "Welcome to your new chapter, {{firstName}}!",
    body: `Hi {{firstName}},

Today marks the start of a new chapter — congratulations on your successful sale of {{propertyAddress}}!

It's been a pleasure working with you through this process. If you ever need real estate advice in the future, or know someone who does, I'm always here to help.

Wishing you all the best!

Warmly,
{{agentName}}`,
    variables: ["firstName", "propertyAddress", "agentName"],
  },

  // ── Thank You to Other Agent ──
  {
    name: "Thank You Agent",
    stage: PipelineStage.POSSESSION_DAY,
    channel: "email",
    subject: "Thank you for a smooth transaction!",
    body: `Hi {{cooperatingAgentName}},

I wanted to thank you for your professionalism throughout the transaction at {{propertyAddress}}. It was a pleasure working with you!

I look forward to working together again in the future.

Best regards,
{{agentName}}
{{agentPhone}}`,
    variables: [
      "cooperatingAgentName", "propertyAddress", "agentName", "agentPhone",
    ],
  },

  // ── Happy Birthday ──
  {
    name: "Happy Birthday",
    stage: PipelineStage.POST_CLIENT,
    channel: "email",
    subject: "Happy Birthday, {{firstName}}! 🎂",
    body: `Hi {{firstName}},

Wishing you a wonderful birthday! I hope your year ahead is filled with happiness and great things.

Warmly,
{{agentName}}`,
    variables: ["firstName", "agentName"],
  },

  // ── Google Review Request ──
  {
    name: "Google Review Request",
    stage: PipelineStage.POST_CLIENT,
    channel: "email",
    subject: "Would you leave a quick review?",
    body: `Hi {{firstName}},

I hope you're settled in and enjoying things! Working with you was truly a pleasure.

If you have a moment, I'd be so grateful if you could leave a quick review of your experience:

{{googleReviewLink}}

Your feedback helps others find trustworthy real estate help, and it means a lot to me.

Thank you!
{{agentName}}`,
    variables: ["firstName", "googleReviewLink", "agentName"],
  },

  // ── Referral Request ──
  {
    name: "Referral Request",
    stage: PipelineStage.POST_CLIENT,
    channel: "email",
    subject: "Know anyone looking to buy or sell?",
    body: `Hi {{firstName}},

I hope all is well! I wanted to reach out because referrals from past clients like you are the best compliment I can receive.

If you know anyone who's thinking about buying or selling a home, I'd love the opportunity to help them. Feel free to pass along my contact info or just reply with their name and I'll reach out.

Thank you for your continued trust!

Best,
{{agentName}}
{{agentPhone}}`,
    variables: ["firstName", "agentName", "agentPhone"],
  },
];

// ── SMS Templates ──

export const SMS_TEMPLATES: Omit<Template, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "Lead Text Response",
    stage: PipelineStage.INBOUND_LEAD,
    channel: "sms",
    body: "Hi {{firstName}}! Thanks for reaching out. I'd love to help with your real estate needs. When's a good time to chat? — {{agentName}}",
    variables: ["firstName", "agentName"],
  },
  {
    name: "Nurture Text",
    stage: PipelineStage.QUALIFYING_NURTURING,
    channel: "sms",
    body: "Hi {{firstName}}, just checking in! Have you had any thoughts about the market? I'm here if you have questions. — {{agentName}}",
    variables: ["firstName", "agentName"],
  },
];
