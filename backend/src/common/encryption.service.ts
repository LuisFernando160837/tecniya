import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;
  private readonly logger = new Logger(EncryptionService.name);

  constructor() {
    const secret = process.env.ENCRYPTION_KEY || 'tecniya-encryption-key-32-chars-long!!';
    this.key = crypto.scryptSync(secret, 'tecniya-salt', 32);
  }

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${authTag}:${encrypted}`;
    } catch (error) {
      this.logger.error('Error encrypting data', error);
      throw new Error('Error al cifrar datos');
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const parts = encryptedText.split(':');
      const iv = Buffer.from(parts[0], 'hex');
      const authTag = Buffer.from(parts[1], 'hex');
      const encrypted = parts[2];
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Error decrypting data', error);
      throw new Error('Error al descifrar datos');
    }
  }
}
