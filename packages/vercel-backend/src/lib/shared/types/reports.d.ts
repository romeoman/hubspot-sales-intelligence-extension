export interface ReportConfig {
    id: string;
    name: string;
    description: string;
    endpoint: string;
    requiredContext: ('contactId' | 'companyId')[];
    permissions: string[];
    isActive: boolean;
}
export interface ReportAvailabilityRequest {
    contactId?: string;
    companyId?: string;
    portalId: string;
}
export interface ReportAvailabilityResponse {
    reports: Array<{
        id: string;
        name: string;
        description: string;
        hasData: boolean;
        lastUpdated?: string;
    }>;
}
export interface GenerateReportUrlRequest {
    reportId: string;
    contactId?: string;
    companyId?: string;
    portalId: string;
}
export interface GenerateReportUrlResponse {
    url: string;
    expiresAt: string;
    reportId?: string;
    slug?: string;
}
export interface ReplitApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: string;
}
//# sourceMappingURL=reports.d.ts.map