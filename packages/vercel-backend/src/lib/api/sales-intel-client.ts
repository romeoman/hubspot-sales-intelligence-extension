import { createLogger } from '@/lib/utils/logger';
import { ApiResponse } from '@/lib/shared';

export interface SalesIntelReportRequest {
  contactId?: string;
  companyId?: string;
  portalId?: string;
  reportData: any;
  schemaKey?: string;
  hubspotRecordId?: string;
  hubspotCompanyId?: string;
  hubspotContactId?: string;
}

export interface SalesIntelReportResponse {
  id: string;
  url: string;
  slug: string;
  hubspot_company_id?: string;
  hubspot_contact_id?: string;
  created_at: string;
  processing_time_ms: number;
}

export interface SalesIntelReportData {
  id: string;
  slug: string;
  schemaKey: string;
  hubspotRecordId?: string;
  hubspotCompanyId?: string;
  hubspotContactId?: string;
  payload: any;
  created_at: string;
  updated_at: string;
}

export class SalesIntelClient {
  private readonly baseUrl: string;
  private readonly logger = createLogger('SalesIntelClient');

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || process.env.SALES_INTEL_API_URL || 'http://localhost:3000';
  }

  /**
   * Check if the sales intelligence API is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      this.logger.error('Sales Intel API health check failed', error as Error);
      return false;
    }
  }

  /**
   * Create a new sales intelligence report
   */
  async createReport(request: SalesIntelReportRequest): Promise<SalesIntelReportResponse> {
    try {
      this.logger.info('Creating sales intelligence report', {
        contactId: request.contactId,
        companyId: request.companyId,
        portalId: request.portalId,
      });

      const payload = {
        schemaKey: request.schemaKey || 'sales-intel-v1',
        hubspotRecordId: request.contactId || request.companyId,
        hubspotCompanyId: request.companyId,
        hubspotContactId: request.contactId,
        reportData: request.reportData,
      };

      const response = await fetch(`${this.baseUrl}/api/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Sales Intel API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Report creation failed: ${result.error}`);
      }

      this.logger.info('Sales intelligence report created successfully', {
        reportId: result.data.id,
        slug: result.data.slug,
        processingTime: result.data.processing_time_ms,
      });

      return result.data;
    } catch (error) {
      this.logger.error('Failed to create sales intelligence report', error as Error, {
        contactId: request.contactId,
        companyId: request.companyId,
      });
      throw error;
    }
  }

  /**
   * Get a report by slug
   */
  async getReport(slug: string): Promise<SalesIntelReportData> {
    try {
      this.logger.info('Fetching sales intelligence report', { slug });

      const response = await fetch(`${this.baseUrl}/api/report/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Report not found');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Sales Intel API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(`Failed to fetch report: ${result.error}`);
      }

      this.logger.info('Sales intelligence report fetched successfully', {
        reportId: result.data.id,
        slug: result.data.slug,
      });

      return result.data;
    } catch (error) {
      this.logger.error('Failed to fetch sales intelligence report', error as Error, { slug });
      throw error;
    }
  }

  /**
   * Check if reports exist for given HubSpot contact/company IDs
   */
  async checkReportAvailability(params: {
    contactId?: string;
    companyId?: string;
    portalId?: string;
  }): Promise<Array<{ reportType: string; hasData: boolean; description: string; reportId?: string; slug?: string; reportUrl?: string }>> {
    try {
      this.logger.info('Checking for existing reports', {
        contactId: params.contactId,
        companyId: params.companyId,
        portalId: params.portalId,
      });

      // Check if reports exist for this contact or company
      const existingReports = await this.findReportsByHubSpotIds({
        contactId: params.contactId,
        companyId: params.companyId,
      });

      const reportTypes = existingReports.map(report => ({
        reportType: 'sales-intelligence',
        hasData: true,
        description: 'AI-powered sales intelligence report with outreach recommendations',
        reportId: report.id,
        slug: report.slug,
        reportUrl: this.generateReportUrl(report.slug),
      }));

      this.logger.info('Report availability checked', {
        contactId: params.contactId,
        companyId: params.companyId,
        availableReports: reportTypes.length,
        reports: existingReports.map(r => ({ id: r.id, slug: r.slug })),
      });

      return reportTypes;
    } catch (error) {
      this.logger.error('Failed to check report availability', error as Error, params);
      // Return empty array instead of throwing, so UI can gracefully handle no reports
      return [];
    }
  }

  /**
   * Find reports by HubSpot contact or company IDs
   */
  async findReportsByHubSpotIds(params: {
    contactId?: string;
    companyId?: string;
  }): Promise<Array<{ id: string; slug: string; created_at: string }>> {
    try {
      // We need to add an endpoint to the sales-intel-backend to search by HubSpot IDs
      // For now, this is a placeholder that we'll implement when we add the search endpoint
      
      this.logger.info('Searching for reports by HubSpot IDs', params);
      
      // TODO: Implement search endpoint in sales-intel-backend
      // This would be something like: GET /api/reports/search?hubspot_contact_id=X&hubspot_company_id=Y
      
      const searchParams = new URLSearchParams();
      if (params.contactId) {
        searchParams.append('hubspot_contact_id', params.contactId);
      }
      if (params.companyId) {
        searchParams.append('hubspot_company_id', params.companyId);
      }

      const response = await fetch(`${this.baseUrl}/api/reports/search?${searchParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No reports found - this is normal
          return [];
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Sales Intel API error: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        // If search fails, return empty array rather than throwing
        this.logger.warn('Report search returned failure', { error: result.error });
        return [];
      }

      return result.data || [];
    } catch (error) {
      this.logger.error('Failed to search for reports by HubSpot IDs', error as Error, params);
      // Return empty array instead of throwing, so UI can gracefully handle search failures
      return [];
    }
  }

  /**
   * Generate a secure URL for accessing a report
   */
  generateReportUrl(slug: string, baseUrl?: string): string {
    const reportBaseUrl = baseUrl || this.baseUrl;
    return `${reportBaseUrl}/r/${slug}`;
  }
}

// Export singleton instance
export const salesIntelClient = new SalesIntelClient();