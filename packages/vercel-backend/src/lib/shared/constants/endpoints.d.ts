export declare const HUBSPOT_ENDPOINTS: {
    readonly OAUTH_AUTHORIZE: "https://app.hubspot.com/oauth/authorize";
    readonly OAUTH_TOKEN: "https://api.hubapi.com/oauth/v1/token";
    readonly CRM_CONTACTS: "https://api.hubapi.com/crm/v3/objects/contacts";
    readonly CRM_COMPANIES: "https://api.hubapi.com/crm/v3/objects/companies";
};
export declare const API_ROUTES: {
    readonly AUTH: {
        readonly INSTALL: "/api/auth/install";
        readonly CALLBACK: "/api/auth/callback";
        readonly REFRESH: "/api/auth/refresh";
        readonly STATUS: "/api/auth/status";
    };
    readonly REPORTS: {
        readonly AVAILABLE: "/api/reports/available";
        readonly GENERATE_URL: "/api/reports/generate-url";
        readonly VALIDATE: "/api/reports/validate";
    };
    readonly HEALTH: "/api/health";
};
export declare const REPLIT_CONFIG: {
    readonly DEFAULT_TIMEOUT: 30000;
    readonly RETRY_ATTEMPTS: 3;
    readonly RETRY_DELAY: 1000;
};
//# sourceMappingURL=endpoints.d.ts.map