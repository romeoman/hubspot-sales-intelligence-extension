import winston from 'winston';
import { config } from '@/config/environment';

const logger = winston.createLogger({
  level: config.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'hubspot-oauth-bridge',
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

// Helper function to generate request IDs
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Structured logging helpers
export const createLogger = (requestId?: string) => ({
  info: (message: string, meta?: any) =>
    logger.info(message, { ...meta, requestId }),
  error: (message: string, error?: Error, meta?: any) =>
    logger.error(message, { ...meta, error: error?.stack, requestId }),
  warn: (message: string, meta?: any) =>
    logger.warn(message, { ...meta, requestId }),
  debug: (message: string, meta?: any) =>
    logger.debug(message, { ...meta, requestId }),
});

export default logger;
