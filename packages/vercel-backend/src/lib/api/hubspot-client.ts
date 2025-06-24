import { Client } from '@hubspot/api-client';
import { config } from '@/config/environment';
import { createLogger } from '@/lib/utils/logger';
import { HUBSPOT_ENDPOINTS } from '@/lib/shared';
import { TokenRefreshResponse } from '@/lib/shared';

export class HubSpotClient {
  private logger = createLogger();

  createClient(accessToken: string): Client {
    return new Client({
      accessToken,
      basePath: 'https://api.hubapi.com',
    });
  }

  async exchangeCodeForTokens(
    code: string,
    redirectUri: string
  ): Promise<{
    access_token: string;
    refresh_token: string;
    expires_in: number;
  }> {
    const requestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: config.hubspot.clientId,
      client_secret: config.hubspot.clientSecret,
      redirect_uri: redirectUri,
      code,
    });

    try {
      const response = await fetch(HUBSPOT_ENDPOINTS.OAUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('Token exchange failed', new Error(errorText), {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Token exchange failed: ${response.statusText}`);
      }

      const tokenData = await response.json();

      this.logger.info('Token exchange successful', {
        expiresIn: tokenData.expires_in,
      });

      return tokenData;
    } catch (error) {
      this.logger.error('Error during token exchange', error as Error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenRefreshResponse> {
    const requestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: config.hubspot.clientId,
      client_secret: config.hubspot.clientSecret,
      refresh_token: refreshToken,
    });

    try {
      const response = await fetch(HUBSPOT_ENDPOINTS.OAUTH_TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('Token refresh failed', new Error(errorText), {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const tokenData = await response.json();

      this.logger.info('Token refresh successful', {
        expiresIn: tokenData.expires_in,
      });

      return tokenData;
    } catch (error) {
      this.logger.error('Error during token refresh', error as Error);
      throw error;
    }
  }

  generateAuthUrl(portalId: string, state?: string): string {
    const params = new URLSearchParams({
      client_id: config.hubspot.clientId,
      redirect_uri: config.hubspot.redirectUri,
      scope: config.hubspot.scopes.join(' '),
      response_type: 'code',
    });

    if (portalId) {
      params.append('portalId', portalId);
    }

    if (state) {
      params.append('state', state);
    }

    const authUrl = `${HUBSPOT_ENDPOINTS.OAUTH_AUTHORIZE}?${params.toString()}`;

    this.logger.info('Generated auth URL', {
      portalId,
      scopes: config.hubspot.scopes,
    });

    return authUrl;
  }

  async getPortalInfo(accessToken: string): Promise<{
    portalId: number;
    domain: string;
    timeZone: string;
  }> {
    try {
      const client = this.createClient(accessToken);
      // Use account info API instead
      const response = await client.oauth.accessTokensApi.get(accessToken);

      return {
        portalId: response.hubId || 0,
        domain: response.hubDomain || '',
        timeZone: 'UTC', // Default timezone
      };
    } catch (error) {
      this.logger.error('Failed to get portal info', error as Error);
      throw new Error('Failed to retrieve portal information');
    }
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      const client = this.createClient(accessToken);
      await client.oauth.accessTokensApi.get(accessToken);
      return true;
    } catch (error) {
      this.logger.warn('Token validation failed', {
        error: (error as Error).message,
      });
      return false;
    }
  }
}

export const hubspotClient = new HubSpotClient();
