"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateReportRequest = exports.sanitizeString = exports.isValidUrl = exports.isValidEmail = exports.isValidHubSpotId = void 0;
const isValidHubSpotId = (id) => {
    return /^\d+$/.test(id) && parseInt(id, 10) > 0;
};
exports.isValidHubSpotId = isValidHubSpotId;
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
exports.isValidEmail = isValidEmail;
const isValidUrl = (url) => {
    try {
        new URL(url);
        return true;
    }
    catch {
        return false;
    }
};
exports.isValidUrl = isValidUrl;
const sanitizeString = (str) => {
    return str.replace(/[<>\"']/g, '').trim();
};
exports.sanitizeString = sanitizeString;
const validateReportRequest = (data) => {
    const errors = [];
    if (!data.reportId) {
        errors.push('Report ID is required');
    }
    if (!data.portalId) {
        errors.push('Portal ID is required');
    }
    else if (!(0, exports.isValidHubSpotId)(data.portalId)) {
        errors.push('Invalid Portal ID format');
    }
    if (!data.contactId && !data.companyId) {
        errors.push('Either Contact ID or Company ID is required');
    }
    if (data.contactId && !(0, exports.isValidHubSpotId)(data.contactId)) {
        errors.push('Invalid Contact ID format');
    }
    if (data.companyId && !(0, exports.isValidHubSpotId)(data.companyId)) {
        errors.push('Invalid Company ID format');
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
};
exports.validateReportRequest = validateReportRequest;
//# sourceMappingURL=validation.js.map