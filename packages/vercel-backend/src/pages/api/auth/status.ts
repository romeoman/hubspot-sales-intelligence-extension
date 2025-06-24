import { NextApiRequest, NextApiResponse } from 'next';
import { tokenManager } from '@/lib/auth/token-manager';
import { hubspotClient } from '@/lib/api/hubspot-client';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { ApiResponse, ErrorCode } from '@/lib/shared';
import { TokenStatusResponse } from '@/lib/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<TokenStatusResponse>>
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
    const { portalId } = req.query;

    if (!portalId || typeof portalId !== 'string') {
      logger.warn('Missing or invalid portalId parameter');
      return res.status(400).json({
        success: false,
        error: {
          code: ErrorCode.INVALID_REQUEST,
          message: 'Portal ID is required',
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    logger.debug('Checking token status', { portalId });

    // Get token from storage
    const token = await tokenManager.getToken(portalId);

    if (!token) {
      logger.debug('No token found', { portalId });
      return res.status(200).json({
        success: true,
        data: {
          isValid: false,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Check if token is expired
    const isExpired = new Date(token.expiresAt) <= new Date();
    if (isExpired) {
      logger.debug('Token is expired', {
        portalId,
        expiresAt: token.expiresAt,
      });

      // Clean up expired token
      await tokenManager.deleteToken(portalId);

      return res.status(200).json({
        success: true,
        data: {
          isValid: false,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Validate token with HubSpot API
    const isValidWithHubSpot = await hubspotClient.validateToken(
      token.accessToken
    );

    if (!isValidWithHubSpot) {
      logger.warn('Token failed HubSpot validation', { portalId });

      // Clean up invalid token
      await tokenManager.deleteToken(portalId);

      return res.status(200).json({
        success: true,
        data: {
          isValid: false,
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Check if token is expiring soon
    const isExpiringSoon = await tokenManager.isTokenExpiringSoon(portalId);

    logger.debug('Token status checked', {
      portalId,
      isValid: true,
      isExpiringSoon,
      expiresAt: token.expiresAt,
    });

    res.status(200).json({
      success: true,
      data: {
        isValid: true,
        expiresAt: token.expiresAt.toISOString(),
        scopes: token.scopes,
        portalId: token.hubspotAccountId,
        isExpiringSoon,
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  } catch (error) {
    logger.error('Token status check failed', error as Error, {
      portalId: req.query.portalId,
    });

    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Failed to check authentication status',
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
