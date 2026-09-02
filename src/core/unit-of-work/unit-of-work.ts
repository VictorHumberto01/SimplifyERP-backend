export interface IUnitOfWork {
  runInTransaction<T>(work: (tx: unknown) => Promise<T>): Promise<T>;
}
