import { kv } from '@vercel/kv';
import { encryption } from './encryption';
import { createLogger } from '@/lib/utils/logger';
import { OAuthToken } from '@/lib/shared';

export class TokenManager {
  private logger = createLogger();

  private getTokenKey(portalId: string): string {
    return `hubspot_token:${portalId}`;
  }

  async storeToken(token: OAuthToken): Promise<void> {
    try {
      const tokenKey = this.getTokenKey(token.hubspotAccountId);
      const encryptedToken = encryption.encryptObject(token);

      // Store with expiration (tokens typically last 30 minutes)
      const expirationSeconds = Math.floor(
        (new Date(token.expiresAt).getTime() - Date.now()) / 1000
      );

      await kv.setex(tokenKey, expirationSeconds, encryptedToken);

      this.logger.info('Token stored successfully', {
        portalId: token.hubspotAccountId,
        expiresAt: token.expiresAt,
      });
    } catch (error) {
      this.logger.error('Failed to store token', error as Error, {
        portalId: token.hubspotAccountId,
      });
      throw new Error('Failed to store authentication token');
    }
  }

  async getToken(portalId: string): Promise<OAuthToken | null> {
    try {
      const tokenKey = this.getTokenKey(portalId);
      const encryptedToken = await kv.get<string>(tokenKey);

      if (!encryptedToken) {
        this.logger.debug('Token not found', { portalId });
        return null;
      }

      const token = encryption.decryptObject<OAuthToken>(encryptedToken);

      // Check if token is expired
      if (new Date(token.expiresAt) <= new Date()) {
        this.logger.warn('Token expired', {
          portalId,
          expiresAt: token.expiresAt,
        });
        await this.deleteToken(portalId);
        return null;
      }

      this.logger.debug('Token retrieved successfully', { portalId });
      return token;
    } catch (error) {
      this.logger.error('Failed to retrieve token', error as Error, {
        portalId,
      });
      return null;
    }
  }

  async updateToken(
    portalId: string,
    updates: Partial<OAuthToken>
  ): Promise<OAuthToken | null> {
    try {
      const existingToken = await this.getToken(portalId);

      if (!existingToken) {
        this.logger.warn('Cannot update non-existent token', { portalId });
        return null;
      }

      const updatedToken: OAuthToken = {
        ...existingToken,
        ...updates,
        updatedAt: new Date(),
      };

      await this.storeToken(updatedToken);

      this.logger.info('Token updated successfully', {
        portalId,
        updatedFields: Object.keys(updates),
      });

      return updatedToken;
    } catch (error) {
      this.logger.error('Failed to update token', error as Error, {
        portalId,
      });
      throw new Error('Failed to update authentication token');
    }
  }

  async deleteToken(portalId: string): Promise<void> {
    try {
      const tokenKey = this.getTokenKey(portalId);
      await kv.del(tokenKey);

      this.logger.info('Token deleted successfully', { portalId });
    } catch (error) {
      this.logger.error('Failed to delete token', error as Error, {
        portalId,
      });
      throw new Error('Failed to delete authentication token');
    }
  }

  async isTokenExpiringSoon(
    portalId: string,
    minutesThreshold = 5
  ): Promise<boolean> {
    try {
      const token = await this.getToken(portalId);

      if (!token) {
        return false;
      }

      const expirationTime = new Date(token.expiresAt).getTime();
      const thresholdTime = Date.now() + minutesThreshold * 60 * 1000;

      return expirationTime <= thresholdTime;
    } catch (error) {
      this.logger.error('Failed to check token expiration', error as Error, {
        portalId,
      });
      return true; // Assume expiring to trigger refresh
    }
  }
}

export const tokenManager = new TokenManager();
