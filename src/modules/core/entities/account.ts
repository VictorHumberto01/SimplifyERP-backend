import { BaseEntity } from "@/core/entities/base-entity";
import { Optional } from "@/core/types/optional";
import { Email } from "./value-objects/email";
import { Password } from "./value-objects/password";
import { Role } from "./value-objects/role";

export interface IAccountProps {
  name: string;
  email: Email;
  password: Password;
  role: Role;
  mustChangePassword: boolean;
  passwordResetVersion: number;
  passwordResetToken?: string | null;
  passwordResetExpiresAt?: Date | null;
  mfaEnabled: boolean;
  mfaSecretCipher?: string | null;
  mfaConfirmedAt?: Date | null;
  tenantId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class Account extends BaseEntity<IAccountProps> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  get name() { return this.props.name; }
  get password() { return this.props.password; }
  get email() { return this.props.email; }
  get role() { return this.props.role; }
  get mustChangePassword() { return this.props.mustChangePassword; }
  get passwordResetVersion() { return this.props.passwordResetVersion; }
  get passwordResetToken() { return this.props.passwordResetToken ?? null; }
  get passwordResetExpiresAt() { return this.props.passwordResetExpiresAt ?? null; }
  get mfaEnabled() { return this.props.mfaEnabled; }
  get mfaSecretCipher() { return this.props.mfaSecretCipher ?? null; }
  get mfaConfirmedAt() { return this.props.mfaConfirmedAt ?? null; }
  get tenantId() { return this.props.tenantId ?? null; }
  get createdAt() { return this.props.createdAt; }
  get updatedAt() { return this.props.updatedAt; }
  get deletedAt() { return this.props.deletedAt; }

  rename(name: string) {
    this.props.name = name;
    this.touch();
  }

  changePassword(password: Password) {
    this.props.password = password;
    this.clearPasswordChangeFlag();
    this.touch();
  }

  changeEmail(email: Email) {
    this.props.email = email;
    this.touch();
  }

  changeRole(role: Role) {
    this.props.role = role;
    this.touch();
  }

  assignTenant(tenantId: string) {
    this.props.tenantId = tenantId;
    this.touch();
  }

  forcePasswordChange() {
    this.props.mustChangePassword = true;
    this.touch();
  }

  clearPasswordChangeFlag() {
    this.props.mustChangePassword = false;
    this.touch();
  }

  incrementPasswordResetVersion() {
    this.props.passwordResetVersion += 1;
    this.touch();
  }

  createPasswordResetToken(hashedToken: string, expiresAt: Date) {
    this.props.passwordResetToken = hashedToken;
    this.props.passwordResetExpiresAt = expiresAt;
    this.touch();
  }

  clearPasswordResetToken() {
    this.props.passwordResetToken = null;
    this.props.passwordResetExpiresAt = null;
    this.touch();
  }

  softDelete() {
    this.props.deletedAt = new Date();
    this.touch();
  }

  setPendingMfaSecret(secretCipher: string) {
    this.props.mfaSecretCipher = secretCipher;
    this.props.mfaEnabled = false;
    this.props.mfaConfirmedAt = null;
    this.touch();
  }

  confirmMfa() {
    if (!this.props.mfaSecretCipher) {
      throw new Error("Não é possível confirmar MFA sem um segredo pendente.");
    }
    this.props.mfaEnabled = true;
    this.props.mfaConfirmedAt = new Date();
    this.touch();
  }

  disableMfa() {
    this.props.mfaEnabled = false;
    this.props.mfaSecretCipher = null;
    this.props.mfaConfirmedAt = null;
    this.touch();
  }

  static create(
    props: Optional<
      IAccountProps,
      "createdAt" | "updatedAt" | "mustChangePassword" | "passwordResetVersion" | "mfaEnabled"
    >,
    id?: string,
  ) {
    return new Account(
      {
        ...props,
        mustChangePassword: props.mustChangePassword ?? false,
        passwordResetVersion: props.passwordResetVersion ?? 0,
        passwordResetToken: props.passwordResetToken ?? null,
        passwordResetExpiresAt: props.passwordResetExpiresAt ?? null,
        mfaEnabled: props.mfaEnabled ?? false,
        mfaSecretCipher: props.mfaSecretCipher ?? null,
        mfaConfirmedAt: props.mfaConfirmedAt ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );
  }
}
