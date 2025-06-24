import React from 'react';
import { Text, Button, Flex, Image } from '@hubspot/ui-extensions';

/**
 * Empty state component when no reports are available
 */
export function EmptyState({ onRefresh, objectType = 'record' }) {
  return (
    <Flex direction="column" align="center" gap="medium">
      <Image
        src="https://static.hsappstatic.net/ui-extensions-samples/static/media/empty-state.svg"
        alt="No reports available"
        width={120}
        height={120}
      />

      <Flex direction="column" align="center" gap="small">
        <Text variant="h4">No Reports Available</Text>
        <Text variant="microcopy" align="center">
          There are no reports with data for this {objectType}. Reports will
          appear here once data is available.
        </Text>
      </Flex>

      <Button onClick={onRefresh} variant="secondary" size="sm">
        Refresh
      </Button>
    </Flex>
  );
}
