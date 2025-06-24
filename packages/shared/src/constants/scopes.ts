export const HUBSPOT_SCOPES = {
  CRM_CONTACTS_READ: 'crm.objects.contacts.read',
  CRM_COMPANIES_READ: 'crm.objects.companies.read',
  CRM_OBJECTS_CONTACTS_READ: 'crm.objects.contacts.read',
  CRM_OBJECTS_COMPANIES_READ: 'crm.objects.companies.read',
} as const;

export const REQUIRED_SCOPES = [
  HUBSPOT_SCOPES.CRM_CONTACTS_READ,
  HUBSPOT_SCOPES.CRM_COMPANIES_READ,
] as const;

export type HubSpotScope = (typeof HUBSPOT_SCOPES)[keyof typeof HUBSPOT_SCOPES];
