// OAuth Bridge Configuration
export const OAUTH_BRIDGE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://your-oauth-bridge.vercel.app'
    : 'http://localhost:3000';

// API Endpoints
export const API_ENDPOINTS = {
  REPORTS_AVAILABLE: `${OAUTH_BRIDGE_URL}/api/reports/available`,
  REPORTS_GENERATE_URL: `${OAUTH_BRIDGE_URL}/api/reports/generate-url`,
  AUTH_STATUS: `${OAUTH_BRIDGE_URL}/api/auth/status`,
  AUTH_INSTALL: `${OAUTH_BRIDGE_URL}/api/auth/install`,
};

// Error Messages
export const ERROR_MESSAGES = {
  NO_REPORTS: 'No reports are available for this record.',
  LOADING_FAILED: 'Failed to load reports. Please try again.',
  AUTHENTICATION_REQUIRED: 'Please connect your account to view reports.',
  REPORT_LOAD_FAILED: 'Failed to load the selected report.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
};

// UI Configuration
export const UI_CONFIG = {
  MODAL_WIDTH: 1200,
  MODAL_HEIGHT: 800,
  DEBOUNCE_DELAY: 300,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

// Report Types (this would typically come from your backend configuration)
export const REPORT_TYPES = {
  CONTACT_ANALYTICS: 'contact-analytics',
  COMPANY_METRICS: 'company-metrics',
  ENGAGEMENT_SUMMARY: 'engagement-summary',
  PERFORMANCE_DASHBOARD: 'performance-dashboard',
};
