export interface HubSpotContext {
    portalId: number;
    userId: number;
    userEmail: string;
    hs_object_id: string;
    hs_object_type: 'contact' | 'company';
}
export interface HubSpotContact {
    id: string;
    properties: {
        email?: string;
        firstname?: string;
        lastname?: string;
        company?: string;
        [key: string]: any;
    };
}
export interface HubSpotCompany {
    id: string;
    properties: {
        name?: string;
        domain?: string;
        industry?: string;
        [key: string]: any;
    };
}
export interface OAuthToken {
    hubspotAccountId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    scopes: string[];
    createdAt: Date;
    updatedAt: Date;
}
export interface HubSpotOAuthConfig {
    clientId: string;
    clientSecret: string;
    redirectUri: string;
    scopes: string[];
}
export interface TokenRefreshResponse {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
}
//# sourceMappingURL=hubspot.d.ts.map