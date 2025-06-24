import { useState, useEffect, useCallback } from 'react';
import { ApiClient } from '../utils/api.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Custom hook for managing report data and operations
 */
export function useReports(context, hubspotFetch) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const apiClient = new ApiClient(hubspotFetch);

  /**
   * Check authentication status
   */
  const checkAuthentication = useCallback(async () => {
    try {
      const portalId = context.portalId || context.portal?.id;
      if (!portalId) return false;

      const isAuth = await apiClient.checkAuthStatus(portalId);
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      console.warn('Authentication check failed:', error);
      setIsAuthenticated(false);
      return false;
    }
  }, [context, apiClient]);

  /**
   * Load available reports
   */
  const loadReports = useCallback(async () => {
    if (!context?.hs_object_id) {
      setError('Invalid context: missing object ID');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First check authentication
      const isAuth = await checkAuthentication();
      if (!isAuth) {
        setError(ERROR_MESSAGES.AUTHENTICATION_REQUIRED);
        setReports([]);
        return;
      }

      // Load available reports
      const availableReports = await apiClient.getAvailableReports(context);

      // Filter to only show reports with data
      const reportsWithData = availableReports.filter(report => report.hasData);

      setReports(reportsWithData);

      if (reportsWithData.length === 0) {
        setError(ERROR_MESSAGES.NO_REPORTS);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
      setError(error.message || ERROR_MESSAGES.LOADING_FAILED);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [context, apiClient, checkAuthentication]);

  /**
   * Generate URL for a specific report using slug
   */
  const generateReportUrl = useCallback(
    async reportSlug => {
      if (!reportSlug) {
        throw new Error('Report slug is required');
      }

      try {
        const urlData = await apiClient.generateReportUrl(reportSlug, context);
        return urlData.url;
      } catch (error) {
        console.error('Failed to generate report URL:', error);
        throw new Error(error.message || ERROR_MESSAGES.REPORT_LOAD_FAILED);
      }
    },
    [context, apiClient]
  );

  /**
   * Retry loading reports
   */
  const retryLoad = useCallback(() => {
    loadReports();
  }, [loadReports]);

  // Load reports when context changes
  useEffect(() => {
    if (context?.hs_object_id) {
      loadReports();
    }
  }, [context?.hs_object_id, context?.hs_object_type, loadReports]);

  return {
    reports,
    loading,
    error,
    isAuthenticated,
    loadReports,
    generateReportUrl,
    retryLoad,
    checkAuthentication,
  };
}
