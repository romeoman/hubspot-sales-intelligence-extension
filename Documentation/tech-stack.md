# Technology Stack Documentation

## HubSpot UI Extension Integration Project

### Overview

This document outlines the complete technology stack for the HubSpot UI Extension integration with Replit reports, including frameworks, libraries, tools, and services.

### Core Technologies

#### Frontend (HubSpot UI Extension)

| Technology             | Version | Purpose             | Justification                     |
| ---------------------- | ------- | ------------------- | --------------------------------- |
| React                  | 18.x    | UI framework        | Required by HubSpot UI Extensions |
| @hubspot/ui-extensions | Latest  | HubSpot components  | Official HubSpot SDK              |
| TypeScript             | 5.x     | Type safety         | Better developer experience       |
| @hubspot/cli           | Latest  | Development tooling | Official HubSpot CLI              |

#### Backend (Vercel OAuth Bridge)

| Technology          | Version | Purpose        | Justification                            |
| ------------------- | ------- | -------------- | ---------------------------------------- |
| Next.js             | 14.x    | API framework  | Vercel optimization, built-in API routes |
| TypeScript          | 5.x     | Type safety    | Consistent with frontend                 |
| NextAuth.js         | 4.x     | OAuth handling | Simplified authentication flow           |
| @hubspot/api-client | Latest  | HubSpot API    | Official Node.js client                  |

#### Infrastructure

| Service | Purpose              | Justification               |
| ------- | -------------------- | --------------------------- |
| Vercel  | OAuth bridge hosting | Serverless, easy deployment |
| Replit  | Report hosting       | Existing infrastructure     |
| GitHub  | Version control      | CI/CD integration           |

### Key Libraries & Dependencies

#### Authentication & Security

```json
{
  "next-auth": "^4.24.0",
  "@next-auth/prisma-adapter": "^1.0.7",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "crypto-js": "^4.2.0"
}
```

#### API & HTTP

```json
{
  "@hubspot/api-client": "^11.0.0",
  "axios": "^1.6.0",
  "swr": "^2.2.0",
  "node-fetch": "^3.3.0"
}
```

#### Database & Storage

```json
{
  "@vercel/kv": "^1.0.0",
  "ioredis": "^5.3.0"
}
```

#### Development Tools

```json
{
  "@types/react": "^18.2.0",
  "@types/node": "^20.0.0",
  "eslint": "^8.50.0",
  "prettier": "^3.0.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.0.0"
}
```

### Development Environment

#### Required Tools

1. **Node.js**: v18.x or higher
2. **npm/yarn**: Latest stable
3. **HubSpot CLI**: Latest version
4. **Vercel CLI**: Latest version
5. **Git**: For version control

#### IDE Extensions

- ESLint
- Prettier
- TypeScript
- React snippets
- HubSpot snippets

### Architecture Patterns

#### Design Patterns

1. **Repository Pattern**: For data access
2. **Factory Pattern**: For OAuth providers
3. **Observer Pattern**: For real-time updates
4. **Singleton Pattern**: For token management

#### Code Organization

```
project-root/
├── packages/
│   ├── hubspot-extension/     # UI Extension code
│   ├── vercel-backend/        # OAuth bridge
│   └── shared/               # Shared types/utils
├── docs/                     # Documentation
├── scripts/                  # Build/deploy scripts
└── tests/                    # Test suites
```

### API Integration Points

#### HubSpot APIs

- **OAuth v2**: Authentication flow
- **CRM Objects API**: Contact/Company data
- **UI Extensions API**: Card registration
- **Webhooks API**: Real-time updates

#### External Services

- **Replit API**: Report data endpoints
- **Vercel KV**: Token storage
- **GitHub Actions**: CI/CD pipeline

### Security Stack

#### Authentication

- OAuth 2.0 with PKCE
- JWT for session management
- Refresh token rotation
- Multi-factor authentication support

#### Encryption

- AES-256 for token storage
- TLS 1.3 for all communications
- Environment variable encryption
- Secure cookie handling

### Performance Optimization

#### Frontend Optimization

- React.memo for component optimization
- Lazy loading for reports
- Virtual scrolling for large lists
- Service worker for offline support

#### Backend Optimization

- Edge functions for low latency
- Connection pooling
- Response caching
- CDN for static assets

### Monitoring & Analytics

#### Application Monitoring

- **Vercel Analytics**: Performance metrics
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **Custom logging**: Structured logs

#### Business Metrics

- Report usage analytics
- User engagement tracking
- Performance benchmarking
- Error rate monitoring

### Testing Framework

#### Unit Testing

```json
{
  "jest": "^29.0.0",
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0"
}
```

#### Integration Testing

```json
{
  "cypress": "^13.0.0",
  "playwright": "^1.40.0"
}
```

#### API Testing

```json
{
  "supertest": "^6.3.0",
  "nock": "^13.4.0"
}
```

### Deployment Pipeline

#### CI/CD Tools

- GitHub Actions for automation
- Vercel preview deployments
- Automated testing
- Security scanning

#### Deployment Stages

1. **Development**: Feature branches
2. **Staging**: Main branch
3. **Production**: Tagged releases

### Development Workflow

#### Git Flow

```bash
main
├── develop
│   ├── feature/oauth-implementation
│   ├── feature/report-selector
│   └── feature/error-handling
├── release/v1.0.0
└── hotfix/security-patch
```

#### Code Quality

- Pre-commit hooks
- Automated linting
- Code review requirements
- Test coverage thresholds

### Environment Configuration

#### Development

```env
HUBSPOT_CLIENT_ID=dev_client_id
HUBSPOT_CLIENT_SECRET=dev_secret
VERCEL_URL=http://localhost:3000
REPLIT_API_URL=https://dev.replit.app
```

#### Production

```env
HUBSPOT_CLIENT_ID=prod_client_id
HUBSPOT_CLIENT_SECRET=prod_secret
VERCEL_URL=https://oauth-bridge.vercel.app
REPLIT_API_URL=https://reports.replit.app
```

### Recommended VS Code Settings

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": true,
    "**/.next": true
  }
}
```

### Package Manager Configuration

#### npm Configuration

```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "packageManager": "npm@9.0.0"
}
```

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Support

- Responsive design for tablets
- Limited mobile functionality
- Progressive enhancement approach
