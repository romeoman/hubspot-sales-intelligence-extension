"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTP_STATUS = exports.ERROR_MESSAGES = void 0;
exports.ERROR_MESSAGES = {
    UNAUTHORIZED: 'Authentication required. Please reconnect your HubSpot account.',
    TOKEN_EXPIRED: 'Your session has expired. Please reconnect your HubSpot account.',
    REPORT_NOT_FOUND: 'The requested report could not be found.',
    INSUFFICIENT_PERMISSIONS: 'You do not have permission to access this report.',
    RATE_LIMITED: 'Too many requests. Please try again later.',
    INVALID_REQUEST: 'Invalid request. Please check your parameters.',
    INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
    NETWORK_ERROR: 'Network error. Please check your connection and try again.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
};
exports.HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
};
//# sourceMappingURL=errors.js.map