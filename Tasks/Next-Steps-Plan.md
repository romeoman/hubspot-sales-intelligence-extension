# Next Steps Plan - HubSpot UI Extension Project

## Current Status
- ✅ Sales Intelligence Backend: Fully migrated and working
- ✅ Integration Testing: Complete
- ✅ UI Extension: Updated for report display only
- ✅ Documentation: Comprehensive guides created
- ⏳ HubSpot Setup: Waiting for user action
- 📋 Deployment: Ready but pending

## Immediate Next Steps (User Actions Required)

### 1. HubSpot Developer Account Setup
**Priority: CRITICAL - Blocking all other tasks**
- Sign up at https://developers.hubspot.com/
- **IMPORTANT**: Need Enterprise access for CLI usage
- If no Enterprise access, will need to use alternative deployment methods

### 2. Create HubSpot Public App
**Priority: HIGH**
- Follow guide in `/Tasks/9-HubSpot-Public-App-Setup.txt`
- Choose "Public App" (not Private - that's Enterprise only)
- Configure basic settings:
  - App name: "Sales Intelligence Reports"
  - Description: "View AI-powered sales intelligence reports"

### 3. Provide OAuth Credentials
**Priority: HIGH**
- After creating app, provide:
  - Client ID
  - Client Secret
  - App ID
- These will be used for OAuth implementation

## Technical Next Steps (After User Provides Credentials)

### 4. Deploy Vercel Backend
**Priority: HIGH**
**Time Estimate: 30 minutes**
```bash
# Deploy backend
cd packages/vercel-backend
vercel --prod

# Set environment variables in Vercel dashboard:
HUBSPOT_CLIENT_ID=<from-user>
HUBSPOT_CLIENT_SECRET=<from-user>
SALES_INTEL_API_URL=<deployed-sales-intel-url>
NEXTAUTH_SECRET=<generate-random>
VERCEL_KV_REST_API_URL=<from-vercel>
VERCEL_KV_REST_API_TOKEN=<from-vercel>
```

### 5. Deploy Sales Intel Backend
**Priority: HIGH**
**Time Estimate: 30 minutes**
```bash
# Deploy sales-intel-backend
cd packages/sales-intel-backend
vercel --prod

# Set environment variables:
DATABASE_URL=<neon-connection-string>
OPENAI_API_KEY=<existing-key>
NODE_ENV=production
```

### 6. Implement OAuth Flow
**Priority: HIGH**
**Time Estimate: 2-3 hours**
- Implement PKCE flow in vercel-backend
- Add token exchange endpoint
- Update token manager for real tokens
- Add refresh token logic
- Test with HubSpot sandbox

### 7. Create HubSpot CLI Project
**Priority: MEDIUM**
**Time Estimate: 1-2 hours**

If user has Enterprise access:
```bash
npm install -g @hubspot/cli@latest
hs auth
hs project create --template="display-iframe-modal"
```

If no Enterprise access:
- Package extension manually
- Upload through developer portal UI
- Configure UI extension settings manually

### 8. Configure UI Extension
**Priority: MEDIUM**
**Time Estimate: 1 hour**
- Update production URLs in constants.js
- Configure CRM card settings:
  - Object types: Contacts, Companies
  - Display location: Middle column
  - Title: "Sales Intelligence"

### 9. Upload and Test
**Priority: MEDIUM**
**Time Estimate: 1-2 hours**
- Upload extension to HubSpot
- Test in sandbox account
- Verify OAuth flow
- Test report display
- Check error handling

## Architecture Decisions Already Made

### Report Flow
1. **External Creation**: Reports created via POST to sales-intel-backend
   - Endpoint: `POST /api/report`
   - Includes HubSpot IDs in request
   - Returns slug for accessing report

2. **HubSpot Display**: Extension searches for existing reports
   - Searches by contact/company ID
   - Displays list of available reports
   - Opens reports in iframe modal

### Security Model
- OAuth tokens encrypted before storage
- PKCE flow for enhanced security
- Tokens stored in Vercel KV
- 5-minute refresh before expiry

### API Structure
```
vercel-backend (OAuth Bridge)
├── /api/auth/install     → OAuth initiation
├── /api/auth/callback    → Token exchange
├── /api/auth/refresh     → Token refresh
├── /api/reports/available → Search existing reports
└── /api/reports/generate-url → Get signed URLs

sales-intel-backend (Report Storage)
├── /api/report          → Create new report
├── /api/report/:slug    → Get report data
└── /api/reports/search  → Find by HubSpot IDs
```

## Testing Strategy

### Local Testing (Current)
- ✅ Database connectivity
- ✅ Search functionality
- ✅ API integration
- ⏳ OAuth flow (needs credentials)

### Staging Testing (Next)
- Deploy to Vercel preview
- Test with HubSpot sandbox
- Verify token management
- Test error scenarios

### Production Testing
- Limited rollout to test account
- Monitor error rates
- Check performance metrics
- Gradual rollout to users

## Risk Mitigation

### No Enterprise Access Scenario
If user doesn't have Enterprise access:
1. Manual packaging of extension
2. Upload through developer portal
3. No CLI automation available
4. More manual configuration required

### Alternative Approaches
- Consider using HubSpot's new Extensions SDK (beta)
- Explore serverless functions for simpler deployment
- Use HubSpot's native storage if needed

## Success Metrics
- [ ] OAuth flow completes successfully
- [ ] Reports display in HubSpot CRM
- [ ] Search returns correct reports
- [ ] Error handling works gracefully
- [ ] Performance under 2s load time
- [ ] Token refresh works automatically

## Timeline Estimate
Assuming user provides credentials today:
- Day 1: Deploy backends, implement OAuth
- Day 2: Create HubSpot project, configure extension
- Day 3: Testing and bug fixes
- Day 4: Production deployment

**Total: 3-4 days of development work**

## Questions for User
1. Do you have Enterprise HubSpot access?
2. Have you created a developer account yet?
3. Do you have a HubSpot sandbox for testing?
4. What's your target go-live date?
5. Do you need help creating the HubSpot app?