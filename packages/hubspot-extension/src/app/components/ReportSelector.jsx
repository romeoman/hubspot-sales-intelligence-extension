import React, { useState } from 'react';
import { Select, Button, Text, Flex, Divider } from '@hubspot/ui-extensions';
import { UI_CONFIG } from '../utils/constants.js';

/**
 * Report selector component with dropdown and view button
 */
export function ReportSelector({
  reports,
  onReportSelect,
  loading = false,
  disabled = false,
}) {
  const [selectedReportSlug, setSelectedReportSlug] = useState('');
  const [viewLoading, setViewLoading] = useState(false);

  const handleSelectionChange = value => {
    setSelectedReportSlug(value);
  };

  const handleViewReport = async () => {
    if (!selectedReportSlug) return;

    setViewLoading(true);
    try {
      await onReportSelect(selectedReportSlug);
    } catch (error) {
      console.error('Failed to view report:', error);
      // Error is handled by parent component
    } finally {
      setViewLoading(false);
    }
  };

  const selectedReport = reports.find(report => report.slug === selectedReportSlug);

  // Create options for the select component - use slug as value, reportType as label
  const selectOptions = reports.map(report => ({
    label: `${report.reportType || 'Sales Intelligence'} Report`,
    value: report.slug,
    description: report.description,
  }));

  return (
    <Flex direction="column" gap="medium">
      <Flex direction="column" gap="small">
        <Text variant="h5">Available Reports</Text>
        <Text variant="microcopy">
          Select a report to view in a modal window
        </Text>
      </Flex>

      <Divider />

      <Flex direction="column" gap="medium">
        <Select
          label="Choose a report"
          placeholder="Select a report..."
          options={selectOptions}
          value={selectedReportSlug}
          onChange={handleSelectionChange}
          disabled={disabled || loading || reports.length === 0}
          required
        />

        {selectedReport && (
          <Flex direction="column" gap="small">
            <Text variant="microcopy" fontWeight="bold">
              Description:
            </Text>
            <Text variant="microcopy">{selectedReport.description}</Text>
            {selectedReport.reportId && (
              <Text variant="microcopy">
                Report ID: {selectedReport.reportId}
              </Text>
            )}
          </Flex>
        )}

        <Button
          onClick={handleViewReport}
          disabled={!selectedReportSlug || disabled || loading}
          loading={viewLoading}
          variant="primary"
          size="md"
        >
          {viewLoading ? 'Loading Report...' : 'View Report'}
        </Button>
      </Flex>

      {reports.length > 0 && (
        <Flex direction="column" gap="xs">
          <Divider />
          <Text variant="microcopy" align="center">
            {reports.length} report{reports.length !== 1 ? 's' : ''} available
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
