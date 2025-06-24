import { NextApiRequest, NextApiResponse } from 'next';
import { hubspotClient } from '@/lib/api/hubspot-client';
import { tokenManager } from '@/lib/auth/token-manager';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { validateEnvironment, config } from '@/config/environment';
import { OAuthToken } from '@/lib/shared';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestId = generateRequestId();
  const logger = createLogger(requestId);

  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed',
      requestId,
    });
  }

  try {
    // Validate environment variables
    validateEnvironment();

    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
      logger.error('OAuth error received', new Error(error as string), {
        state,
        error: error as string,
      });

      return res.redirect(
        `${getBaseUrl()}/auth/error?error=${encodeURIComponent(error as string)}`
      );
    }

    // Validate required parameters
    if (!code || typeof code !== 'string') {
      logger.warn('Missing authorization code');
      return res.redirect(`${getBaseUrl()}/auth/error?error=missing_code`);
    }

    if (!state || typeof state !== 'string') {
      logger.warn('Missing state parameter');
      return res.redirect(`${getBaseUrl()}/auth/error?error=missing_state`);
    }

    logger.info('Processing OAuth callback', {
      state,
      hasCode: !!code,
    });

    // Exchange authorization code for tokens
    const tokenResponse = await hubspotClient.exchangeCodeForTokens(
      code,
      config.hubspot.redirectUri
    );

    // Get portal information
    const portalInfo = await hubspotClient.getPortalInfo(
      tokenResponse.access_token
    );

    // Extract portal ID from state parameter
    const portalId = state.split('_')[0];

    // Validate that the portal ID matches
    if (portalId !== portalInfo.portalId.toString()) {
      logger.error(
        'Portal ID mismatch',
        new Error('Security validation failed'),
        {
          expectedPortalId: portalId,
          actualPortalId: portalInfo.portalId,
        }
      );

      return res.redirect(`${getBaseUrl()}/auth/error?error=portal_mismatch`);
    }

    // Create token object
    const token: OAuthToken = {
      hubspotAccountId: portalInfo.portalId.toString(),
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: new Date(Date.now() + tokenResponse.expires_in * 1000),
      scopes: config.hubspot.scopes,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store encrypted token
    await tokenManager.storeToken(token);

    logger.info('OAuth flow completed successfully', {
      portalId: portalInfo.portalId,
      scopes: config.hubspot.scopes,
      expiresAt: token.expiresAt,
    });

    // Redirect to success page
    res.redirect(
      `${getBaseUrl()}/auth/success?portalId=${portalInfo.portalId}`
    );
  } catch (error) {
    logger.error('OAuth callback failed', error as Error, {
      state: req.query.state,
    });

    res.redirect(`${getBaseUrl()}/auth/error?error=callback_failed`);
  }
}

function getBaseUrl(): string {
  if (config.isDevelopment) {
    return 'http://localhost:3000';
  }
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://oauth-bridge.vercel.app';
}
