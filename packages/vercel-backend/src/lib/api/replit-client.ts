import { config } from '@/config/environment';
import { createLogger } from '@/lib/utils/logger';
import { ReplitApiResponse } from '@/lib/shared';

export class ReplitClient {
  private logger = createLogger();
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = config.replit.apiUrl;
    this.apiKey = config.replit.apiKey;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ReplitApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('Replit API request failed', new Error(errorText), {
          status: response.status,
          statusText: response.statusText,
          url,
        });

        throw new Error(`Replit API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error('Error making Replit API request', error as Error, {
        url,
        method: options.method || 'GET',
      });
      throw error;
    }
  }

  async checkReportAvailability(params: {
    contactId?: string;
    companyId?: string;
    portalId: string;
  }): Promise<
    Array<{
      id: string;
      name: string;
      description: string;
      hasData: boolean;
      lastUpdated?: string;
    }>
  > {
    const searchParams = new URLSearchParams();

    if (params.contactId) {
      searchParams.append('contactId', params.contactId);
    }

    if (params.companyId) {
      searchParams.append('companyId', params.companyId);
    }

    searchParams.append('portalId', params.portalId);

    const endpoint = `/api/reports/availability?${searchParams.toString()}`;

    this.logger.info('Checking report availability', {
      contactId: params.contactId,
      companyId: params.companyId,
      portalId: params.portalId,
    });

    try {
      const response = await this.makeRequest<
        Array<{
          id: string;
          name: string;
          description: string;
          hasData: boolean;
          lastUpdated?: string;
        }>
      >(endpoint);

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Invalid response from Replit API');
      }

      this.logger.info('Report availability checked successfully', {
        reportCount: response.data.length,
        availableReports: response.data.filter(r => r.hasData).length,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to check report availability', error as Error);
      throw error;
    }
  }

  async generateReportUrl(params: {
    reportId: string;
    contactId?: string;
    companyId?: string;
    portalId: string;
  }): Promise<{
    url: string;
    expiresAt: string;
  }> {
    const endpoint = '/api/reports/generate-url';

    this.logger.info('Generating report URL', {
      reportId: params.reportId,
      contactId: params.contactId,
      companyId: params.companyId,
      portalId: params.portalId,
    });

    try {
      const response = await this.makeRequest<{
        url: string;
        expiresAt: string;
      }>(endpoint, {
        method: 'POST',
        body: JSON.stringify(params),
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Invalid response from Replit API');
      }

      this.logger.info('Report URL generated successfully', {
        reportId: params.reportId,
        expiresAt: response.data.expiresAt,
      });

      return response.data;
    } catch (error) {
      this.logger.error('Failed to generate report URL', error as Error);
      throw error;
    }
  }

  async validateReport(reportId: string): Promise<boolean> {
    const endpoint = `/api/reports/${reportId}/validate`;

    try {
      const response = await this.makeRequest<{ isValid: boolean }>(endpoint);

      if (!response.success || !response.data) {
        return false;
      }

      return response.data.isValid;
    } catch (error) {
      this.logger.warn('Report validation failed', {
        reportId,
        error: (error as Error).message,
      });
      return false;
    }
  }
}

export const replitClient = new ReplitClient();
