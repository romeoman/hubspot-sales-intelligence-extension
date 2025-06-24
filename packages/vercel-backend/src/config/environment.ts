export const config = {
  hubspot: {
    clientId: process.env.HUBSPOT_CLIENT_ID!,
    clientSecret: process.env.HUBSPOT_CLIENT_SECRET!,
    redirectUri: process.env.HUBSPOT_REDIRECT_URI!,
    scopes: ['crm.objects.contacts.read', 'crm.objects.companies.read'],
  },
  security: {
    encryptionKey: process.env.ENCRYPTION_KEY!,
    jwtSecret: process.env.JWT_SECRET!,
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
  },
  replit: {
    apiUrl: process.env.REPLIT_API_URL!,
    apiKey: process.env.REPLIT_API_KEY!,
  },
  kv: {
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [
      'https://app.hubspot.com',
      'https://app-eu1.hubspot.com',
    ],
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

// Validate required environment variables
const requiredEnvVars = [
  'HUBSPOT_CLIENT_ID',
  'HUBSPOT_CLIENT_SECRET',
  'HUBSPOT_REDIRECT_URI',
  'ENCRYPTION_KEY',
  'JWT_SECRET',
  'REPLIT_API_URL',
];

export function validateEnvironment(): void {
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }

  if (config.security.encryptionKey.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be exactly 32 characters long');
  }
}
