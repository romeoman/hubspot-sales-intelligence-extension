export const HUBSPOT_ENDPOINTS = {
  OAUTH_AUTHORIZE: 'https://app.hubspot.com/oauth/authorize',
  OAUTH_TOKEN: 'https://api.hubapi.com/oauth/v1/token',
  CRM_CONTACTS: 'https://api.hubapi.com/crm/v3/objects/contacts',
  CRM_COMPANIES: 'https://api.hubapi.com/crm/v3/objects/companies',
} as const;

export const API_ROUTES = {
  AUTH: {
    INSTALL: '/api/auth/install',
    CALLBACK: '/api/auth/callback',
    REFRESH: '/api/auth/refresh',
    STATUS: '/api/auth/status',
  },
  REPORTS: {
    AVAILABLE: '/api/reports/available',
    GENERATE_URL: '/api/reports/generate-url',
    VALIDATE: '/api/reports/validate',
  },
  HEALTH: '/api/health',
} as const;

export const REPLIT_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;
