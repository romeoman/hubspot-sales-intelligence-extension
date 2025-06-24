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

      // Fetch available reports from your backend
      const response = await fetch(
        `https://your-vercel-backend.vercel.app/api/reports/available?${objectType}Id=${objectId}&portalId=${context.portal.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();
      
      if (data.success && data.data?.reports) {
        setReports(data.data.reports.filter(r => r.hasData));
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

  const handleViewReport = async () => {
    if (!selectedReport) return;

    try {
      const report = reports.find(r => r.slug === selectedReport);
      if (!report) {
        throw new Error("Selected report not found");
      }

      // Generate the report URL
      let reportUrl;
      if (report.reportUrl) {
        reportUrl = report.reportUrl;
      } else {
        // Call your backend to generate a signed URL
        const response = await fetch(
          "https://your-vercel-backend.vercel.app/api/reports/generate-url",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: report.slug,
              portalId: context.portal.id,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to generate report URL");
        }

        const data = await response.json();
        reportUrl = data.data?.url;
      }

      if (!reportUrl) {
        throw new Error("No report URL available");
      }

      // Open the iframe modal
      openIframeModal({
        uri: reportUrl,
        height: 800,
        width: 1200,
        title: `Sales Intelligence Report`,
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
    label: `${report.reportType || "Sales Intelligence"} Report`,
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
            {reports.find(r => r.slug === selectedReport)?.description ||
              "AI-powered sales intelligence report"}
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