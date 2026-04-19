// ============================================================
// Integration Configuration
// Environment-based configuration for all external services.
// Copy to .env and fill in real values.
// ============================================================

export interface IntegrationConfig {
  // CRM (Follow Up Boss / KVCore / HubSpot)
  crm: {
    provider: "followupboss" | "kvcore" | "hubspot";
    apiKey: string;
    baseUrl: string;
  };

  // Email (SendGrid / Mailgun)
  email: {
    provider: "sendgrid" | "mailgun";
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };

  // SMS (Twilio)
  sms: {
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };

  // Social Media
  social: {
    facebook: { pageId: string; accessToken: string };
    instagram: { accountId: string; accessToken: string };
    tiktok: { openId: string; accessToken: string };
    buffer?: { accessToken: string }; // optional aggregator
  };

  // MLS (RETS / RESO)
  mls: {
    provider: "rets" | "reso";
    loginUrl: string;
    username: string;
    password: string;
  };

  // DocuSign
  docusign: {
    integrationKey: string;
    secretKey: string;
    accountId: string;
    basePath: string;
  };

  // Google Calendar
  calendar: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
  };

  // Google Ads
  googleAds: {
    developerToken: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    customerId: string;
  };

  // Meta Ads
  metaAds: {
    accessToken: string;
    adAccountId: string;
  };

  // Redis (for BullMQ job queue)
  redis: {
    host: string;
    port: number;
    password?: string;
  };

  // Database
  database: {
    url: string;
  };
}

/**
 * Load configuration from environment variables.
 */
export function loadConfig(): IntegrationConfig {
  return {
    crm: {
      provider: (process.env.CRM_PROVIDER as any) || "followupboss",
      apiKey: process.env.CRM_API_KEY || "",
      baseUrl: process.env.CRM_BASE_URL || "",
    },
    email: {
      provider: (process.env.EMAIL_PROVIDER as any) || "sendgrid",
      apiKey: process.env.EMAIL_API_KEY || "",
      fromEmail: process.env.EMAIL_FROM || "",
      fromName: process.env.EMAIL_FROM_NAME || "",
    },
    sms: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      fromNumber: process.env.TWILIO_FROM_NUMBER || "",
    },
    social: {
      facebook: {
        pageId: process.env.FB_PAGE_ID || "",
        accessToken: process.env.FB_ACCESS_TOKEN || "",
      },
      instagram: {
        accountId: process.env.IG_ACCOUNT_ID || "",
        accessToken: process.env.IG_ACCESS_TOKEN || "",
      },
      tiktok: {
        openId: process.env.TIKTOK_OPEN_ID || "",
        accessToken: process.env.TIKTOK_ACCESS_TOKEN || "",
      },
    },
    mls: {
      provider: (process.env.MLS_PROVIDER as any) || "reso",
      loginUrl: process.env.MLS_LOGIN_URL || "",
      username: process.env.MLS_USERNAME || "",
      password: process.env.MLS_PASSWORD || "",
    },
    docusign: {
      integrationKey: process.env.DOCUSIGN_INTEGRATION_KEY || "",
      secretKey: process.env.DOCUSIGN_SECRET_KEY || "",
      accountId: process.env.DOCUSIGN_ACCOUNT_ID || "",
      basePath: process.env.DOCUSIGN_BASE_PATH || "",
    },
    calendar: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN || "",
    },
    googleAds: {
      developerToken: process.env.GOOGLE_ADS_DEV_TOKEN || "",
      clientId: process.env.GOOGLE_ADS_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || "",
      refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN || "",
      customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || "",
    },
    metaAds: {
      accessToken: process.env.META_ADS_ACCESS_TOKEN || "",
      adAccountId: process.env.META_ADS_ACCOUNT_ID || "",
    },
    redis: {
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      password: process.env.REDIS_PASSWORD,
    },
    database: {
      url: process.env.DATABASE_URL || "",
    },
  };
}
