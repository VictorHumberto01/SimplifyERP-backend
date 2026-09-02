import { IPersistenceMapper } from "@/core/types/persistence-mapper";
import { Session as DomainSession } from "@/modules/core/entities/session";
import { Session as PersistenceSession } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class PrismaSessionMapper implements IPersistenceMapper<DomainSession, PersistenceSession> {
  toPersistence(session: DomainSession): PersistenceSession {
    return {
      id: session.id,
      accountId: session.accountId,
      refreshTokenHash: session.refreshTokenHash,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    };
  }

  toDomain(session: PersistenceSession): DomainSession {
    return DomainSession.create(
      {
        accountId: session.accountId,
        refreshTokenHash: session.refreshTokenHash,
        userAgent: session.userAgent,
        ip: session.ip,
        createdAt: session.createdAt,
        lastUsedAt: session.lastUsedAt,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
      },
      session.id,
    );
  }
}
