import { Job, Processor, Queue, QueueOptions, WorkerOptions } from "bullmq";

export interface QueueDefinition<Data = unknown> {
  name: string;
  processor: Processor<Data>;
  queueOptions?: Omit<QueueOptions, "connection">;
  workerOptions?: Omit<WorkerOptions, "connection">;
}

export interface IQueueService {
  register<Data = unknown>(definition: QueueDefinition<Data>): Queue<Data>;
  get<Data = unknown>(queueName: string): Queue<Data>;
  unregister(queueName: string): Promise<void>;
  closeAll(): Promise<void>;
}

export type QueueJob<Data = unknown> = Job<Data>;
