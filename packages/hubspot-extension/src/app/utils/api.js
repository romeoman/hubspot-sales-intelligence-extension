import { API_ENDPOINTS, ERROR_MESSAGES, UI_CONFIG } from './constants.js';

/**
 * Makes authenticated API calls using HubSpot's hubspot.fetch()
 */
export class ApiClient {
  constructor(hubspotFetch) {
    this.fetch = hubspotFetch;
  }

  /**
   * Generic API request handler with error handling and retries
   */
  async makeRequest(url, options = {}, retryCount = 0) {
    try {
      const response = await this.fetch(url, {
        method: 'GET',
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error('API request failed:', error);

      // Retry logic for transient errors
      if (
        retryCount < UI_CONFIG.RETRY_ATTEMPTS &&
        this.isRetryableError(error)
      ) {
        console.log(
          `Retrying request (attempt ${retryCount + 1}/${UI_CONFIG.RETRY_ATTEMPTS})`
        );
        await this.delay(UI_CONFIG.RETRY_DELAY * (retryCount + 1));
        return this.makeRequest(url, options, retryCount + 1);
      }

      throw this.normalizeError(error);
    }
  }

  /**
   * Check if error is retryable (network issues, timeouts, 5xx errors)
   */
  isRetryableError(error) {
    const errorMessage = error.message.toLowerCase();
    return (
      errorMessage.includes('network') ||
      errorMessage.includes('timeout') ||
      errorMessage.includes('500') ||
      errorMessage.includes('502') ||
      errorMessage.includes('503') ||
      errorMessage.includes('504')
    );
  }

  /**
   * Normalize different error types to user-friendly messages
   */
  normalizeError(error) {
    const errorMessage = error.message;

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return new Error(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
    }

    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      return new Error(ERROR_MESSAGES.NO_REPORTS);
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }

    return new Error(ERROR_MESSAGES.LOADING_FAILED);
  }

  /**
   * Simple delay utility for retries
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available reports for a contact or company
   */
  async getAvailableReports(context) {
    const { hs_object_id, hs_object_type } = context;
    const portalId = context.portalId || context.portal?.id;

    if (!portalId) {
      throw new Error('Portal ID is required');
    }

    const params = new URLSearchParams({
      portalId: portalId.toString(),
    });

    if (hs_object_type === 'contact') {
      params.append('contactId', hs_object_id);
    } else if (hs_object_type === 'company') {
      params.append('companyId', hs_object_id);
    } else {
      throw new Error('Unsupported object type');
    }

    const url = `${API_ENDPOINTS.REPORTS_AVAILABLE}?${params.toString()}`;
    const response = await this.makeRequest(url);

    return response.reports || [];
  }

  /**
   * Generate a signed URL for a specific report using slug
   */
  async generateReportUrl(reportSlug, context) {
    const { hs_object_id, hs_object_type } = context;
    const portalId = context.portalId || context.portal?.id;

    if (!portalId) {
      throw new Error('Portal ID is required');
    }

    if (!reportSlug) {
      throw new Error('Report slug is required');
    }

    const requestBody = {
      slug: reportSlug,
      portalId: portalId.toString(),
    };

    if (hs_object_type === 'contact') {
      requestBody.contactId = hs_object_id;
    } else if (hs_object_type === 'company') {
      requestBody.companyId = hs_object_id;
    }

    const response = await this.makeRequest(
      API_ENDPOINTS.REPORTS_GENERATE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    return response;
  }

  /**
   * Check authentication status
   */
  async checkAuthStatus(portalId) {
    const params = new URLSearchParams({
      portalId: portalId.toString(),
    });

    const url = `${API_ENDPOINTS.AUTH_STATUS}?${params.toString()}`;

    try {
      const response = await this.makeRequest(url);
      return response.isValid || false;
    } catch (error) {
      console.warn('Auth status check failed:', error);
      return false;
    }
  }
}
