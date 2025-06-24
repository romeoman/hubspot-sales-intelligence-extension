import React, { useState } from 'react';
import { Text, Flex, Alert, hubspot } from '@hubspot/ui-extensions';

import { useReports } from '../hooks/useReports.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { ErrorState } from '../components/ErrorState.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { ReportSelector } from '../components/ReportSelector.jsx';
import { UI_CONFIG, ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Main Report Viewer component for HubSpot UI Extension
 */
const ReportViewer = ({ context, openIframeModal, fetchData }) => {
  const [modalError, setModalError] = useState(null);

  const {
    reports,
    loading,
    error,
    isAuthenticated,
    generateReportUrl,
    retryLoad,
  } = useReports(context, fetchData);

  /**
   * Handle report selection and modal opening
   */
  const handleReportSelect = async reportSlugOrId => {
    setModalError(null);

    try {
      // Find the selected report
      const selectedReport = reports.find(
        report => report.slug === reportSlugOrId || report.reportId === reportSlugOrId
      );

      if (!selectedReport) {
        throw new Error('Selected report not found');
      }

      // Use the direct report URL if available, otherwise generate one
      let reportUrl;
      if (selectedReport.reportUrl) {
        reportUrl = selectedReport.reportUrl;
      } else if (selectedReport.slug) {
        reportUrl = await generateReportUrl(selectedReport.slug);
      } else {
        throw new Error('No report URL or slug available');
      }

      const modalTitle = `Sales Intelligence Report`;

      // Open the iframe modal with the report
      openIframeModal({
        uri: reportUrl,
        height: UI_CONFIG.MODAL_HEIGHT,
        width: UI_CONFIG.MODAL_WIDTH,
        title: modalTitle,
        flush: true, // Remove default padding
      });

      console.log('Report modal opened successfully', {
        reportSlug: selectedReport.slug,
        reportId: selectedReport.reportId,
        title: modalTitle,
        url: reportUrl.substring(0, 50) + '...', // Log partial URL for debugging
      });
    } catch (error) {
      console.error('Failed to open report modal:', error);
      setModalError(error.message || ERROR_MESSAGES.REPORT_LOAD_FAILED);
    }
  };

  /**
   * Handle retry with error clearing
   */
  const handleRetry = () => {
    setModalError(null);
    retryLoad();
  };

  /**
   * Get object type for display purposes
   */
  const getObjectType = () => {
    return context?.hs_object_type === 'company' ? 'company' : 'contact';
  };

  // Show loading state
  if (loading && reports.length === 0) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error && !loading) {
    return (
      <ErrorState
        error={error}
        onRetry={handleRetry}
        isAuthenticated={isAuthenticated}
        context={context}
      />
    );
  }

  // Show empty state when no reports are available
  if (!loading && reports.length === 0 && !error) {
    return <EmptyState onRefresh={retryLoad} objectType={getObjectType()} />;
  }

  // Main component render
  return (
    <Flex direction="column" gap="medium">
      {/* Modal error alert */}
      {modalError && (
        <Alert title="Report Loading Error" variant="error">
          <Text>{modalError}</Text>
        </Alert>
      )}

      {/* Report selector */}
      <ReportSelector
        reports={reports}
        onReportSelect={handleReportSelect}
        loading={loading}
        disabled={!isAuthenticated}
      />

      {/* Loading overlay for additional reports */}
      {loading && reports.length > 0 && (
        <Flex justify="center">
          <Text variant="microcopy">Refreshing reports...</Text>
        </Flex>
      )}
    </Flex>
  );
};

// Register the UI Extension with HubSpot
hubspot.extend(({ context, actions }) => (
  <ReportViewer
    context={context}
    openIframeModal={actions.openIframeModal}
    fetchData={actions.fetchData}
  />
));

export default ReportViewer;
