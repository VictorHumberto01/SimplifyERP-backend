import { BaseEntity } from "@/core/entities/base-entity";
import { Optional } from "@/core/types/optional";

export interface ISessionProps {
  accountId: string;
  refreshTokenHash: string;
  userAgent: string | null;
  ip: string | null;
  createdAt: Date;
  lastUsedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
}

export class Session extends BaseEntity<ISessionProps> {
  get accountId() {
    return this.props.accountId;
  }

  get refreshTokenHash() {
    return this.props.refreshTokenHash;
  }

  get userAgent() {
    return this.props.userAgent;
  }

  get ip() {
    return this.props.ip;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get lastUsedAt() {
    return this.props.lastUsedAt;
  }

  get expiresAt() {
    return this.props.expiresAt;
  }

  get revokedAt() {
    return this.props.revokedAt;
  }

  isActive(referenceDate: Date = new Date()): boolean {
    return this.props.revokedAt === null && this.props.expiresAt.getTime() > referenceDate.getTime();
  }

  revoke() {
    this.props.revokedAt = new Date();
  }

  touch() {
    this.props.lastUsedAt = new Date();
  }

  static create(props: Optional<ISessionProps, "createdAt" | "lastUsedAt" | "revokedAt">, id?: string) {
    return new Session(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        lastUsedAt: props.lastUsedAt ?? new Date(),
        revokedAt: props.revokedAt ?? null,
      },
      id,
    );
  }
}
