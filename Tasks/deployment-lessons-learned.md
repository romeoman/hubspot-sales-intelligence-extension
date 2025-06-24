# Vercel Monorepo Deployment - Lessons Learned

## Session Summary (June 24, 2025)

### Key Achievements
- ✅ Successfully consolidated two separate Vercel projects into one
- ✅ Implemented CLI-based deployment workflow using `vercel link --repo`
- ✅ Added OAuth endpoints to existing sales-intel-backend
- ✅ Copied environment variables via CLI between projects
- ✅ Discovered and implemented MCP Docker + Firecrawl research methodology

### Primary Lesson: Use Single Consolidated Backend

**Problem**: Initially had separate `vercel-backend` and `sales-intel-backend` projects
**Solution**: Consolidated OAuth functionality into existing `sales-intel-backend`
**Benefit**: Simpler architecture, easier maintenance, single deployment target

### CLI-Based Environment Variable Management

**Discovery**: All environment variables can be managed via CLI, not just dashboard

```bash
# List environment variables
vercel env ls

# Add environment variables non-interactively  
printf "value\n" | vercel env add VARIABLE_NAME production

# Copy variables between projects programmatically
# (Get values from one project, set in another)
```

### Vercel Monorepo Deployment Strategy

**Key Findings from MCP Docker/Firecrawl Research**:

1. **`vercel link --repo` (Alpha Feature)**: Links entire monorepo for better CLI context
2. **"Include source files outside Root Directory"**: Enabled by default, critical for monorepo builds
3. **Self-contained builds**: Copy shared dependencies to avoid import resolution issues
4. **Simple file copying > Complex bundling**: Reliability over optimization for deployment

### Build Configuration That Works

```json
{
  "scripts": {
    "build": "vite build && mkdir -p dist/server && cp -r server/* dist/server/ && cp -r shared dist/",
    "start": "NODE_ENV=production node dist/server/index.js"
  }
}
```

### Research Methodology Success

**MCP Docker + Firecrawl Approach**:
- Deep research into Vercel documentation revealed alpha features
- Found Stack Overflow solutions for monorepo challenges  
- Discovered community best practices for shared package handling
- Located official Vercel guidelines for monorepo deployment

### OAuth Integration Pattern

**Added to existing backend instead of separate service**:

```typescript
// Added OAuth endpoints to sales-intel-backend/server/routes.ts
app.get("/api/auth/install", ...)      // OAuth installation
app.get("/api/auth/callback", ...)     // OAuth callback  
app.get("/api/auth/status", ...)       // Token status

// Dependencies added:
// @hubspot/api-client, jsonwebtoken, @types/jsonwebtoken
```

### Environment Variables Required

```bash
HUBSPOT_CLIENT_ID=1091838806
HUBSPOT_CLIENT_SECRET=1c3c18c5-d993-4a70-9024-0b67a3d5e76e  
HUBSPOT_APP_ID=1091838806
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
OPENAI_API_KEY=...
DATABASE_URL=...
```

### Deployment Workflow That Works

1. **Research first**: Use MCP Docker + Firecrawl for deployment patterns
2. **Consolidate**: Combine multiple backends into single project when possible  
3. **Link repo**: Run `vercel link --repo` from monorepo root
4. **Copy dependencies**: Self-contained builds with copied shared files
5. **Set environment variables**: Use CLI with printf for automation
6. **Deploy**: `vercel --prod` from project directory
7. **Test endpoints**: Verify all APIs work after deployment

### Common Issues Solved

**Shared Package Import Errors**:
- Copy shared directory into project: `cp -r ../shared ./`
- Update imports: `"@shared/schema"` → `"../shared/src/schema"`

**Monorepo Build Context Issues**:
- Use `vercel link --repo` for proper context
- Enable "Include source files outside Root Directory" (default enabled)

**Environment Variable Management**:
- All variables can be set via CLI, not just dashboard
- Use printf for non-interactive automation

### Architecture Evolution

**Before**: 
```
packages/
├── hubspot-extension/     # UI Extension
├── vercel-backend/        # OAuth API  
├── sales-intel-backend/   # Report generation
└── shared/               # Common types
```

**After**:
```  
packages/
├── hubspot-extension/     # UI Extension
├── sales-intel-backend/   # Consolidated Backend (OAuth + Reports)
└── shared/               # Common types
```

### Next Session Recommendations

1. **Test OAuth flow end-to-end** with HubSpot extension
2. **Implement proper token storage** (currently demo implementation)
3. **Add error handling** for runtime configuration issues
4. **Set up monitoring** for the consolidated backend
5. **Update HubSpot extension URLs** to point to consolidated backend

### Tools Used Successfully

- **MCP Docker**: Deep research into Vercel documentation and Stack Overflow
- **Firecrawl**: Web scraping for deployment best practices  
- **Vercel CLI**: All deployment and environment management
- **HubSpot CLI**: UI extension development and upload

### Key Commands to Remember

```bash
# Research deployment patterns
# (Use MCP Docker tools for documentation research)

# Link monorepo
vercel link --repo

# Environment variables
vercel env ls
printf "value\n" | vercel env add VAR production

# Deploy consolidated backend
cd packages/sales-intel-backend
vercel --prod

# Test endpoints
curl https://deployment-url/api/health
curl https://deployment-url/api/auth/install
```

### Success Metrics

- ✅ Single consolidated backend deployed successfully
- ✅ All environment variables copied via CLI
- ✅ OAuth endpoints added and deployed
- ✅ Build process working with self-contained dependencies
- ✅ Deep research methodology established with MCP tools

---

## Status: Ready for OAuth Flow Testing

The consolidated backend is deployed with all necessary endpoints and environment variables. Next step is end-to-end OAuth flow testing with the HubSpot extension.