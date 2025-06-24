export declare const ERROR_MESSAGES: {
    readonly UNAUTHORIZED: "Authentication required. Please reconnect your HubSpot account.";
    readonly TOKEN_EXPIRED: "Your session has expired. Please reconnect your HubSpot account.";
    readonly REPORT_NOT_FOUND: "The requested report could not be found.";
    readonly INSUFFICIENT_PERMISSIONS: "You do not have permission to access this report.";
    readonly RATE_LIMITED: "Too many requests. Please try again later.";
    readonly INVALID_REQUEST: "Invalid request. Please check your parameters.";
    readonly INTERNAL_ERROR: "An internal error occurred. Please try again later.";
    readonly NETWORK_ERROR: "Network error. Please check your connection and try again.";
    readonly TIMEOUT_ERROR: "Request timed out. Please try again.";
};
export declare const HTTP_STATUS: {
    readonly OK: 200;
    readonly CREATED: 201;
    readonly BAD_REQUEST: 400;
    readonly UNAUTHORIZED: 401;
    readonly FORBIDDEN: 403;
    readonly NOT_FOUND: 404;
    readonly METHOD_NOT_ALLOWED: 405;
    readonly CONFLICT: 409;
    readonly TOO_MANY_REQUESTS: 429;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly BAD_GATEWAY: 502;
    readonly SERVICE_UNAVAILABLE: 503;
    readonly GATEWAY_TIMEOUT: 504;
};
//# sourceMappingURL=errors.d.ts.map