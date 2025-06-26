import React, { useState, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Select,
  Alert,
  LoadingSpinner,
  Divider,
  hubspot,
} from "@hubspot/ui-extensions";

// Initialize the extension
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <SalesIntelCard
    context={context}
    fetchData={runServerlessFunction}
    openIframeModal={actions.openIframeModal}
  />
));

const SalesIntelCard = ({ context, fetchData, openIframeModal }) => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load available reports on component mount
  useEffect(() => {
    loadReports();
  }, [context.crm?.objectId, context.crm?.objectTypeId]);

  const loadReports = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get object type and ID from context
      const objectType = context.crm?.objectTypeId === "0-1" ? "contact" : "company";
      const objectId = context.crm?.objectId;

      if (!objectId) {
        throw new Error("No object ID found in context");
      }

      // Build query parameters based on object type
      let queryParams = "";
      if (objectType === "contact") {
        queryParams = `contactId=${objectId}`;
        
        // If viewing a contact, also check for associated company
        const associations = context.crm?.associations;
        if (associations?.company && associations.company.length > 0) {
          const companyId = associations.company[0].id;
          queryParams += `&companyId=${companyId}`;
        }
      } else {
        queryParams = `companyId=${objectId}`;
      }

      // Fetch available reports from your backend using hubspot.fetch
      const response = await hubspot.fetch(
        `https://sales-intel.mandigital.dev/api/reports/by-hubspot-id?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      
      if (data.success && data.data?.reports) {
        // Map the reports to include the full report URL
        const mappedReports = data.data.reports.map(report => ({
          ...report,
          reportUrl: `https://sales-intel.mandigital.dev${report.reportUrl}`,
          hasData: true,
          reportType: report.schemaKey === 'sales-intel-v1' ? 'Sales Intelligence' : 'Report',
          description: `${report.basicInfo.firstName} ${report.basicInfo.lastName} - ${report.basicInfo.companyName}`
        }));
        setReports(mappedReports);
      } else {
        setReports([]);
      }
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.message || "Failed to load reports");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = () => {
    if (!selectedReport) return;

    try {
      const report = reports.find(r => r.slug === selectedReport);
      if (!report) {
        throw new Error("Selected report not found");
      }

      if (!report.reportUrl) {
        throw new Error("No report URL available");
      }

      // Open the iframe modal with the report URL
      openIframeModal({
        uri: report.reportUrl,
        height: 900,
        width: 1400,
        title: `Sales Intelligence Report - ${report.basicInfo.firstName} ${report.basicInfo.lastName}`,
        flush: true,
      });
    } catch (err) {
      console.error("Error opening report:", err);
      setError(err.message || "Failed to open report");
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Flex direction="column" align="center" gap="medium">
        <LoadingSpinner label="Loading reports..." />
      </Flex>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert title="Error" variant="error">
        <Text>{error}</Text>
        <Button onClick={loadReports} variant="secondary" size="small">
          Try Again
        </Button>
      </Alert>
    );
  }

  // Show empty state
  if (reports.length === 0) {
    return (
      <Flex direction="column" gap="medium">
        <Alert title="No Reports Available" variant="info">
          <Text>
            No sales intelligence reports are available for this{" "}
            {context.crm?.objectTypeId === "0-1" ? "contact" : "company"}.
          </Text>
        </Alert>
        <Button onClick={loadReports} variant="secondary">
          Refresh
        </Button>
      </Flex>
    );
  }

  // Show report selector
  const reportOptions = reports.map((report) => ({
    label: report.description || `${report.reportType || "Sales Intelligence"} Report`,
    value: report.slug,
  }));

  return (
    <Flex direction="column" gap="medium">
      <Flex direction="column" gap="small">
        <Text format={{ fontWeight: "bold" }}>Available Reports</Text>
        <Text variant="microcopy">
          Select a report to view in a modal window
        </Text>
      </Flex>

      <Divider />

      <Select
        label="Choose a report"
        placeholder="Select a report..."
        options={reportOptions}
        value={selectedReport}
        onChange={(value) => setSelectedReport(value)}
        required={true}
      />

      {selectedReport && (
        <Flex direction="column" gap="small">
          <Text variant="microcopy" format={{ fontWeight: "bold" }}>
            Selected Report
          </Text>
          <Text variant="microcopy">
            Created: {new Date(reports.find(r => r.slug === selectedReport)?.created_at).toLocaleDateString()}
          </Text>
        </Flex>
      )}

      <Flex direction="row" gap="small">
        <Button
          onClick={handleViewReport}
          disabled={!selectedReport}
          variant="primary"
        >
          View Report
        </Button>
        <Button onClick={loadReports} variant="secondary">
          Refresh
        </Button>
      </Flex>

      <Divider />

      <Text variant="microcopy" align="center">
        {reports.length} report{reports.length !== 1 ? "s" : ""} available
      </Text>
    </Flex>
  );
};

export default SalesIntelCard;