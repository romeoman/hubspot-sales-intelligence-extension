# HubSpot CLI Research & Implementation Guide

## Overview

Comprehensive research findings on HubSpot CLI for building public apps with UI extensions, based on official documentation and examples.

## Prerequisites

### Account Requirements
- **Developer Account**: HubSpot developer account at https://developers.hubspot.com/
- **Enterprise Access**: Sales or Service Hub Enterprise access for CLI usage
- **Beta Enrollment**: Account must be enrolled in CRM development tools public beta

### Technical Requirements
- **Node.js**: Latest LTS version with npm
- **HubSpot CLI**: `@hubspot/cli@latest` (critical for UI extensions support)
- **Git**: For version control and project management

## HubSpot CLI Installation & Setup

### 1. Install Latest CLI
```bash
npm install -g @hubspot/cli@latest
```

### 2. Initialize Configuration
```bash
# Initialize with your account ID
hs init --account=YOUR_ACCOUNT_ID

# Or initialize and follow prompts
hs init
```

### 3. Authenticate Account
```bash
# Authenticate with personal access key
hs auth

# List and switch between accounts
hs accounts
hs accounts use ACCOUNT_NAME
```

## Project Creation & Templates

### Available Templates
- `getting-started-public-app`: Basic public app with UI extensions
- `display-iframe-modal`: Iframe modal integration example
- UI extensions examples repository: `HubSpot/ui-extensions-examples`

### Create Project from Template
```bash
# Basic public app template
hs project create --template=getting-started-public-app

# Iframe modal example template
hs project create --templateSource="HubSpot/ui-extensions-examples" \
  --dest="display-iframe-modal" \
  --name="display-iframe-modal" \
  --template="display-iframe-modal"
```

### Project Structure
```
project-name/
├── src/
│   └── app/
│       ├── app.json              # App configuration
│       ├── components/           # React components
│       └── extensions/           # UI extension definitions
│           ├── extension.jsx     # Extension component
│           └── extension.json    # Extension configuration
├── hsproject.json                # HubSpot project config
├── package.json
└── README.md
```

## UI Extensions Implementation

### Extension Configuration (extension.json)
```json
{
  "type": "crm-card",
  "data": {
    "title": "Sales Intelligence Report",
    "location": {
      "type": "crm-record",
      "objectType": ["CONTACT", "COMPANY"]
    }
  }
}
```

### Extension Component (extension.jsx)
```jsx
import React from 'react';
import { Button, Text, hubspot } from '@hubspot/ui-extensions';

const Extension = () => {
  const handleGenerateReport = () => {
    // Use hubspot.fetch() for API calls (REQUIRED)
    hubspot.fetch('/api/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ contactId: context.crm.objectId })
    });
  };

  return (
    <div>
      <Text>Generate Sales Intelligence Report</Text>
      <Button onClick={handleGenerateReport}>
        Generate Report
      </Button>
    </div>
  );
};

export default Extension;
```

## Public App vs Private App

### Public Apps
- **Availability**: All HubSpot accounts via App Marketplace
- **Installation**: Multiple accounts can install
- **Development**: Requires CLI for UI extensions
- **Limitations**: 20 concurrent requests per installed account
- **OAuth**: Full OAuth flow required
- **Best for**: Marketplace distribution, broader reach

### Private Apps
- **Availability**: Single account only
- **Requirements**: Enterprise Hub access required
- **Development**: Simpler setup, no CLI needed for basic apps
- **Limitations**: Cannot be distributed
- **OAuth**: Simplified token-based auth
- **Best for**: Internal tools, Enterprise customers

## OAuth Configuration for Public Apps

### Required Settings
```bash
# App configuration in HubSpot Developer Portal
Redirect URLs:
- Development: http://localhost:3000/auth/hubspot/callback
- Production: https://your-vercel-domain.vercel.app/auth/hubspot/callback

Required Scopes:
- crm.objects.contacts.read
- crm.objects.companies.read
- crm.schemas.contacts.read (if needed)

Security:
- PKCE flow required
- Client secret must stay server-side
```

### Environment Variables
```bash
HUBSPOT_CLIENT_ID=your_client_id_here
HUBSPOT_CLIENT_SECRET=your_client_secret_here
HUBSPOT_REDIRECT_URI=https://your-domain.vercel.app/auth/hubspot/callback
HUBSPOT_SCOPES=crm.objects.contacts.read,crm.objects.companies.read
```

## Deployment Workflow

### 1. Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test extension locally
hs project dev
```

### 2. Upload to HubSpot
```bash
# Upload project to HubSpot
hs project upload

# Check build status
hs project status
```

### 3. Production Deployment
1. Deploy backend to Vercel first
2. Update HubSpot app redirect URLs
3. Upload HubSpot extension
4. Test in HubSpot environment
5. Submit for marketplace review (optional)

## Security & Limitations

### UI Extension Security
- **API Calls**: Must use `hubspot.fetch()` only
- **Direct API**: No direct external API calls allowed
- **CORS**: Handled automatically by HubSpot
- **Context**: Access to CRM record context only

### Public App Limitations
- **Concurrent Requests**: Max 20 per installed account
- **Rate Limiting**: HubSpot API rate limits apply
- **Scopes**: Request minimal required permissions only
- **Data Access**: Only data within granted scopes

## Testing & Debugging

### Local Testing
```bash
# Test extension in development
hs project dev

# View logs
hs logs

# Debug build issues
hs project build --debug
```

### HubSpot Environment Testing
1. Install app in test account
2. Navigate to contact/company record
3. Add app card to record layout
4. Test extension functionality
5. Monitor error logs in developer portal

## Common Issues & Solutions

### CLI Authentication Issues
```bash
# Clear auth and re-authenticate
hs auth --clear
hs auth

# Check account configuration
hs accounts list
```

### Build Failures
- Ensure all dependencies are installed
- Check for TypeScript/ESLint errors
- Verify extension configuration files
- Review build logs for specific errors

### Extension Not Appearing
- Verify app is installed in account
- Check record customization settings
- Ensure app card is added to layout
- Confirm extension configuration

## Best Practices

### Development
- Use TypeScript for better type safety
- Follow HubSpot's design system guidelines
- Implement proper error handling
- Test across different portal sizes

### Security
- Never expose client secrets in frontend
- Implement proper token refresh logic
- Use HTTPS for all redirect URLs
- Validate all user inputs

### Performance
- Minimize bundle size
- Implement lazy loading where possible
- Cache API responses appropriately
- Monitor API usage to stay within limits

## Resources

- [HubSpot Developer Portal](https://developers.hubspot.com/)
- [CLI Documentation](https://developers.hubspot.com/docs/platform/project-cli-commands)
- [UI Extensions Guide](https://developers.hubspot.com/docs/guides/crm/ui-extensions)
- [Examples Repository](https://github.com/HubSpot/ui-extensions-examples)
- [Public App Quickstart](https://developers.hubspot.com/docs/guides/crm/public-apps/quickstart)

## Next Steps

1. Complete HubSpot developer account setup
2. Create public app with OAuth configuration
3. Implement UI extension using iframe modal template
4. Deploy backend to Vercel
5. Upload extension via CLI
6. Test complete integration flow