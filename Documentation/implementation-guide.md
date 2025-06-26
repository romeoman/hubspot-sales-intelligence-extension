# Step-by-Step Implementation Guide

## Sales Intelligence Integration with HubSpot UI Extensions

### Overview

This guide covers the implementation of the complete Sales Intelligence system that was migrated from Replit to Vercel with an independent Neon PostgreSQL database. The system generates comprehensive sales reports with AI-powered insights.

### Phase 1: Sales Intelligence Backend Setup (✅ COMPLETED)

#### Step 1: Repository Migration ✅ COMPLETED

**What was done:**
- Cloned OutreachSalesIntel repository from GitHub using MCP tools
- Integrated into packages/sales-intel-backend directory
- Preserved all React components and API functionality
- Removed Replit-specific dependencies and configurations

#### Step 2: Database Migration ✅ COMPLETED

**What was done:**
- Created independent Neon PostgreSQL project: wandering-bush-22565063
- Migrated database schema (users, schemas, reports tables)
- Configured Drizzle ORM for Neon serverless connection
- Updated database connection for Vercel deployment

#### Step 3: Vercel Configuration ✅ COMPLETED

**What was done:**
- Created vercel.json with proper routing configuration
- Updated package.json for monorepo structure
- Configured serverless functions with 30s timeout
- Set up environment variable placeholders

### Phase 2: HubSpot CLI Research & Setup (✅ COMPLETED)

#### Step 4: HubSpot CLI Requirements Analysis ✅ COMPLETED

**Research completed covering:**
- HubSpot CLI installation and authentication requirements
- Public app vs private app decision (chose public for broader reach)
- UI extension implementation patterns using iframe modal
- OAuth PKCE security requirements
- Vercel deployment process and environment management

**Key findings:**
- **Enterprise Access Required**: HubSpot Enterprise access needed for CLI usage
- **Public App Benefits**: Available to all HubSpot accounts (vs private apps - Enterprise only)
- **Security**: PKCE OAuth flow mandatory, client secrets server-side only
- **API Restrictions**: Must use `hubspot.fetch()` for all API calls from UI extension
- **Request Limits**: 20 concurrent requests per installed account

### Phase 3: Vercel Deployment Setup (📋 READY FOR EXECUTION)

#### Step 5: Local Development Setup

**Current Task - Set up local development environment:**

```bash
# Navigate to sales intelligence backend
cd packages/sales-intel-backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with actual values:
# - DATABASE_URL (Neon connection string)
# - OPENAI_API_KEY
# - Other required variables

# Start development server
npm run dev
```

#### Step 6: Vercel Production Deployment

**Ready for execution with complete guide:**

```bash
# Install Vercel CLI
npm install -g vercel

# Authenticate and deploy
vercel login
cd packages/vercel-backend
vercel --prod

# Environment variable setup (via Vercel dashboard)
# - HUBSPOT_CLIENT_ID
# - HUBSPOT_CLIENT_SECRET  
# - DATABASE_URL
# - KV_REST_API_URL
# - KV_REST_API_TOKEN
```

See [Vercel Deployment Guide](./vercel-deployment-guide.md) for complete deployment process.

### Phase 4: HubSpot App Configuration (⏳ PENDING USER ACTION)

#### Step 7: HubSpot Developer Account Setup

**User action required:**
1. Create HubSpot developer account with Enterprise access
2. Follow setup guide in `/Tasks/9-HubSpot-Public-App-Setup.txt`
3. Create public app with OAuth configuration
4. Provide Client ID and Client Secret

**Critical requirements identified:**
- HubSpot Enterprise access required for CLI usage
- Public app configuration for broader market reach
- PKCE OAuth flow for enhanced security
- Redirect URLs must match Vercel deployment domain

#### Step 8: HubSpot CLI Project Setup

**After OAuth credentials obtained:**

```bash
# Install HubSpot CLI
npm install -g @hubspot/cli@latest

# Authenticate with HubSpot account
hs init --account=YOUR_ACCOUNT_ID
hs auth

# Create UI extension project from template
hs project create --template=getting-started-public-app

# Or use iframe modal template specifically
hs project create --templateSource="HubSpot/ui-extensions-examples" \
  --dest="sales-intel-extension" \
  --name="sales-intel-extension" \
  --template="display-iframe-modal"
```

#### Step 9: API Endpoint Testing

**Current Task - Test all API endpoints:**

1. **Health Check**: `GET /api/health`
2. **Report Creation (JSONB)**: `POST /api/report` with `reportData`
3. **Report Creation (Schema)**: `POST /api/report` with `payload`
4. **Report Retrieval**: `GET /api/report/:slug`
5. **Report Display**: `GET /r/:slug`
6. **Schema Management**: `GET /api/schemas`

See [API Testing Guide](./api-testing-guide.md) for detailed testing instructions.

### Phase 5: UI Extension Integration (⏳ PENDING OAUTH SETUP)

#### Step 10: HubSpot UI Extension Integration

**Next Task - Update UI Extension to call new backend:**

```javascript
// Update API calls in HubSpot Extension
// FROM: Replit endpoint
// TO: Sales Intelligence backend endpoint

const reportData = {
  schemaKey: "sales-intel-v1",
  hubspotCompanyId: context.crm.objectId,
  hubspotContactId: context.crm.associatedObjectId,
  reportData: {
    // Extract from HubSpot context
    basic_information: {
      first_name: contactData.firstname,
      last_name: contactData.lastname,
      // ... other fields
    }
  }
};

// Call sales-intel-backend API
const response = await hubspot.fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(reportData)
});
```

#### Step 11: Deploy UI Extension to HubSpot

**Upload extension via CLI:**

```bash
# Navigate to extension project
cd packages/hubspot-extension

# Install dependencies
npm install

# Upload to HubSpot
hs project upload

# Check build status
hs project status

# View logs if needed
hs logs
```

### Phase 6: Production Deployment & Testing

#### Step 12: Complete Production Setup

**Final deployment checklist:**

1. **Deploy Backend**: Vercel production deployment with environment variables
2. **Update HubSpot App**: Set redirect URLs to Vercel production domain
3. **Upload Extension**: Deploy UI extension via HubSpot CLI
4. **Configure CRM**: Add app card to contact/company record layouts
5. **End-to-End Testing**: Test complete OAuth and report generation flow

See [Vercel Deployment Guide](./vercel-deployment-guide.md) and [HubSpot CLI Research](./hubspot-cli-research.md) for detailed processes.

### Phase 7: Original HubSpot Extension Setup (Reference)

#### Step 2: Set Up HubSpot Development Environment

**Prompt for Cursor/Claude Code:**

```
Create the HubSpot UI Extension configuration in packages/hubspot-extension:
1. Generate src/app/app.json for a public app configuration
2. Create src/app/extensions/report-viewer-card.json for a CRM card that appears on contact and company records
3. Set up the basic folder structure following HubSpot's requirements
4. Include a package.json with @hubspot/cli as a dev dependency
Reference the display-iframe-modal example from HubSpot's GitHub
```

#### Step 3: Configure Vercel Backend

**Prompt for Cursor/Claude Code:**

```
Set up a Next.js 14 API-only project in packages/vercel-backend with:
1. TypeScript configuration
2. Environment variables setup for HubSpot OAuth (CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
3. NextAuth.js configuration with custom HubSpot provider
4. Vercel KV setup for token storage
5. CORS middleware for HubSpot domains
Include proper type definitions for all configurations
```

### Phase 2: OAuth Implementation

#### Step 4: Create HubSpot OAuth Provider

**Prompt for Cursor/Claude Code:**

```
Implement a custom HubSpot OAuth provider for NextAuth.js that:
1. Handles the OAuth 2.0 authorization code flow
2. Exchanges authorization codes for access and refresh tokens
3. Implements token refresh logic when tokens expire
4. Stores tokens securely in Vercel KV with encryption
5. Includes proper error handling and logging
Use the official @hubspot/api-client for token operations
```

#### Step 5: Build Authentication API Routes

**Prompt for Cursor/Claude Code:**

```
Create Next.js API routes for OAuth flow:
1. /api/auth/install - Initiates OAuth flow with proper scopes (crm.objects.contacts.read, crm.objects.companies.read)
2. /api/auth/callback - Handles OAuth callback and token exchange
3. /api/auth/refresh - Refreshes expired tokens
4. /api/auth/status - Checks authentication status
Include TypeScript types for all request/response objects
```

#### Step 6: Implement Token Management

**Prompt for Cursor/Claude Code:**

```
Create a token management service that:
1. Encrypts tokens before storing in Vercel KV
2. Implements automatic token refresh 5 minutes before expiry
3. Handles multi-tenant scenarios (multiple HubSpot accounts)
4. Includes retry logic with exponential backoff
5. Logs all token operations for debugging
Use crypto-js for encryption and include comprehensive error handling
```

### Phase 3: Report Integration

#### Step 7: Create Report Availability Checker

**Prompt for Cursor/Claude Code:**

```
Build an API endpoint /api/reports/available that:
1. Accepts contactId or companyId as query parameters
2. Validates the HubSpot access token from headers
3. Calls the Replit API to check which reports have data
4. Returns a filtered list of available reports
5. Implements 1-minute caching per user
Include proper TypeScript interfaces for all data structures
```

#### Step 8: Build Report URL Generator

**Prompt for Cursor/Claude Code:**

```
Create /api/reports/generate-url endpoint that:
1. Accepts reportId and context (contactId/companyId)
2. Generates a secure, time-limited URL for the Replit report
3. Includes HubSpot context as query parameters
4. Signs the URL with a secret to prevent tampering
5. Returns the URL with expiration time
Implement URL signing using jsonwebtoken
```

### Phase 4: UI Extension Development

#### Step 9: Create Report Selector Component

**Prompt for Cursor/Claude Code:**

```
Build a React component for the HubSpot UI Extension that:
1. Uses hubspot.extend() to register the extension
2. Fetches available reports using hubspot.fetch()
3. Displays a dropdown using HubSpot UI components
4. Shows loading states during data fetching
5. Handles errors gracefully with user-friendly messages
Follow the pattern from HubSpot's display-iframe-modal example
```

#### Step 10: Implement Iframe Modal Handler

**Prompt for Cursor/Claude Code:**

```
Extend the Report Selector to handle report display:
1. Use actions.openIframeModal when user selects a report
2. Pass the generated report URL from the backend
3. Set appropriate modal size (width: 1200, height: 800)
4. Include a meaningful title for the modal
5. Handle iframe loading errors
Reference the DisplayIframe.jsx pattern from HubSpot examples
```

### Phase 5: Error Handling & Logging

#### Step 11: Implement Comprehensive Error Handling

**Prompt for Cursor/Claude Code:**

```
Add error handling throughout the application:
1. Create a centralized error handler for the backend
2. Implement custom error classes for different scenarios
3. Add user-friendly error messages in the UI Extension
4. Include retry mechanisms for transient failures
5. Log errors with context for debugging
Use Sentry for production error tracking
```

#### Step 12: Add Structured Logging

**Prompt for Cursor/Claude Code:**

```
Implement structured logging system:
1. Use winston or pino for backend logging
2. Include request IDs for tracing
3. Log all OAuth operations
4. Track performance metrics
5. Create different log levels for different environments
Output logs in JSON format for easy parsing
```

### Phase 6: Testing & Security

#### Step 13: Write Unit Tests

**Prompt for Cursor/Claude Code:**

```
Create comprehensive unit tests:
1. Test OAuth flow with mocked HubSpot responses
2. Test token encryption/decryption
3. Test report availability logic
4. Test UI Extension components with React Testing Library
5. Achieve >80% code coverage
Use Jest and include test fixtures for HubSpot API responses
```

#### Step 14: Implement Security Measures

**Prompt for Cursor/Claude Code:**

```
Add security hardening:
1. Implement rate limiting on all API endpoints
2. Add CSRF protection for OAuth flow
3. Validate all input parameters
4. Set secure headers (CSP, HSTS, etc.)
5. Implement request signing for Replit API calls
Use helmet.js and express-rate-limit
```

### Phase 7: Deployment & Monitoring

#### Step 15: Configure Deployment Pipeline

**Prompt for Cursor/Claude Code:**

```
Set up GitHub Actions workflow that:
1. Runs tests on pull requests
2. Checks code quality with ESLint
3. Builds and deploys to Vercel on merge to main
4. Uploads HubSpot extension on tagged releases
5. Includes environment-specific configurations
Create separate workflows for development and production
```

#### Step 16: Add Monitoring & Analytics

**Prompt for Cursor/Claude Code:**

```
Implement application monitoring:
1. Add Vercel Analytics for performance tracking
2. Create custom metrics for OAuth success rate
3. Track report load times
4. Monitor API endpoint usage
5. Set up alerts for errors and performance issues
Include a dashboard for visualizing metrics
```

### Phase 8: Documentation & Finalization

#### Step 17: Create User Documentation

**Prompt for Cursor/Claude Code:**

```
Generate comprehensive documentation:
1. Installation guide for HubSpot administrators
2. User guide for sales teams
3. Troubleshooting guide with common issues
4. API documentation with examples
5. Architecture diagrams using Mermaid
Use Markdown and include screenshots
```

#### Step 18: Prepare for Production

**Prompt for Cursor/Claude Code:**

```
Finalize production preparations:
1. Security audit checklist
2. Performance optimization review
3. Update all dependencies to stable versions
4. Create production environment variables template
5. Set up backup and recovery procedures
Include a go-live checklist
```

### Cursor/Claude Code Best Practices

#### General Prompting Tips

1. **Be Specific**: Include exact file paths and technology versions
2. **Reference Examples**: Point to specific GitHub examples or documentation
3. **Request Types**: Always ask for TypeScript interfaces
4. **Error Handling**: Explicitly request comprehensive error handling
5. **Testing**: Ask for tests alongside implementation

#### Effective Prompt Structure

```
Context: [Describe what you're building]
Task: [Specific implementation request]
Requirements:
- [Requirement 1]
- [Requirement 2]
Technologies: [List specific versions]
Reference: [Link to examples or docs]
Output: [Expected files and structure]
```

#### Iterative Development

1. Start with basic implementation
2. Add error handling in second pass
3. Optimize performance in third pass
4. Add tests last to ensure stability

### Common Pitfalls to Avoid

1. **OAuth Scope Issues**: Always request minimal necessary scopes
2. **CORS Problems**: Test iframe loading early
3. **Token Expiry**: Implement refresh before it's needed
4. **Rate Limiting**: Add queuing for API calls
5. **Error Messages**: Make them actionable for users

### Debugging Commands

```bash
# Sales Intelligence API Testing
curl -X GET "http://localhost:3000/api/health"
curl -X POST "http://localhost:3000/api/report" \
  -H "Content-Type: application/json" \
  -d '{"reportData": {"basic_information": {"first_name": "Test"}}}'

# Test OAuth flow locally
curl -X GET "http://localhost:3000/api/auth/install"

# Check token status
curl -X GET "http://localhost:3000/api/auth/status" \
  -H "Authorization: Bearer {token}"

# Test report availability
curl -X GET "http://localhost:3000/api/reports/available?contactId=123" \
  -H "Authorization: Bearer {token}"

# HubSpot CLI Commands
hs auth
hs accounts list
hs project upload
hs project status
hs logs

# Vercel Deployment Commands
vercel env pull --environment=production
vercel --prod
vercel logs --follow
vercel inspect DEPLOYMENT_URL

# Environment Variable Management
vercel env ls
vercel env add VARIABLE_NAME
```

### Environment Variable Template

```env
# HubSpot OAuth (Required for Public App)
HUBSPOT_CLIENT_ID=your_client_id_from_hubspot_app
HUBSPOT_CLIENT_SECRET=your_client_secret_from_hubspot_app
HUBSPOT_REDIRECT_URI=https://sales-intel.mandigital.dev/auth/hubspot/callback
HUBSPOT_SCOPES=crm.objects.contacts.read,crm.objects.companies.read

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://username:password@ep-example.region.aws.neon.tech/dbname?sslmode=require
NEON_DATABASE_URL=your_neon_connection_string

# API Keys
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret_for_signing

# Vercel KV (Token Storage)
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token

# Security
ENCRYPTION_KEY=your_encryption_key_for_tokens
NEXTAUTH_SECRET=your_nextauth_secret

# Sales Intelligence Backend
SALES_INTEL_API_URL=http://localhost:3000/api/report

# Monitoring
SENTRY_DSN=optional_sentry_dsn
VERCEL_ANALYTICS_ID=optional_vercel_analytics

# Development
NODE_ENV=development
LOG_LEVEL=debug
```
