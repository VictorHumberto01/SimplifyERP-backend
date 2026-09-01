import { PrismaDatabaseSingleton } from "@/infra/database/prisma";
import { ISessionRepository } from "@/modules/identity-access/repositories/session-repository";
import { Session } from "@/modules/identity-access/entities/session";
import { PrismaSessionMapper } from "@/modules/identity-access/persistence/prisma/mappers/prisma-session-mapper";
import { inject, injectable } from "tsyringe";

@injectable()
export class PrismaSessionRepository implements ISessionRepository {
  private prisma = PrismaDatabaseSingleton.getInstance();

  constructor(
    @inject(PrismaSessionMapper)
    private readonly prismaSessionMapper: PrismaSessionMapper,
  ) {}

  async save(session: Session): Promise<Session> {
    const persistenceData = this.prismaSessionMapper.toPersistence(session);

    const record = await this.prisma.session.upsert({
      where: { id: session.id },
      update: persistenceData,
      create: persistenceData,
    });

    return this.prismaSessionMapper.toDomain(record);
  }

  async findById(id: string): Promise<Session | null> {
    const record = await this.prisma.session.findUnique({ where: { id } });

    if (!record) {
      return null;
    }

    return this.prismaSessionMapper.toDomain(record);
  }

  async findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null> {
    const record = await this.prisma.session.findUnique({ where: { refreshTokenHash } });

    if (!record) {
      return null;
    }

    return this.prismaSessionMapper.toDomain(record);
  }

  async listActiveByAccountId(accountId: string): Promise<Session[]> {
    const records = await this.prisma.session.findMany({
      where: { accountId, revokedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { lastUsedAt: "desc" },
    });

    return records.map((record) => this.prismaSessionMapper.toDomain(record));
  }

  async revokeAllByAccountId(accountId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
