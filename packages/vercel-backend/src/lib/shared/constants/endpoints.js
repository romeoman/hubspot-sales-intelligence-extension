"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPLIT_CONFIG = exports.API_ROUTES = exports.HUBSPOT_ENDPOINTS = void 0;
exports.HUBSPOT_ENDPOINTS = {
    OAUTH_AUTHORIZE: 'https://app.hubspot.com/oauth/authorize',
    OAUTH_TOKEN: 'https://api.hubapi.com/oauth/v1/token',
    CRM_CONTACTS: 'https://api.hubapi.com/crm/v3/objects/contacts',
    CRM_COMPANIES: 'https://api.hubapi.com/crm/v3/objects/companies',
};
exports.API_ROUTES = {
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
};
exports.REPLIT_CONFIG = {
    DEFAULT_TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};
//# sourceMappingURL=endpoints.js.map