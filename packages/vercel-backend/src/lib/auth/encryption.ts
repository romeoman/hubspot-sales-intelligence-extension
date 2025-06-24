import CryptoJS from 'crypto-js';
import { config } from '@/config/environment';

export class EncryptionService {
  private readonly key: string;

  constructor() {
    this.key = config.security.encryptionKey;
  }

  encrypt(data: string): string {
    try {
      const encrypted = CryptoJS.AES.encrypt(data, this.key).toString();
      return encrypted;
    } catch (error) {
      throw new Error('Failed to encrypt data');
    }
  }

  decrypt(encryptedData: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.key);
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plaintext) {
        throw new Error(
          'Failed to decrypt data - invalid key or corrupted data'
        );
      }

      return plaintext;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }

  encryptObject<T>(obj: T): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      throw new Error('Failed to encrypt object');
    }
  }

  decryptObject<T>(encryptedData: string): T {
    try {
      const decrypted = this.decrypt(encryptedData);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      throw new Error('Failed to decrypt object');
    }
  }

  generateHash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }
}

export const encryption = new EncryptionService();
