"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REQUIRED_SCOPES = exports.HUBSPOT_SCOPES = void 0;
exports.HUBSPOT_SCOPES = {
    CRM_CONTACTS_READ: 'crm.objects.contacts.read',
    CRM_COMPANIES_READ: 'crm.objects.companies.read',
    CRM_OBJECTS_CONTACTS_READ: 'crm.objects.contacts.read',
    CRM_OBJECTS_COMPANIES_READ: 'crm.objects.companies.read',
};
exports.REQUIRED_SCOPES = [
    exports.HUBSPOT_SCOPES.CRM_CONTACTS_READ,
    exports.HUBSPOT_SCOPES.CRM_COMPANIES_READ,
];
//# sourceMappingURL=scopes.js.map