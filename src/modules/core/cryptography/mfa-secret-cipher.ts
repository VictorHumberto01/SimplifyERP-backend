import crypto from "crypto";
import env from "@/infra/env";
import { BadRequestError } from "@/core/errors/bad-request.error";

const ALGORITHM = "aes-256-gcm";

/**
 * Encrypts/decrypts TOTP secrets at rest using AES-256-GCM.
 * MFA_ENCRYPTION_KEY must be a 32-byte key, hex-encoded (64 hex chars).
 * The key is optional at the environment level so the API can boot without MFA
 * configured — callers get a clear 400 instead of the server failing to start.
 */
export class MfaSecretCipher {
  private static getKey(): Buffer {
    if (!env.mfaEncryptionKey) {
      throw new BadRequestError("MFA não está configurado neste servidor (MFA_ENCRYPTION_KEY ausente).");
    }
    return Buffer.from(env.mfaEncryptionKey, "hex");
  }

  static encrypt(plainSecret: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, this.getKey(), iv);

    const encrypted = Buffer.concat([cipher.update(plainSecret, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
  }

  static decrypt(cipherText: string): string {
    const [ivHex, authTagHex, encryptedHex] = cipherText.split(":");
    if (!ivHex || !authTagHex || !encryptedHex) {
      throw new Error("Formato inválido de segredo MFA cifrado.");
    }

    const decipher = crypto.createDecipheriv(ALGORITHM, this.getKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

    const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]);

    return decrypted.toString("utf8");
  }
}
