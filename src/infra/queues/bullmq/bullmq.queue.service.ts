import { logger } from "@/core/logger";
import env from "@/infra/env";
import { Queue, Worker } from "bullmq";
import { IQueueService, QueueDefinition } from "../queue.service";

export class BullmqQueueService implements IQueueService {
  private readonly queues = new Map<string, { queue: Queue; worker: Worker }>();
  private readonly connection = {
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password || undefined,
  };

  register<Data = unknown>(definition: QueueDefinition<Data>): Queue<Data> {
    if (this.queues.has(definition.name)) {
      return this.queues.get(definition.name)!.queue as Queue<Data>;
    }

    const queue = new Queue<Data>(definition.name, {
      ...definition.queueOptions,
      connection: this.connection,
    });
    const worker = new Worker<Data>(definition.name, definition.processor, {
      ...definition.workerOptions,
      connection: this.connection,
    });

    worker.on("failed", (job, error) => {
      logger.error({ queue: definition.name, jobId: job?.id, error }, "Job de fila falhou");
    });

    this.queues.set(definition.name, { queue, worker });
    logger.info({ queue: definition.name }, "Fila registrada");
    return queue;
  }

  get<Data = unknown>(queueName: string): Queue<Data> {
    const registered = this.queues.get(queueName);
    if (!registered) throw new Error(`Fila não registrada: ${queueName}`);
    return registered.queue as Queue<Data>;
  }

  async unregister(queueName: string): Promise<void> {
    const registered = this.queues.get(queueName);
    if (!registered) return;
    await Promise.all([registered.worker.close(), registered.queue.close()]);
    this.queues.delete(queueName);
  }

  async closeAll(): Promise<void> {
    await Promise.all([...this.queues.keys()].map((name) => this.unregister(name)));
  }
}
