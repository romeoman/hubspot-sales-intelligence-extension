export enum ErrorCode {
  UNAUTHORIZED = 'unauthorized',
  TOKEN_EXPIRED = 'token_expired',
  REPORT_NOT_FOUND = 'report_not_found',
  INSUFFICIENT_PERMISSIONS = 'insufficient_permissions',
  RATE_LIMITED = 'rate_limited',
  INVALID_REQUEST = 'invalid_request',
  INTERNAL_ERROR = 'internal_error',
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: string;
  requestId: string;
}

export interface AuthRequest {
  portalId: string;
  code?: string;
  state?: string;
}

export interface AuthResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export interface TokenStatusResponse {
  isValid: boolean;
  expiresAt?: string;
  scopes?: string[];
  portalId?: string;
  isExpiringSoon?: boolean;
}
