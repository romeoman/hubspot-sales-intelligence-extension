# HubSpot UI Extension Project Guidelines

## Project Overview

This is a HubSpot UI Extension for integrating Sales Intelligence reports via Vercel backend. The project consists of:

- **HubSpot UI Extension** (React components for CRM)
- **Vercel Backend** (Next.js API for report generation and authentication)
- **Sales Intelligence Backend** (Full-stack report generator migrated from Replit)
- **Shared Package** (Common types and utilities)
- **Neon Database** (Independent PostgreSQL database for report data)

## Development Rules

### Documentation & Knowledge Management

- **ALWAYS** query Context7 MCP for latest technology documentation and updates before implementing any technology
- **ALWAYS** query Atlas Docs MCP for comprehensive technical patterns, best practices, and detailed implementation guides
- **Cross-reference both documentation sources** for complete coverage of any technology or pattern
- **Use Memory MCP tools** to track all project decisions, progress, and documentation sources used
- **Store database configurations** and migration history in memory with documentation references
- **Document all architectural decisions** in memory entities with source attribution
- **Query both Context7 and Atlas Docs** for deployment and configuration best practices
- **Maintain project context** across all development sessions with full documentation lineage

### Sales Intelligence Migration Rules

- **NEVER** use Replit infrastructure or dependencies
- **ALWAYS** use independent Neon database created via MCP Docker tools
- **ALWAYS** deploy to Vercel instead of Replit
- **Store migration decisions** in Memory MCP for future reference
- **Query latest documentation** before modifying database schema or API patterns
- **Preserve report generation functionality** while updating deployment architecture

### OAuth Security Requirements

- **NEVER** expose client secrets in frontend code
- **ALWAYS** encrypt tokens before storage in Vercel KV
- **ALWAYS** use PKCE flow for enhanced OAuth security
- **NEVER** log sensitive tokens or credentials
- Implement token refresh 5 minutes before expiry
- Use secure HTTP-only cookies when possible

### HubSpot UI Extension Best Practices

- **ALWAYS** use official `@hubspot/ui-extensions` components
- Follow HubSpot's design system and styling guidelines
- **NEVER** make direct API calls from UI Extension (use hubspot.fetch())
- Handle loading states and errors gracefully for all user interactions
- Respect HubSpot's iframe security restrictions
- Test across different portal sizes and user permissions

### API Development Standards

- **ALWAYS** validate all input parameters using shared validation utilities
- Implement proper error handling with structured error responses
- Use TypeScript interfaces from shared package for consistency
- Include request IDs for tracing and debugging
- Implement rate limiting on all public endpoints
- Return appropriate HTTP status codes

### Code Organization

```
packages/
├── hubspot-extension/     # React UI Extension
├── sales-intel-backend/   # Consolidated Full-stack Backend (OAuth + Reports)
└── shared/               # Common types/utils
```

**IMPORTANT**: Use **single consolidated backend** instead of separate vercel-backend and sales-intel-backend projects.

### Database Management

- **ALWAYS** use MCP Docker Neon tools for database operations
- **NEVER** connect to Replit database - use independent Neon project only
- **Store all database decisions** in Memory MCP with migration history
- **Query Context7/Atlas Docs** for Drizzle ORM best practices before schema changes
- **Use proper connection pooling** for Vercel serverless functions

### Testing Requirements

- Unit tests for all OAuth flow components
- Integration tests for HubSpot API interactions
- Mock all external API calls in tests
- Test error scenarios and edge cases
- Maintain >80% code coverage

### Environment Management

- Use different OAuth apps for dev/staging/production
- **NEVER** commit secrets to repository
- Use Vercel environment variables for production secrets
- Include .env.example files with required variables
- Validate environment variables on startup

### Performance Guidelines

- Cache report availability for 1 minute per user
- Implement lazy loading for report lists
- Use connection pooling for database connections
- Optimize bundle size for UI Extension
- Monitor API response times and set alerts

### Error Handling Standards

- Use structured error responses with error codes
- Provide actionable error messages to users
- Log errors with context for debugging
- Implement graceful degradation for service failures
- Use error boundaries in React components

### Vercel Monorepo Deployment Guidelines

#### CLI-Based Deployment Strategy

- **ALWAYS** use CLI for deployment instead of manual dashboard uploads
- **USE** `vercel link --repo` (alpha) from monorepo root for proper project linking
- **RESEARCH** deployment solutions using MCP Docker and Firecrawl tools for deep technical insights
- **PREFER** consolidated single backend over multiple Vercel projects

#### Environment Variable Management via CLI

```bash
# Copy environment variables between projects via CLI
vercel env add VARIABLE_NAME production
# Use printf for non-interactive input
printf "value\n" | vercel env add VARIABLE_NAME production
# List all environment variables
vercel env ls
```

#### Monorepo Build Configuration

- **DISABLE** authentication protection temporarily during development via dashboard
- **ENABLE** "Include source files outside Root Directory" in Vercel project settings (enabled by default)
- **COPY** shared dependencies into project directory to avoid monorepo import issues
- **USE** simple file copying instead of complex bundling for reliable builds

#### Build Strategy for Self-Contained Deployment

```bash
# Example build script that works for monorepo deployment
"build": "vite build && mkdir -p dist/server && cp -r server/* dist/server/ && cp -r shared dist/"
```

#### Deployment Process

1. **Research deployment patterns** using MCP Docker and Firecrawl tools
2. **Consolidate backends** into single Vercel project when possible
3. **Copy environment variables** via CLI between projects
4. **Build with self-contained dependencies** (copy shared files)
5. **Deploy via CLI** using `vercel --prod`
6. **Test all endpoints** after deployment
7. **Monitor deployment logs** using `vercel logs`

### HubSpot CLI Development Workflow

- **ALWAYS** use `@hubspot/cli@latest` for latest features and UI extensions support
- **REQUIRE** Enterprise access for developer account CLI usage (Sales or Service Hub Enterprise)
- **USE** template `display-iframe-modal` for iframe modal integration patterns
- **FOLLOW** workflow: init → auth → project create → upload
- **LIMIT** to 20 concurrent requests per installed account (public app restriction)
- **TEST** in HubSpot sandbox before production upload
- **NEVER** make direct API calls from UI Extension (use hubspot.fetch() only)

### Public App vs Private App Guidelines

- **PUBLIC APPS**: Available to all HubSpot accounts via App Marketplace
- **PRIVATE APPS**: Enterprise-only, single account installation
- **CHOOSE** public app for broader market reach and non-Enterprise account compatibility
- **CONFIGURE** OAuth with redirect URLs matching your Vercel domain exactly
- **REQUEST** minimal required scopes only (crm.objects.contacts.read, crm.objects.companies.read)
- **ENABLE** UI Extensions in app features for CRM card integration

### Vercel Deployment Workflow

- **DEPLOY** backend to Vercel before HubSpot extension upload
- **USE** `vercel env pull` to sync environment variables locally
- **SET** production environment variables in Vercel dashboard (Client ID, Client Secret)
- **CONFIGURE** custom domains and SSL certificates for production
- **MONITOR** deployment status and error rates post-deployment
- **UPDATE** HubSpot app redirect URLs to match deployed Vercel domain

### Commands to Remember

```bash
# Install dependencies for all packages
npm install

# Run development servers
npm run dev

# Run linting and formatting
npm run lint
npm run format

# Run tests
npm test

# Build all packages
npm run build

# HubSpot CLI Commands
npm install -g @hubspot/cli@latest
hs init --account=YOUR_ACCOUNT_ID
hs auth
hs project create --template=getting-started-public-app
hs project upload

# Vercel Deployment Commands (CLI-Based)
vercel link --repo                    # Link monorepo from root
vercel env ls                         # List environment variables
printf "value\n" | vercel env add VAR production  # Add env vars non-interactively
vercel --prod                         # Deploy to production
vercel logs deployment-url            # Check deployment logs
vercel domains add your-domain.com    # Add custom domain

# Upload HubSpot extension
cd packages/hubspot-extension && hs project upload
```

### HubSpot Specific Guidelines

- Always request minimal required scopes
- Handle rate limiting gracefully (429 responses)
- Support both EU and US HubSpot instances
- Test with different user permission levels
- Follow HubSpot's UI Extension approval process

### Security Checklist

- [ ] Client secrets not exposed in frontend
- [ ] Tokens encrypted before storage
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] Rate limiting implemented
- [ ] Error messages don't leak sensitive info
- [ ] HTTPS enforced for all endpoints
- [ ] No sensitive data in logs

### UI Extensions Implementation Guidelines

- **USE** `display-iframe-modal` template as starting point for iframe integration
- **IMPLEMENT** React-based UI extensions for CRM card customization
- **CONFIGURE** extensions in `app/extensions/` directory structure
- **SET** associatedObjectTypes to CONTACT and COMPANY for multi-object support
- **HANDLE** HubSpot context data (contact/company ID) properly
- **RESPECT** iframe security restrictions and cross-origin policies
- **TEST** across different portal sizes and user permission levels

### OAuth Flow Implementation Requirements

- **IMPLEMENT** PKCE (Proof Key for Code Exchange) flow for enhanced security
- **STORE** client secrets only in Vercel environment variables (never frontend)
- **ENCRYPT** access tokens before storing in Vercel KV
- **REFRESH** tokens 5 minutes before expiry to prevent auth failures
- **VALIDATE** redirect URLs match exactly between HubSpot app and Vercel deployment
- **SUPPORT** both EU and US HubSpot instances in OAuth configuration

### Environment Variable Management

- **DEVELOPMENT**: Use `vercel env pull` to sync variables locally
- **PRODUCTION**: Set via Vercel dashboard with proper encryption
- **STAGING**: Use separate environment with different OAuth app
- **REQUIRED VARIABLES**:
  - `HUBSPOT_CLIENT_ID` (public, from HubSpot app)
  - `HUBSPOT_CLIENT_SECRET` (private, from HubSpot app)
  - `HUBSPOT_REDIRECT_URI` (must match Vercel domain)
  - `HUBSPOT_SCOPES` (minimal required permissions)

### Common Pitfalls to Avoid

- Don't cache tokens longer than their expiry
- Don't assume all users have the same permissions
- Don't ignore HubSpot's rate limits (429 responses)
- Don't hardcode portal IDs or URLs
- Don't forget to handle token refresh failures
- Don't skip error handling for "happy path" code
- Don't use private app setup (Enterprise-only limitation)
- Don't exceed 20 concurrent requests per account limit
- Don't make direct API calls from UI Extension (use hubspot.fetch())
- Don't forget to update redirect URLs when deploying to new domains
- Don't create multiple Vercel projects when one consolidated backend suffices
- Don't use manual deployment when CLI tools provide better automation
- Don't assume Vercel dashboard is required for environment variables (use CLI)

### Monitoring & Alerts

- Track OAuth flow success/failure rates
- Monitor API response times
- Alert on high error rates
- Track report load times
- Monitor token refresh success rates
