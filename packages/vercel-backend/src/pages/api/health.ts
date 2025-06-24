import { NextApiRequest, NextApiResponse } from 'next';
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
    // Check environment variables
    validateEnvironment();

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      requestId,
      checks: {
        environment: 'ok',
        runtime: 'ok',
      },
    };

    logger.debug('Health check performed', healthCheck);

    res.status(200).json(healthCheck);
  } catch (error) {
    logger.error('Health check failed', error as Error);

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
      requestId,
    });
  }
}
