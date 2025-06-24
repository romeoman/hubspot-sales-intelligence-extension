import React from 'react';
import { Text, Button, Flex, Alert } from '@hubspot/ui-extensions';
import { ERROR_MESSAGES, API_ENDPOINTS } from '../utils/constants.js';

/**
 * Error state component with retry and authentication options
 */
export function ErrorState({ error, onRetry, isAuthenticated, context }) {
  const isAuthError =
    error?.includes('connect') || error?.includes('authenticate');

  const handleConnectAccount = () => {
    const portalId = context.portalId || context.portal?.id;
    if (portalId) {
      const installUrl = `${API_ENDPOINTS.AUTH_INSTALL}?portalId=${portalId}`;
      window.open(installUrl, '_blank');
    }
  };

  return (
    <Flex direction="column" gap="medium">
      <Alert title="Error" variant="error">
        <Text>{error || ERROR_MESSAGES.LOADING_FAILED}</Text>
      </Alert>

      <Flex direction="row" gap="small">
        {isAuthError ? (
          <Button onClick={handleConnectAccount} variant="primary">
            Connect Account
          </Button>
        ) : (
          <Button onClick={onRetry} variant="secondary">
            Try Again
          </Button>
        )}
      </Flex>
    </Flex>
  );
}
