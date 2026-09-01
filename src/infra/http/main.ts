import "reflect-metadata";
import * as moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({ "@": path.join(__dirname, "../../") });

import "./setup-di-container";
import { container } from "tsyringe";
import { logger } from "@/core/logger";
import { setupAuthEventsLogHandler } from "@/modules/identity-access/events/auth-events-log-handler";
import { MinioFileStorage } from "@/infra/storage/minio-file-storage";
import { initialSeed } from "../database/prisma/seed";
import env from "../env";
import { app } from "./app";

async function ensureFileStorageBucket() {
  try {
    const fileStorage = container.resolve<MinioFileStorage>("fileStorage");
    await fileStorage.ensureBucket();
  } catch (error) {
    // MinIO is dev-convenience-critical but must never crash the API on boot,
    // same treatment as Resend/Sentry being optional.
    logger.warn({ error }, "Não foi possível garantir o bucket do MinIO na inicialização.");
  }
}

async function main() {
  setupAuthEventsLogHandler();
  await ensureFileStorageBucket();
  await initialSeed();
  const address = await app.listen({ port: env.port, host: "0.0.0.0" });
  logger.info(`Servidor disponível em ${address}`);
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
