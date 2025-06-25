# Database Integration Guide

## Overview

This guide documents the database integration approach for the Sales Intelligence Report Generator, focusing on the JSONB schema design with indexed HubSpot IDs for optimal query performance in UI extensions.

## Database Provider

**Neon PostgreSQL**

- Project ID: `wandering-bush-22565063`
- Database: `neondb`
- Region: `eastus2.azure.neon.tech`
- PostgreSQL Version: 17

## Schema Design Philosophy

### Hybrid Approach: JSONB + Indexed Columns

The database schema uses a hybrid approach that combines the flexibility of JSONB storage with the performance benefits of indexed columns:

1. **JSONB Payload**: Store the complete, flexible report data structure
2. **Indexed Columns**: Extract key identifiers for fast queries
3. **Schema Versioning**: Support multiple report formats through `schema_key`

### Why This Approach?

- **Flexibility**: JSONB allows any report structure without schema migrations
- **Performance**: Indexed columns enable fast HubSpot ID lookups
- **Scalability**: Optimized for HubSpot UI extension query patterns
- **Future-Proof**: New report formats can be added without database changes

## Database Schema

```sql
-- Reports table with JSONB + indexed columns
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  schema_key VARCHAR(100) NOT NULL,
  hubspot_record_id VARCHAR(100),
  hubspot_company_id VARCHAR(100),
  hubspot_contact_id VARCHAR(100),
  original_payload JSONB,
  payload JSONB NOT NULL,
  processed_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimized indexes for HubSpot UI extension queries
CREATE INDEX idx_reports_hubspot_company_id ON reports(hubspot_company_id)
  WHERE hubspot_company_id IS NOT NULL;

CREATE INDEX idx_reports_hubspot_contact_id ON reports(hubspot_contact_id)
  WHERE hubspot_contact_id IS NOT NULL;

CREATE UNIQUE INDEX reports_slug_unique ON reports(slug);
```

## Column Descriptions

| Column               | Type         | Purpose                                        | Index       |
| -------------------- | ------------ | ---------------------------------------------- | ----------- |
| `id`                 | SERIAL       | Primary key                                    | Primary     |
| `slug`               | VARCHAR(255) | Unique report identifier for URLs              | Unique      |
| `schema_key`         | VARCHAR(100) | Report format version (e.g., "sales-intel-v1") | None        |
| `hubspot_record_id`  | VARCHAR(100) | Generic HubSpot record ID                      | None        |
| `hubspot_company_id` | VARCHAR(100) | HubSpot Company ID for queries                 | Conditional |
| `hubspot_contact_id` | VARCHAR(100) | HubSpot Contact ID for queries                 | Conditional |
| `original_payload`   | JSONB        | Raw input data (optional)                      | None        |
| `payload`            | JSONB        | Processed report data structure                | None        |
| `processed_payload`  | JSONB        | AI-enhanced data (optional)                    | None        |
| `created_at`         | TIMESTAMPTZ  | Creation timestamp                             | None        |
| `updated_at`         | TIMESTAMPTZ  | Last update timestamp                          | None        |

## JSONB Data Structure

The `payload` column stores the complete report data in JSONB format:

```json
{
  "basic_information": {
    "first_name": "string",
    "last_name": "string",
    "company_name": "string",
    "title": "string",
    "email": "string",
    "phone": "string|null",
    "linkedin_url": "string",
    "company_summary": "string",
    "profile_pic_url": "string",
    "company_logo_url": "string",
    "use_case": "string",
    "key_technologies": ["string"]
  },
  "company_context": { ... },
  "b2b_persona_messaging": { ... },
  "outreach_context": { ... },
  "segmentation_strategy": { ... },
  "outreach_executed": { ... },
  "next_steps": { ... },
  "team_expansion": { ... },
  "outreach_messages_sent": { ... },
  "sequence_start_date": "YYYY-MM-DD",
  "sequence_start_timestamp": "ISO 8601",
  "hubspot_contact_id": "string",
  "hubspot_company_id": "string",
  "tokensUsed": "number",
  "inputTokens": "number",
  "outputTokens": "number",
  "totalCostToAIProvider": "string"
}
```

## Query Patterns

### HubSpot UI Extension Queries

**Query reports by Contact ID:**

```sql
SELECT id, slug, schema_key, hubspot_company_id, hubspot_contact_id,
       payload->>'basic_information' as basic_info, created_at
FROM reports
WHERE hubspot_contact_id = $1
ORDER BY created_at DESC
LIMIT 10;
```

**Query reports by Company ID:**

```sql
SELECT id, slug, schema_key, hubspot_company_id, hubspot_contact_id,
       payload->>'basic_information' as basic_info, created_at
FROM reports
WHERE hubspot_company_id = $1
ORDER BY created_at DESC
LIMIT 10;
```

**Query reports by both Contact and Company ID:**

```sql
SELECT id, slug, schema_key, hubspot_company_id, hubspot_contact_id,
       payload->>'basic_information' as basic_info, created_at
FROM reports
WHERE hubspot_contact_id = $1 AND hubspot_company_id = $2
ORDER BY created_at DESC
LIMIT 10;
```

### JSONB Queries

**Extract specific data from JSONB:**

```sql
SELECT
  slug,
  payload->'basic_information'->>'first_name' as first_name,
  payload->'basic_information'->>'last_name' as last_name,
  payload->'basic_information'->>'company_name' as company_name,
  payload->'next_steps'->>'immediate_actions' as next_actions
FROM reports
WHERE slug = 'TEAMTAILOR_VALENTINA_BEHROUZI_cqFb';
```

## API Integration

### Connection Setup

```typescript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
```

### Query Examples

**Get Report by Slug:**

```typescript
const result = await sql`
  SELECT id, slug, schema_key, hubspot_record_id, 
         hubspot_company_id, hubspot_contact_id, 
         payload, created_at, updated_at
  FROM reports 
  WHERE slug = ${slug}
  LIMIT 1
`;
```

**Create New Report:**

```typescript
const result = await sql`
  INSERT INTO reports (
    slug, schema_key, hubspot_company_id, 
    hubspot_contact_id, payload
  ) VALUES (
    ${slug}, ${schemaKey}, ${companyId}, 
    ${contactId}, ${JSON.stringify(reportData)}::jsonb
  )
  RETURNING id, slug, created_at
`;
```

## Performance Optimization

### Index Usage

1. **Conditional Indexes**: Only index non-null HubSpot IDs to save space
2. **Compound Queries**: Optimize for common UI extension query patterns
3. **JSONB GIN Indexes**: Consider adding for complex JSONB queries if needed

### Query Optimization Tips

1. **Always use indexed columns** for WHERE clauses when possible
2. **Limit result sets** with LIMIT clauses for UI performance
3. **Order by created_at** for consistent pagination
4. **Use JSONB operators** efficiently for data extraction

## Environment Configuration

### Connection String Format

```
postgresql://username:password@host:port/database?sslmode=require
```

### Environment Variables

```bash
DATABASE_URL=postgresql://neondb_owner:npg_ZBnhG6EeK7pW@ep-yellow-violet-a81qh1e5-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
```

## Migration Strategy

### Adding New Report Formats

1. Create new `schema_key` value (e.g., "sales-intel-v2")
2. Document new JSONB structure
3. Update API validation
4. No database schema changes required

### Index Management

```sql
-- Add new indexes as needed
CREATE INDEX idx_reports_schema_key ON reports(schema_key);

-- Drop unused indexes
DROP INDEX IF EXISTS old_index_name;
```

## Monitoring and Maintenance

### Query Performance

- Monitor slow queries with Neon's query insights
- Analyze index usage with PostgreSQL statistics
- Consider JSONB GIN indexes for complex queries

### Data Integrity

- Validate JSONB structure at application level
- Monitor for orphaned records
- Regular backup verification

## Best Practices

1. **Always extract searchable fields** to indexed columns
2. **Use conditional indexes** for optional fields
3. **Validate JSONB structure** in application code
4. **Plan for schema evolution** with versioning
5. **Monitor query performance** regularly
6. **Use connection pooling** for Vercel serverless functions

## Common Pitfalls

1. **Don't query JSONB fields without indexes** in WHERE clauses
2. **Don't store large binary data** in JSONB
3. **Don't forget to handle null values** in HubSpot ID queries
4. **Don't ignore connection limits** in serverless environments

## Future Enhancements

1. **JSONB GIN Indexes**: For complex JSONB path queries
2. **Partitioning**: By date or company for large datasets
3. **Read Replicas**: For analytics and reporting
4. **Archive Strategy**: For old reports
