import React from 'react';
import {
  LoadingSpinner as HubSpotSpinner,
  Text,
  Flex,
} from '@hubspot/ui-extensions';

/**
 * Loading spinner component with optional message
 */
export function LoadingSpinner({ message = 'Loading reports...' }) {
  return (
    <Flex direction="column" align="center" gap="medium">
      <HubSpotSpinner />
      <Text variant="microcopy">{message}</Text>
    </Flex>
  );
}
