import { Account } from "@/modules/core/entities/account";
import {
  IAccountRepository,
  IListAccountsFilters,
} from "@/modules/core/repositories/account-repository";
import { PrismaDatabaseSingleton } from "@/infra/database/prisma";
import { Prisma } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { Pagination } from "@/core/types/pagination";
import { PrismaAccountMapper } from "@/modules/core/persistence/prisma/mappers/prisma-account-mapper";

@injectable()
export class PrismaAccountRepository implements IAccountRepository {
  private prisma = PrismaDatabaseSingleton.getInstance();

  constructor(
    @inject(PrismaAccountMapper)
    private prismaAccountMapper: PrismaAccountMapper,
  ) {}

  async list(
    filters: IListAccountsFilters,
    pagination: Pagination,
  ): Promise<Account[]> {
    const { page, limit } = pagination;
    const { email: emailFilter, name: nameFilter, role: roleFilter } = filters;

    const users = await this.prisma.user.findMany({
      where: {
        email: emailFilter ? { contains: emailFilter } : undefined,
        name: nameFilter ? { contains: nameFilter } : undefined,
        role: roleFilter ? { equals: roleFilter } : undefined,
        deletedAt: null,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return users.map((user) => this.prismaAccountMapper.toDomain(user));
  }

  async getById(id: string): Promise<Account | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return this.prismaAccountMapper.toDomain(user);
  }

  async getByEmail(email: string): Promise<Account | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.prismaAccountMapper.toDomain(user);
  }

  async getByPasswordResetToken(token: string): Promise<Account | null> {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: token, deletedAt: null },
    });

    if (!user) {
      return null;
    }

    return this.prismaAccountMapper.toDomain(user);
  }

  async save(data: Account, tx?: unknown): Promise<Account> {
    const client = (tx as Prisma.TransactionClient | undefined) ?? this.prisma;
    const persistenceData = this.prismaAccountMapper.toPersistence(data);

    const user = await client.user.upsert({
      where: { id: data.id },
      update: persistenceData,
      create: persistenceData,
    });

    return this.prismaAccountMapper.toDomain(user);
  }
}
