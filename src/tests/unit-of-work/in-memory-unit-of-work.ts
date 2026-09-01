import { IUnitOfWork } from '@/core/unit-of-work/unit-of-work';

// dont need to implement unit of work for in memory database
export class InMemoryUnitOfWork implements IUnitOfWork {
  async begin(): Promise<void> {}

  async commit(): Promise<void> {}

  async rollback(): Promise<void> {}
}
