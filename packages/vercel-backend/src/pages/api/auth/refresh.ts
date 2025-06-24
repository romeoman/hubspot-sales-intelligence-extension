import { NextApiRequest, NextApiResponse } from 'next';
import { hubspotClient } from '@/lib/api/hubspot-client';
import { tokenManager } from '@/lib/auth/token-manager';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { validateEnvironment } from '@/config/environment';
import { ApiResponse, ErrorCode } from '@/lib/shared';
import { OAuthToken } from '@/lib/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
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
    // Validate environment variables
    validateEnvironment();

    const { portalId } = req.body;

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

    logger.info('Token refresh requested', { portalId });

    // Get existing token
    const existingToken = await tokenManager.getToken(portalId);

    if (!existingToken) {
      logger.warn('Token not found for refresh', { portalId });
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.UNAUTHORIZED,
          message:
            'No authentication token found. Please reconnect your account.',
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    // Refresh the token
    const refreshResponse = await hubspotClient.refreshToken(
      existingToken.refreshToken
    );

    // Update token in storage
    const updatedToken: OAuthToken = {
      ...existingToken,
      accessToken: refreshResponse.access_token,
      refreshToken: refreshResponse.refresh_token,
      expiresAt: new Date(Date.now() + refreshResponse.expires_in * 1000),
      updatedAt: new Date(),
    };

    await tokenManager.storeToken(updatedToken);

    logger.info('Token refreshed successfully', {
      portalId,
      expiresAt: updatedToken.expiresAt,
    });

    res.status(200).json({
      success: true,
      data: {
        expiresAt: updatedToken.expiresAt,
        scopes: updatedToken.scopes,
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  } catch (error) {
    logger.error('Token refresh failed', error as Error, {
      portalId: req.body?.portalId,
    });

    // Check if this is an OAuth error (invalid refresh token)
    const errorMessage = (error as Error).message;
    if (
      errorMessage.includes('invalid_grant') ||
      errorMessage.includes('refresh')
    ) {
      return res.status(401).json({
        success: false,
        error: {
          code: ErrorCode.TOKEN_EXPIRED,
          message:
            'Refresh token is invalid or expired. Please reconnect your account.',
        },
        timestamp: new Date().toISOString(),
        requestId,
      });
    }

    res.status(500).json({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Failed to refresh authentication token',
      },
      timestamp: new Date().toISOString(),
      requestId,
    });
  }
}
