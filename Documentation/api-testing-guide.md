# Sales Intelligence API Testing Guide

## Overview

This guide provides comprehensive testing instructions for the Sales Intelligence API that was migrated from Replit to Vercel with an independent Neon PostgreSQL database.

## Prerequisites

### Environment Setup

1. **Node.js**: Version 18 or higher
2. **Environment Variables**: Configured `.env` file
3. **Database**: Neon PostgreSQL connection
4. **Dependencies**: Installed packages

### Required Environment Variables

```env
DATABASE_URL=postgresql://username:password@your-neon-host.neon.tech/database_name?sslmode=require
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_here
```

## Local Development Setup

### Step 1: Install Dependencies

```bash
cd packages/sales-intel-backend
npm install
```

### Step 2: Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

### Step 3: Start Development Server

```bash
npm run dev
```

Server should start on `http://localhost:3000`

## API Endpoint Testing

### 1. Health Check Test

**Endpoint**: `GET /api/health`

```bash
curl -X GET http://localhost:3000/api/health
```

**Expected Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-06-24T10:30:00.000Z"
}
```

### 2. Schema Endpoints Test

**List Available Schemas**:

```bash
curl -X GET http://localhost:3000/api/schemas
```

**Get Specific Schema**:

```bash
curl -X GET http://localhost:3000/api/schemas/sales-intel-v1
```

### 3. Report Creation Tests

#### Test A: JSONB Mode (Flexible Data)

```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "schemaKey": "sales-intel-v1",
    "hubspotCompanyId": "test-company-123",
    "hubspotContactId": "test-contact-456",
    "reportData": {
      "sequence_start_date": "2024-06-24",
      "sequence_start_timestamp": "2024-06-24T10:30:00Z",
      "hubspot_company_id": "test-company-123",
      "hubspot_contact_id": "test-contact-456",
      "basic_information": {
        "first_name": "Test",
        "last_name": "User",
        "title": "Software Engineer",
        "company_name": "TestCorp",
        "company_summary": "A test company for API validation",
        "use_case": "API Testing and Development",
        "key_technologies": ["React", "Node.js", "PostgreSQL"],
        "linkedin_url": "https://linkedin.com/in/testuser",
        "email": "test@testcorp.com"
      },
      "company_context": {
        "business_model": "SaaS Product Company",
        "company_type": "Scaleup",
        "use_case_detail": "Testing the sales intelligence API",
        "use_case_justification": "Ensuring proper functionality",
        "tech_insights": "Modern tech stack with React and Node.js",
        "key_messaging_approach": "Technical excellence focus",
        "custom_signals_detected": ["API testing", "Development focus"]
      },
      "outreach_executed": {
        "sequence_timeline": "Day 1: Initial API test, Day 2: Validation, Day 3: Integration"
      }
    }
  }'
```

**Expected Response**:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "url": "http://localhost:3000/r/TESTCORP_TEST_USER_xxxx",
    "slug": "TESTCORP_TEST_USER_xxxx",
    "hubspot_company_id": "test-company-123",
    "hubspot_contact_id": "test-contact-456",
    "created_at": "2025-06-24T10:30:00.000Z",
    "processing_time_ms": 150
  }
}
```

#### Test B: Schema Validation Mode

```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "schemaKey": "sales-intel-v1",
    "payload": {
      "sequence_start_date": "2024-06-24",
      "basic_information": {
        "first_name": "Schema",
        "last_name": "Test",
        "title": "QA Engineer",
        "company_name": "ValidCorp",
        "company_summary": "Schema validation test",
        "use_case": "Schema testing",
        "key_technologies": ["TypeScript", "Zod"],
        "linkedin_url": "https://linkedin.com/in/schematest"
      }
    }
  }'
```

### 4. Report Retrieval Tests

#### Get Report Data (JSON)

```bash
# Replace SLUG with actual slug from creation response
curl -X GET http://localhost:3000/api/report/TESTCORP_TEST_USER_xxxx
```

#### View Report Dashboard (HTML)

```bash
# Open in browser or use curl to test HTML response
curl -X GET http://localhost:3000/r/TESTCORP_TEST_USER_xxxx
```

## Database Testing

### Verify Database Connection

```bash
# Test database connectivity using MCP tools
npm run db:push
```

### Check Report Storage

After creating reports, verify they are stored correctly in the Neon database:

1. **Check Tables Exist**:
   - users
   - schemas
   - reports

2. **Verify Data Storage**:
   - Reports saved with correct slug
   - JSONB data preserved exactly
   - HubSpot integration fields populated
   - Timestamps generated correctly

## Error Testing

### Test Invalid Data

```bash
# Test missing required data
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "schemaKey": "sales-intel-v1"
  }'
```

**Expected**: 400 Bad Request

### Test Invalid Schema

```bash
# Test with invalid schema key
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "schemaKey": "invalid-schema",
    "reportData": {"test": "data"}
  }'
```

### Test Non-existent Report

```bash
# Test retrieving non-existent report
curl -X GET http://localhost:3000/api/report/NONEXISTENT_SLUG_xxxx
```

**Expected**: 404 Not Found

## Performance Testing

### Response Time Testing

```bash
# Test multiple requests to measure response time
for i in {1..5}; do
  time curl -X POST http://localhost:3000/api/report \
    -H "Content-Type: application/json" \
    -d '{"schemaKey": "sales-intel-v1", "reportData": {"sequence_start_date": "2024-06-24", "basic_information": {"first_name": "Test'$i'", "last_name": "User", "company_name": "TestCorp"}}}'
done
```

### Database Performance

- Monitor query execution time
- Check connection pool usage
- Verify memory usage patterns

## Integration Testing

### HubSpot Context Testing

Test with realistic HubSpot data structure:

```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "schemaKey": "sales-intel-v1",
    "hubspotRecordId": "contact_12345",
    "hubspotCompanyId": "company_67890",
    "hubspotContactId": "contact_12345",
    "reportData": {
      "sequence_start_date": "2024-06-24",
      "hubspot_company_id": "company_67890",
      "hubspot_contact_id": "contact_12345",
      "basic_information": {
        "first_name": "John",
        "last_name": "Smith",
        "title": "VP of Engineering",
        "company_name": "TechCorp Inc",
        "company_summary": "Leading technology company specializing in AI solutions",
        "use_case": "Scaling engineering teams with modern DevOps practices",
        "key_technologies": ["Kubernetes", "Docker", "React", "Python"],
        "linkedin_url": "https://linkedin.com/in/johnsmith-tech",
        "company_linkedin_url": "https://linkedin.com/company/techcorp",
        "email": "john.smith@techcorp.com"
      }
    }
  }'
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL is correct
   - Check Neon database is running
   - Validate network connectivity

2. **Environment Variable Issues**
   - Ensure .env file exists
   - Verify all required variables are set
   - Check for typos in variable names

3. **Port Conflicts**
   - Change PORT in .env if 3000 is occupied
   - Restart development server

4. **OpenAI API Errors**
   - Verify OPENAI_API_KEY is valid
   - Check API quota and limits
   - Monitor usage in OpenAI dashboard

### Debug Commands

```bash
# Check environment variables
npm run check

# Verify TypeScript compilation
npm run build

# Database connectivity test
npm run db:push
```

## Testing Checklist

- [ ] Health endpoint responds correctly
- [ ] Schema endpoints return valid data
- [ ] Report creation works with JSONB mode
- [ ] Report creation works with schema validation
- [ ] Report retrieval returns correct data
- [ ] Frontend report display renders properly
- [ ] Error handling works for invalid requests
- [ ] Database stores data correctly
- [ ] HubSpot integration fields are preserved
- [ ] Performance meets requirements (≤ 200ms p95)

## Next Steps

After successful API testing:

1. Deploy to Vercel staging environment
2. Test with production Neon database
3. Integrate with HubSpot UI Extension
4. Perform end-to-end testing
5. Configure production monitoring
