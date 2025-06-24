import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { tokenManager } from '@/lib/auth/token-manager';
import { salesIntelClient } from '@/lib/api/sales-intel-client';
import { hubspotClient } from '@/lib/api/hubspot-client';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { config } from '@/config/environment';
import { ApiResponse, ErrorCode } from '@/lib/shared';
import { GenerateReportUrlResponse } from '@/lib/shared';
import { validateReportRequest } from '@/lib/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<GenerateReportUrlResponse>>
) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);

  if (req.method !== 'POST') {
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
    const { slug, contactId, companyId, portalId } = req.body;

    // Validate request parameters
    if (!slug) {
      logger.warn('Missing required parameter: slug');
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: 'Report slug is required',
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    logger.info('Generating report URL', {
      slug,
      contactId,
      companyId,
      portalId,
    });

    // Verify authentication token if portalId is provided
    if (portalId) {
      const token = await tokenManager.getToken(portalId);
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
    }

    // Verify that the report exists in sales-intel-backend
    try {
      const reportData = await salesIntelClient.getReport(slug);
      
      // Generate the URL for the existing report
      const reportUrl = salesIntelClient.generateReportUrl(slug);

      // Create JWT token for additional security (optional)
      const jwtPayload = {
        slug,
        reportId: reportData.id,
        contactId,
        companyId,
        portalId,
        requestId,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours expiration
      };

      const signedToken = jwt.sign(jwtPayload, config.security.jwtSecret);

      // Append our security token to the URL
      const url = new URL(reportUrl);
      url.searchParams.append('token', signedToken);

      const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 1000).toISOString(); // 24 hours

      logger.info('Report URL generated successfully', {
        slug,
        reportId: reportData.id,
        portalId,
        expiresAt,
      });

      res.status(200).json({
        success: true,
        data: {
          url: url.toString(),
          expiresAt,
          reportId: reportData.id,
          slug: reportData.slug,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
      
    } catch (reportError) {
      if ((reportError as Error).message.includes('Report not found')) {
        logger.warn('Report not found', { slug, portalId });
        return res.status(404).json({
          success: false,
          error: {
            code: ErrorCode.REPORT_NOT_FOUND,
            message: 'The requested report could not be found.',
          },
          timestamp: new Date().toISOString(),
          requestId,
        });
      }
      throw reportError; // Re-throw other errors to be handled by outer catch
    }
  } catch (error) {
    logger.error('Failed to generate report URL', error as Error, {
      reportId: req.body?.reportId,
      contactId: req.body?.contactId,
      companyId: req.body?.companyId,
      portalId: req.body?.portalId,
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
    } else if (errorMessage.includes('permission')) {
      errorCode = ErrorCode.INSUFFICIENT_PERMISSIONS;
      statusCode = 403;
    }

    res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message: 'Failed to generate report URL. Please try again.',
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
