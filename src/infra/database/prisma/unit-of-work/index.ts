import { IUnitOfWork } from '@/core/unit-of-work/unit-of-work';
import { PrismaDatabaseSingleton } from '..';
import { PrismaClient, Prisma } from '@prisma/client';

export class PrismaUnitOfWork implements IUnitOfWork {
  private prisma: PrismaClient = PrismaDatabaseSingleton.getInstance();
  private transactionClient?: Prisma.TransactionClient;

  async begin(): Promise<void> {
    if (this.transactionClient) {
      throw new Error('A transaction is already in progress.');
    }

    this.transactionClient = await this.prisma.$transaction(async (tx) => tx);
  }

  async commit(): Promise<void> {
    if (!this.transactionClient) {
      throw new Error('No transaction in progress to commit.');
    }

    this.transactionClient = undefined; // Libera o cliente transacional
  }

  async rollback(): Promise<void> {
    if (!this.transactionClient) {
      throw new Error('No transaction in progress to rollback.');
    }
    // O Prisma não oferece rollback direto; lidamos com isso lançando erros no escopo
    this.transactionClient = undefined; // Libera o cliente transacional
    throw new Error('Transaction rolled back manually.');
  }

  getClient(): Prisma.TransactionClient | PrismaClient {
    return this.transactionClient ?? this.prisma;
  }
}
