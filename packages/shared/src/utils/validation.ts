export const isValidHubSpotId = (id: string): boolean => {
  return /^\d+$/.test(id) && parseInt(id, 10) > 0;
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeString = (str: string): string => {
  return str.replace(/[<>\"']/g, '').trim();
};

export const validateReportRequest = (data: {
  reportId?: string;
  contactId?: string;
  companyId?: string;
  portalId?: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.reportId) {
    errors.push('Report ID is required');
  }

  if (!data.portalId) {
    errors.push('Portal ID is required');
  } else if (!isValidHubSpotId(data.portalId)) {
    errors.push('Invalid Portal ID format');
  }

  if (!data.contactId && !data.companyId) {
    errors.push('Either Contact ID or Company ID is required');
  }

  if (data.contactId && !isValidHubSpotId(data.contactId)) {
    errors.push('Invalid Contact ID format');
  }

  if (data.companyId && !isValidHubSpotId(data.companyId)) {
    errors.push('Invalid Company ID format');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
