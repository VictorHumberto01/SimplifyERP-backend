import { IUnitOfWork } from '@/core/unit-of-work/unit-of-work';

// dont need to implement unit of work for in memory database
export class InMemoryUnitOfWork implements IUnitOfWork {
  async runInTransaction<T>(work: (tx: unknown) => Promise<T>): Promise<T> {
    return work(undefined);
  }
}
