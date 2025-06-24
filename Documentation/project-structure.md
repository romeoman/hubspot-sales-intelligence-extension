# Project Structure and Files

## Complete File Organization for HubSpot UI Extension Integration

### Root Directory Structure

```
hubspot-sales-intelligence/
├── packages/                    # Monorepo packages
│   ├── hubspot-extension/      # UI Extension code
│   ├── vercel-backend/         # OAuth bridge backend
│   ├── sales-intel-backend/    # Sales Intelligence API (migrated from Replit)
│   └── shared/                 # Shared utilities
├── Documentation/              # Project documentation
├── Tasks/                      # Task tracking and planning
├── .github/                    # GitHub configuration
├── .gitignore
├── .eslintrc.js
├── .prettierrc
├── CLAUDE.md                   # Development guidelines
├── package.json               # Root package.json with workspaces
├── tsconfig.json              # Root TypeScript config
├── README.md
└── LICENSE
```

### Detailed File Structure

#### `/packages/hubspot-extension/`

```
hubspot-extension/
├── src/
│   └── app/
│       ├── app.json                           # App configuration
│       └── extensions/
│           ├── ReportViewer.jsx               # Main component
│           ├── report-viewer-card.json        # Card config
│           ├── components/
│           │   ├── ReportSelector.jsx
│           │   ├── LoadingSpinner.jsx
│           │   ├── ErrorBoundary.jsx
│           │   └── EmptyState.jsx
│           ├── hooks/
│           │   ├── useReports.js
│           │   ├── useHubSpotContext.js
│           │   └── useErrorHandler.js
│           ├── utils/
│           │   ├── api.js
│           │   ├── constants.js
│           │   └── helpers.js
│           └── package.json
├── hsproject.json                             # HubSpot project config
├── package.json
├── tsconfig.json
└── README.md
```

#### `/packages/vercel-backend/`

```
vercel-backend/
├── src/
│   ├── pages/
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── install.ts
│   │       │   ├── callback.ts
│   │       │   ├── refresh.ts
│   │       │   └── status.ts
│   │       ├── reports/
│   │       │   ├── available.ts
│   │       │   ├── generate-url.ts
│   │       │   └── validate.ts
│   │       └── health.ts
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── hubspot-provider.ts
│   │   │   ├── token-manager.ts
│   │   │   └── encryption.ts
│   │   ├── api/
│   │   │   ├── hubspot-client.ts
│   │   │   ├── sales-intel-client.ts
│   │   │   └── error-handler.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── cors.ts
│   │   │   ├── rate-limit.ts
│   │   │   └── logging.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   ├── cache.ts
│   │   │   └── validators.ts
│   │   └── types/
│   │       ├── auth.ts
│   │       ├── reports.ts
│   │       └── api.ts
│   ├── config/
│   │   ├── constants.ts
│   │   └── environment.ts
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── fixtures/
├── public/
│   └── .well-known/
├── next.config.js
├── vercel.json
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

#### `/packages/sales-intel-backend/`

```
sales-intel-backend/
├── server/                         # Express.js API server
│   ├── index.ts                   # Server entry point
│   ├── routes.ts                  # API route definitions
│   ├── db.ts                      # Neon database connection
│   ├── storage.ts                 # Database operations
│   ├── vite.ts                    # Vite development integration
│   └── services/
│       ├── openai.ts              # AI processing service
│       └── schema-registry.ts     # Report schema management
├── client/                        # React frontend
│   ├── index.html                 # HTML template
│   └── src/
│       ├── App.tsx                # Main React app
│       ├── main.tsx               # React entry point
│       ├── index.css              # Global styles
│       ├── components/            # React components
│       │   ├── api-docs/          # API documentation components
│       │   ├── layout/            # Layout components
│       │   ├── report/            # Report display components
│       │   └── ui/                # UI library components
│       ├── hooks/                 # Custom React hooks
│       ├── lib/                   # Utilities and types
│       └── pages/                 # Page components
├── shared/                        # Shared code
│   └── schema.ts                  # Database schema definitions
├── attached_assets/               # Static assets and examples
├── backup/                        # Backup of original files
├── source/                        # Original cloned repository
├── API_DOCUMENTATION.md           # API documentation
├── components.json                # shadcn/ui configuration
├── drizzle.config.ts             # Database configuration
├── package.json                   # Dependencies and scripts
├── postcss.config.js             # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── test-report.json              # Test data
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment config
├── vite.config.ts                # Vite configuration
├── .env                          # Environment variables
└── .env.example                  # Environment template
```

#### `/packages/shared/`

```
shared/
├── src/
│   ├── types/
│   │   ├── hubspot.ts
│   │   ├── reports.ts
│   │   └── common.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   └── constants/
│       ├── errors.ts
│       ├── scopes.ts
│       └── endpoints.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Key Configuration Files

#### Root `package.json`

```json
{
  "name": "hubspot-sales-intelligence",
  "version": "1.0.0",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "npm run dev --workspaces",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "prepare": "husky install"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "eslint": "^8.50.0",
    "eslint-config-prettier": "^9.0.0",
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0"
  }
}
```

#### HubSpot Extension `app.json`

```json
{
  "name": "Replit Reports Viewer",
  "description": "View Replit reports directly in HubSpot CRM",
  "uid": "replit-reports-viewer",
  "scopes": ["crm.objects.contacts.read", "crm.objects.companies.read"],
  "public": true,
  "extensions": {
    "crm": {
      "cards": [
        {
          "file": "./extensions/report-viewer-card.json"
        }
      ]
    }
  }
}
```

#### Extension Card Configuration

```json
{
  "type": "crm-card",
  "data": {
    "title": "Replit Reports",
    "location": "crm.record.tab",
    "module": {
      "file": "ReportViewer.jsx"
    },
    "objectTypes": [
      {
        "name": "contacts"
      },
      {
        "name": "companies"
      }
    ]
  }
}
```

#### Vercel Configuration

```json
{
  "functions": {
    "src/pages/api/auth/*.ts": {
      "maxDuration": 10
    },
    "src/pages/api/reports/*.ts": {
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://app.hubspot.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        }
      ]
    }
  ]
}
```

#### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022", "DOM"],
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@shared/*": ["../shared/src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Implementation Files Examples

#### Main React Component

```jsx
// packages/hubspot-extension/src/app/extensions/ReportViewer.jsx
import React, { useState, useEffect } from 'react';
import {
  Text,
  Button,
  Select,
  Flex,
  Box,
  Alert,
  LoadingSpinner,
  hubspot,
} from '@hubspot/ui-extensions';

hubspot.extend(({ context, actions }) => (
  <ReportViewer
    context={context}
    openModal={actions.openIframeModal}
    fetchData={actions.fetchData}
  />
));

const ReportViewer = ({ context, openModal, fetchData }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('');

  // Component implementation...
};
```

#### OAuth Installation Handler

```typescript
// packages/vercel-backend/src/pages/api/auth/install.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { generateAuthUrl } from '@/lib/auth/hubspot-provider';
import { logger } from '@/lib/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { portalId } = req.query;

    const authUrl = generateAuthUrl({
      portalId: portalId as string,
      redirectUri: process.env.HUBSPOT_REDIRECT_URI!,
      scopes: ['crm.objects.contacts.read', 'crm.objects.companies.read'],
    });

    logger.info('OAuth installation initiated', { portalId });

    res.redirect(authUrl);
  } catch (error) {
    logger.error('OAuth installation failed', error);
    res.status(500).json({ error: 'Installation failed' });
  }
}
```

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm test

  deploy-vercel:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./packages/vercel-backend

  deploy-hubspot:
    needs: test
    if: startsWith(github.ref, 'refs/tags/')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install -g @hubspot/cli
      - run: |
          cd packages/hubspot-extension
          hs auth --portal ${{ secrets.HUBSPOT_PORTAL_ID }} --personalAccessKey ${{ secrets.HUBSPOT_ACCESS_KEY }}
          hs project upload
```

### Environment Files

#### Development `.env.local`

```env
# HubSpot OAuth
HUBSPOT_CLIENT_ID=dev_xxxxxxxxxxxx
HUBSPOT_CLIENT_SECRET=dev_yyyyyyyyyyyy
HUBSPOT_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Security
ENCRYPTION_KEY=dev_encryption_key_32_chars_long!!
JWT_SECRET=dev_jwt_secret_for_signing_tokens
NEXTAUTH_SECRET=dev_nextauth_secret_random_string
NEXTAUTH_URL=http://localhost:3000

# External APIs
REPLIT_API_URL=https://dev-reports.replit.app
REPLIT_API_KEY=dev_replit_api_key

# Redis/KV Store
KV_REST_API_URL=https://dev-xxxxx.upstash.io
KV_REST_API_TOKEN=dev_token

# Logging
LOG_LEVEL=debug
NODE_ENV=development
```

#### Production `.env.production`

```env
# HubSpot OAuth
HUBSPOT_CLIENT_ID=prod_xxxxxxxxxxxx
HUBSPOT_CLIENT_SECRET=prod_yyyyyyyyyyyy
HUBSPOT_REDIRECT_URI=https://oauth-bridge.vercel.app/api/auth/callback

# Security
ENCRYPTION_KEY=prod_encryption_key_must_be_32chars
JWT_SECRET=prod_jwt_secret_super_secure_value
NEXTAUTH_SECRET=prod_nextauth_secret_random_secure
NEXTAUTH_URL=https://oauth-bridge.vercel.app

# External APIs
REPLIT_API_URL=https://reports.replit.app
REPLIT_API_KEY=prod_replit_api_key

# Redis/KV Store
KV_REST_API_URL=https://prod-xxxxx.upstash.io
KV_REST_API_TOKEN=prod_token

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/project

# Logging
LOG_LEVEL=info
NODE_ENV=production
```

### Documentation Files

#### Main README

```markdown
# HubSpot Replit Integration

Seamlessly integrate Replit reports into HubSpot CRM using UI Extensions.

## Features

- OAuth 2.0 authentication
- Dynamic report selection
- Secure iframe embedding
- Multi-tenant support

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables
4. Start development: `npm run dev`

## Documentation

- [Installation Guide](docs/installation.md)
- [User Guide](docs/user-guide.md)
- [API Reference](docs/api-reference.md)
- [Troubleshooting](docs/troubleshooting.md)

## Architecture

See [Technical Architecture](docs/architecture.md)

## Contributing

See [Contributing Guidelines](CONTRIBUTING.md)

## License

MIT
```

### Testing Structure

```
tests/
├── unit/
│   ├── auth/
│   │   ├── token-manager.test.ts
│   │   └── encryption.test.ts
│   ├── api/
│   │   └── report-availability.test.ts
│   └── components/
│       └── ReportSelector.test.jsx
├── integration/
│   ├── oauth-flow.test.ts
│   ├── report-display.test.ts
│   └── error-scenarios.test.ts
├── e2e/
│   ├── installation.spec.ts
│   └── report-viewing.spec.ts
└── fixtures/
    ├── hubspot-responses.json
    └── report-data.json
```
