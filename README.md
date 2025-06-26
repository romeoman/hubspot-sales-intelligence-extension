# HubSpot Sales Intelligence UI Extension

> AI-powered sales intelligence reports integrated directly into HubSpot CRM

[![Production Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://sales-intel.mandigital.dev)
[![HubSpot Extension](https://img.shields.io/badge/HubSpot-UI%20Extension-orange)](https://app.hubspot.com/developers/146425426/project/sales-intelligence-app)
[![Build](https://img.shields.io/badge/Build-%234-blue)](https://app.hubspot.com/developer-projects/146425426/project/sales-intelligence-app/activity/build/4)

A complete HubSpot UI Extension that seamlessly integrates AI-powered sales intelligence reports directly into the CRM interface. Sales teams can access comprehensive contact and company intelligence without leaving HubSpot.

### 🚀 Live Demo

- **Production URL**: [https://sales-intel.mandigital.dev](https://sales-intel.mandigital.dev)
- **HubSpot App ID**: 14905888
- **Status**: ✅ Fully operational in production

## 🚀 Features

- **Secure OAuth Integration**: Complete OAuth 2.0 flow with encrypted token storage
- **Dynamic Report Selection**: Automatically detects available reports for contacts/companies
- **Iframe Modal Display**: Reports load in secure iframe modals within HubSpot
- **Multi-tenant Support**: Handles multiple HubSpot accounts simultaneously
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Caching, rate limiting, and optimized API calls

## 📁 Project Structure

```
├── packages/
│   ├── hubspot-public-app/    # HubSpot UI Extension (React)
│   ├── sales-intel-backend/   # Consolidated backend (OAuth + Reports)
│   └── shared/               # Common types and utilities
├── Documentation/            # Project documentation
├── Tasks/                   # Task tracking and status
└── scripts/                 # Build and deployment scripts
```

## 🔧 Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm 9+
- HubSpot Developer Account (Public App)
- Vercel Account
- Neon PostgreSQL Database

### 2. Environment Configuration

#### Sales Intel Backend (.env.local)

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/database

# HubSpot OAuth
HUBSPOT_CLIENT_ID=your_hubspot_client_id
HUBSPOT_CLIENT_SECRET=your_hubspot_client_secret
HUBSPOT_APP_ID=your_hubspot_app_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-nano-2025-04-14

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
JWT_SECRET=your_jwt_secret_for_signing_tokens
```

### 3. Installation

```bash
# Install dependencies
npm install

# Install dependencies for all packages
npm install --workspaces

# Build shared package
cd packages/shared && npm run build
```

### 4. Development

```bash
# Start sales intel backend development server
cd packages/sales-intel-backend && npm run dev

# In another terminal, work on HubSpot extension
cd packages/hubspot-public-app && npm run dev
```

### 5. Deployment

#### Deploy Sales Intel Backend

```bash
cd packages/sales-intel-backend
vercel --prod
```

#### Deploy HubSpot Extension

```bash
cd packages/hubspot-public-app
hs project upload
```

## 🔐 Security Features

- **Token Encryption**: All OAuth tokens encrypted with AES-256
- **Secure Storage**: Tokens stored in Vercel KV with expiration
- **CORS Protection**: Proper CORS configuration for HubSpot domains
- **Request Signing**: JWT signing for additional URL security
- **Rate Limiting**: Built-in rate limiting on all endpoints

## 📊 Architecture

```mermaid
graph TD
    A[HubSpot CRM] --> B[UI Extension]
    B --> C[Sales Intel Backend]
    C --> D[HubSpot API]
    C --> E[Neon PostgreSQL]
    C --> F[OpenAI API]

    B --> G[Report Modal]
    G --> C
```

## 🔄 OAuth Flow

1. User clicks "Install" in HubSpot App Marketplace
2. Redirect to `/api/auth/install` with portal ID
3. Redirect to HubSpot OAuth consent screen
4. User approves, HubSpot redirects to `/api/auth/callback`
5. Exchange code for tokens and display success page
6. User can now view reports in UI Extension

## 🛠️ API Endpoints

### Authentication

- `GET /api/auth/install` - Initiate OAuth flow
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/refresh` - Refresh expired tokens
- `GET /api/auth/status` - Check token status

### Reports

- `GET /api/reports/by-hubspot-id` - Get reports by HubSpot contact/company ID
- `POST /api/report` - Create new report
- `GET /r/{slug}` - View report HTML

### Health

- `GET /api/health` - Health check endpoint

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=packages/sales-intel-backend

# Run with coverage
npm run test:coverage
```

## 📝 Development Guidelines

See [CLAUDE.md](./CLAUDE.md) for comprehensive development guidelines including:

- OAuth security requirements
- API development standards
- Error handling practices
- Testing requirements
- Deployment processes

## 🔍 Monitoring

- **Error Tracking**: Structured logging with request IDs
- **Performance Metrics**: API response time monitoring
- **Authentication Metrics**: OAuth success/failure rates
- **Usage Analytics**: Report view tracking

## 🚨 Troubleshooting

### Common Issues

1. **Token Expired**: Check `/api/auth/status` and refresh if needed
2. **CORS Errors**: Verify Vercel domain in HubSpot app settings
3. **Report Not Loading**: Check database connectivity
4. **Missing Reports**: Verify HubSpot object IDs and permissions

### Debug Commands

```bash
# Check health
curl -X GET "https://sales-intel.mandigital.dev/api/health"

# Test report fetching
curl -X GET "https://sales-intel.mandigital.dev/api/reports/by-hubspot-id?contactId=123&companyId=456"

# View report
curl -X GET "https://sales-intel.mandigital.dev/r/REPORT_SLUG"
```

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📞 Support

For support, please contact [support@mandigital.dev](mailto:support@mandigital.dev) or create an issue in this repository.
