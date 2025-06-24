export declare const HUBSPOT_SCOPES: {
    readonly CRM_CONTACTS_READ: "crm.objects.contacts.read";
    readonly CRM_COMPANIES_READ: "crm.objects.companies.read";
    readonly CRM_OBJECTS_CONTACTS_READ: "crm.objects.contacts.read";
    readonly CRM_OBJECTS_COMPANIES_READ: "crm.objects.companies.read";
};
export declare const REQUIRED_SCOPES: readonly ["crm.objects.contacts.read", "crm.objects.companies.read"];
export type HubSpotScope = (typeof HUBSPOT_SCOPES)[keyof typeof HUBSPOT_SCOPES];
//# sourceMappingURL=scopes.d.ts.map