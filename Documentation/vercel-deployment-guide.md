# Vercel Deployment Guide

## Overview

Complete guide for deploying the HubSpot UI Extension backend to Vercel with proper environment variable management and production configuration.

## Prerequisites

### Vercel Account Setup
- Vercel account at https://vercel.com
- Vercel CLI installed: `npm install -g vercel`
- Git repository connected to Vercel

### Project Requirements
- Next.js backend configured for serverless deployment
- Environment variables defined for OAuth and database
- Production-ready configuration files

## Vercel CLI Installation & Setup

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Link Project (if not already linked)
```bash
vercel link
```

## Environment Variables Management

### Development Environment
```bash
# Pull production environment variables to local
vercel env pull

# Pull specific environment
vercel env pull --environment=preview
vercel env pull --environment=production
```

### Setting Environment Variables

#### Via Vercel Dashboard
1. Go to project settings in Vercel dashboard
2. Navigate to Environment Variables section
3. Add variables for each environment (Development, Preview, Production)

#### Via CLI
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

### Required Environment Variables

#### HubSpot OAuth Configuration
```bash
HUBSPOT_CLIENT_ID=your_client_id_here
HUBSPOT_CLIENT_SECRET=your_client_secret_here
HUBSPOT_REDIRECT_URI=https://your-vercel-domain.vercel.app/auth/hubspot/callback
HUBSPOT_SCOPES=crm.objects.contacts.read,crm.objects.companies.read
```

#### Database Configuration
```bash
DATABASE_URL=postgresql://username:password@host:port/database
NEON_DATABASE_URL=your_neon_connection_string
```

#### API Keys
```bash
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_for_signing
```

#### Vercel KV (for token storage)
```bash
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
```

## Deployment Process

### 1. Development Deployment
```bash
# Deploy to preview environment
vercel

# Deploy with specific environment
vercel --target preview
```

### 2. Production Deployment
```bash
# Deploy to production
vercel --prod

# Deploy specific directory to production
vercel packages/vercel-backend --prod
```

### 3. Deployment with Custom Domain
```bash
# Add custom domain
vercel domains add your-domain.com

# Deploy to custom domain
vercel --prod --domains your-domain.com
```

## Project Configuration

### vercel.json Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/pages/api/**/*.ts",
      "use": "@vercel/node"
    },
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/src/pages/api/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/pages/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### next.config.js for Vercel
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: 'https://app.hubspot.com'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
```

## Database Configuration for Vercel

### Neon Database Setup
```bash
# Connection string format for Neon
DATABASE_URL=postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require

# Connection pooling for serverless
DIRECT_URL=postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require&pgbouncer=true
```

### Connection Pool Configuration
```typescript
// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

## Security Configuration

### CORS Headers
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Handle CORS for HubSpot
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', 'https://app.hubspot.com');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
  }
}

export const config = {
  matcher: '/api/:path*',
};
```

### Environment Variable Validation
```typescript
// config/environment.ts
export const validateEnvironment = () => {
  const required = [
    'HUBSPOT_CLIENT_ID',
    'HUBSPOT_CLIENT_SECRET',
    'DATABASE_URL',
    'JWT_SECRET'
  ];

  for (const env of required) {
    if (!process.env[env]) {
      throw new Error(`Missing required environment variable: ${env}`);
    }
  }
};
```

## Monitoring & Debugging

### Vercel Logs
```bash
# View function logs
vercel logs

# View logs for specific deployment
vercel logs DEPLOYMENT_URL

# Stream logs in real-time
vercel logs --follow
```

### Environment Testing
```bash
# Test environment variables locally
vercel dev

# Check deployment status
vercel inspect DEPLOYMENT_URL
```

## Performance Optimization

### Function Configuration
```json
{
  "functions": {
    "src/pages/api/auth/*.ts": {
      "maxDuration": 30
    },
    "src/pages/api/reports/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```

### Caching Strategy
```typescript
// API route with caching
export default async function handler(req: NextRequest) {
  const response = await fetch('/api/data');
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
      'Content-Type': 'application/json'
    }
  });
}
```

## HubSpot Integration Setup

### Update Redirect URLs
After deploying to Vercel, update HubSpot app configuration:

1. **Development**:
   - Redirect URL: `http://localhost:3000/auth/hubspot/callback`

2. **Preview**:
   - Redirect URL: `https://your-app-git-branch.vercel.app/auth/hubspot/callback`

3. **Production**:
   - Redirect URL: `https://your-app.vercel.app/auth/hubspot/callback`

### Test OAuth Flow
```bash
# Test OAuth endpoints after deployment
curl https://your-app.vercel.app/api/auth/status
curl https://your-app.vercel.app/api/health
```

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables set in Vercel dashboard
- [ ] Database connections tested
- [ ] API endpoints working locally
- [ ] CORS headers configured for HubSpot
- [ ] Error handling implemented

### Post-Deployment
- [ ] Health check endpoint responds
- [ ] OAuth flow works end-to-end
- [ ] Database queries execute successfully
- [ ] Error monitoring set up
- [ ] HubSpot app redirect URLs updated

### HubSpot Integration
- [ ] Extension uploaded via CLI
- [ ] App card appears in CRM records
- [ ] API calls work from extension
- [ ] Error states handled gracefully

## Troubleshooting

### Common Issues

#### Environment Variables Not Loading
```bash
# Check if variables are set
vercel env ls

# Re-deploy with fresh environment
vercel --prod --force
```

#### Database Connection Issues
```typescript
// Test database connection
import pool from '../lib/db';

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'ok', time: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### CORS Issues with HubSpot
- Verify origin headers match exactly
- Check middleware configuration
- Test with browser developer tools

## Production Best Practices

### Security
- Use environment-specific secrets
- Enable HTTPS only
- Implement rate limiting
- Monitor for suspicious activity

### Performance
- Use connection pooling for database
- Implement caching where appropriate
- Monitor function execution times
- Set appropriate timeout values

### Reliability
- Implement health checks
- Set up error monitoring
- Use graceful error handling
- Plan for database failover

## Next Steps After Deployment

1. **Update HubSpot App**: Set production redirect URLs
2. **Upload UI Extension**: Use HubSpot CLI to upload extension
3. **Test Integration**: Verify complete OAuth and report flow
4. **Monitor Performance**: Set up alerts and monitoring
5. **Documentation**: Update team with production URLs and processes