# HubSpot Setup - Corrected Process

## Current Status ✅
- HubSpot CLI installed (version 7.4.8)
- Developer account created
- Ready to proceed with authentication

## Corrected Information
**HubSpot CLI Access**: Available to all developers (not Enterprise-only)
**Authentication Method**: Personal Access Key (not OAuth for CLI)

## Next Steps (In Order)

### 1. Complete HubSpot Authentication
```bash
cd "/Users/romeoman/Documents/Dev/HubSpot/UI Extension - Iframe Reports"
hs init
# Follow prompts to:
# - Open browser to get Personal Access Key
# - Enter the key when prompted
# - Select your HubSpot account
```

### 2. Create Public App in HubSpot Developer Portal
After authentication, you'll need to:
1. Go to https://developers.hubspot.com/
2. Navigate to "Apps" section
3. Click "Create App"
4. Choose "Public App" (not Private)
5. Configure app settings:
   - **App Name**: "Sales Intelligence Reports"
   - **Description**: "AI-powered sales intelligence reports with iframe modal display"
   - **App Type**: Public App

### 3. Configure OAuth Settings
In the app configuration:
- **Redirect URL**: `https://your-vercel-domain.vercel.app/api/auth/callback`
- **Scopes Required**:
  - `crm.objects.contacts.read`
  - `crm.objects.companies.read`
  - `crm.schemas.contacts.read`
  - `crm.schemas.companies.read`

### 4. Get App Credentials
From the app dashboard, copy:
- **Client ID**
- **Client Secret**
- **App ID**

### 5. Create HubSpot Project for UI Extension
```bash
# Create new project for UI extension
hs project create --template="react-extension"
# OR if that doesn't work:
hs project create

# Navigate to the project
cd <project-name>

# Upload our existing UI extension code
```

### 6. Configure UI Extension
Update the project with our existing code:
- Copy files from `packages/hubspot-extension/src/app/`
- Configure `hsproject.json` for:
  - Extension type: `iframe-modal`
  - Supported objects: `contacts`, `companies`
  - Extension name: "Sales Intelligence"

## Files We'll Need to Update

### Environment Variables (.env)
```env
HUBSPOT_CLIENT_ID=<from-app-creation>
HUBSPOT_CLIENT_SECRET=<from-app-creation>
HUBSPOT_APP_ID=<from-app-creation>
SALES_INTEL_API_URL=https://your-vercel-backend.vercel.app
```

### Update Constants in HubSpot Extension
```javascript
// packages/hubspot-extension/src/app/utils/constants.js
export const OAUTH_BRIDGE_URL = 'https://your-vercel-backend.vercel.app';
```

## Current CLI Commands Available
Let's check what's available after authentication:
```bash
hs --help                    # See all commands
hs project --help            # Project-specific commands
hs project create --help     # Template options
hs upload --help             # Upload commands
```

## Expected Project Structure
After creating the HubSpot project:
```
hubspot-project/
├── src/
│   ├── app/
│   │   ├── extensions/
│   │   │   └── ReportViewer.jsx    # Our main component
│   │   ├── components/
│   │   │   ├── ReportSelector.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── hooks/
│   │   │   └── useReports.js
│   │   └── utils/
│   │       ├── api.js
│   │       └── constants.js
├── hsproject.json           # HubSpot project config
└── package.json
```

## Testing Strategy
1. **Local Development**: Test with HubSpot CLI development server
2. **Upload to Sandbox**: Upload to test account first
3. **Production Deployment**: Upload to live account

## What Happens Next
After you complete the authentication (answer 'Y' to open browser):
1. Get Personal Access Key from HubSpot
2. Complete CLI setup
3. Create the public app in developer portal
4. Get OAuth credentials
5. Create HubSpot project for UI extension
6. Deploy backends to Vercel
7. Configure and upload extension

Would you like me to help you continue with the next step once you've completed the authentication?