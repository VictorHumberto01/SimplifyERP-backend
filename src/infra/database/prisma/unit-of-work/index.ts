import { IUnitOfWork } from '@/core/unit-of-work/unit-of-work';
import { PrismaDatabaseSingleton } from '..';
import { PrismaClient } from '@prisma/client';

export class PrismaUnitOfWork implements IUnitOfWork {
  private prisma: PrismaClient = PrismaDatabaseSingleton.getInstance();

  async runInTransaction<T>(work: (tx: unknown) => Promise<T>): Promise<T> {
    return this.prisma.$transaction((tx) => work(tx));
  }
}
