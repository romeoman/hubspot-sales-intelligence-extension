import { NextApiRequest, NextApiResponse } from 'next';
import { tokenManager } from '@/lib/auth/token-manager';
import { salesIntelClient } from '@/lib/api/sales-intel-client';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { ApiResponse, ErrorCode } from '@/lib/shared';
import { ReportAvailabilityResponse } from '@/lib/shared';
import { validateReportRequest } from '@/lib/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<ReportAvailabilityResponse>>
) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: {
        code: ErrorCode.INVALID_REQUEST,
        message: 'Method not allowed',
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }

  try {
    const { contactId, companyId, portalId } = req.query;

    // Validate request parameters
    const validation = validateReportRequest({
      contactId: contactId as string,
      companyId: companyId as string,
      portalId: portalId as string,
    });

    if (!validation.isValid) {
      logger.warn('Invalid request parameters', {
        errors: validation.errors,
        contactId,
        companyId,
        portalId,
      });

      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: validation.errors.join(', '),
          details: validation.errors,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    logger.info('Checking report availability', {
      contactId,
      companyId,
      portalId,
    });

    // Verify authentication token
    const token = await tokenManager.getToken(portalId as string);
    if (!token) {
      logger.warn('No valid token found', { portalId });
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message:
            'Authentication required. Please reconnect your HubSpot account.',
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Check if token is expiring soon and refresh if needed
    const isExpiringSoon = await tokenManager.isTokenExpiringSoon(
      portalId as string
    );

    if (isExpiringSoon) {
      logger.info('Token expiring soon, triggering refresh', { portalId });
      // Note: In a real implementation, you might want to trigger a refresh here
      // For now, we'll continue with the current token
    }

    // Get available reports from Sales Intel backend
    const rawReports = await salesIntelClient.checkReportAvailability({
      contactId: contactId as string,
      companyId: companyId as string,
      portalId: portalId as string,
    });

    // Transform to match expected interface
    const reports = rawReports.map(report => ({
      id: report.reportId || report.slug || 'unknown',
      name: report.reportType,
      description: report.description,
      hasData: report.hasData,
      lastUpdated: undefined, // Not available from current API
    }));

    logger.info('Report availability checked successfully', {
      portalId,
      totalReports: reports.length,
      availableReports: reports.filter(r => r.hasData).length,
    });

    res.status(200).json({
      success: true,
      data: {
        reports,
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  } catch (error) {
    logger.error('Failed to check report availability', error as Error, {
      contactId: req.query.contactId,
      companyId: req.query.companyId,
      portalId: req.query.portalId,
    });

    // Determine appropriate error code based on error type
    let errorCode = ErrorCode.INTERNAL_ERROR;
    let statusCode = 500;

    const errorMessage = (error as Error).message;
    if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('token')
    ) {
      errorCode = ErrorCode.UNAUTHORIZED;
      statusCode = 401;
    } else if (errorMessage.includes('not found')) {
      errorCode = ErrorCode.REPORT_NOT_FOUND;
      statusCode = 404;
    } else if (errorMessage.includes('rate limit')) {
      errorCode = ErrorCode.RATE_LIMITED;
      statusCode = 429;
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: 'Failed to check report availability. Please try again.',
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
