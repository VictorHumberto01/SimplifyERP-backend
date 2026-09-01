import { IUnitOfWork } from "@/core/unit-of-work/unit-of-work";
import { IMailProvider } from "@/core/mail/mail-provider";
import { IFileStorage } from "@/core/storage/file-storage";
import { container } from "tsyringe";
import { PrismaUnitOfWork } from "@/infra/database/prisma/unit-of-work";
import { ResendEmailProvider } from "@/infra/providers/email/resend-email-provider";
import { MinioFileStorage } from "@/infra/storage/minio-file-storage";
import { IQueueService } from "@/infra/queues/queue.service";
import { BullmqQueueService } from "@/infra/queues/bullmq/bullmq.queue.service";

container.register<IUnitOfWork>("unitOfWork", PrismaUnitOfWork);
container.registerSingleton<IMailProvider>("mailProvider", ResendEmailProvider);
container.registerSingleton<IQueueService>("queueService", BullmqQueueService);
container.registerSingleton<IFileStorage>("fileStorage", MinioFileStorage);
