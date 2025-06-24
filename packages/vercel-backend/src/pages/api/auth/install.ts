import { NextApiRequest, NextApiResponse } from 'next';
import { hubspotClient } from '@/lib/api/hubspot-client';
import { createLogger, generateRequestId } from '@/lib/utils/logger';
import { validateEnvironment } from '@/config/environment';

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

    const { portalId, state } = req.query;

    if (!portalId || typeof portalId !== 'string') {
      logger.warn('Missing or invalid portalId parameter');
      return res.status(400).json({
        error: 'Portal ID is required',
        requestId,
      });
    }

    // Generate state parameter for CSRF protection if not provided
    const stateParam = (state as string) || `${portalId}_${Date.now()}`;

    // Generate HubSpot OAuth authorization URL
    const authUrl = hubspotClient.generateAuthUrl(portalId, stateParam);

    logger.info('OAuth installation initiated', {
      portalId,
      state: stateParam,
    });

    // Redirect to HubSpot OAuth consent screen
    res.redirect(302, authUrl);
  } catch (error) {
    logger.error('OAuth installation failed', error as Error, {
      portalId: req.query.portalId,
    });

    res.status(500).json({
      error: 'Installation failed. Please try again.',
      requestId,
    });
  }
}

// Disable body parsing for this endpoint
export const config = {
  api: {
    bodyParser: false,
  },
};
