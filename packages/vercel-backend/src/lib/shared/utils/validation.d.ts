export declare const isValidHubSpotId: (id: string) => boolean;
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidUrl: (url: string) => boolean;
export declare const sanitizeString: (str: string) => string;
export declare const validateReportRequest: (data: {
    reportId?: string;
    contactId?: string;
    companyId?: string;
    portalId?: string;
}) => {
    isValid: boolean;
    errors: string[];
};
//# sourceMappingURL=validation.d.ts.map