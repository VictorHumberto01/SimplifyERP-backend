import { Session } from "@/modules/core/entities/session";
import { ISessionRepository } from "@/modules/core/repositories/session-repository";

export class InMemorySessionRepository implements ISessionRepository {
  items: Session[] = [];

  async save(session: Session): Promise<Session> {
    const existingIndex = this.items.findIndex((item) => item.id === session.id);
    if (existingIndex !== -1) {
      this.items[existingIndex] = session;
    } else {
      this.items.push(session);
    }
    return session;
  }

  async findById(id: string): Promise<Session | null> {
    return this.items.find((item) => item.id === id) ?? null;
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null> {
    return this.items.find((item) => item.refreshTokenHash === refreshTokenHash) ?? null;
  }

  async listActiveByAccountId(accountId: string): Promise<Session[]> {
    const now = new Date();
    return this.items
      .filter((item) => item.accountId === accountId && item.isActive(now))
      .sort((a, b) => b.lastUsedAt.getTime() - a.lastUsedAt.getTime());
  }

  async revokeAllByAccountId(accountId: string): Promise<void> {
    this.items
      .filter((item) => item.accountId === accountId && item.revokedAt === null)
      .forEach((item) => item.revoke());
  }
}
