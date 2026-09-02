import "reflect-metadata";
import * as moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({ "@": path.join(__dirname, "../../") });

import "./setup-di-container";
import { container } from "tsyringe";
import { Redis } from "ioredis";
import { logger } from "@/core/logger";
import { setupAuthEventsLogHandler } from "@/modules/core/events/auth-events-log-handler";
import { MinioFileStorage } from "@/infra/storage/minio-file-storage";
import { PrismaDatabaseSingleton } from "../database/prisma";
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

// Postgres and Redis are required for the API to function at all — fail fast
// on boot instead of surfacing confusing errors on the first request.
async function ensureDatabaseConnection() {
  await PrismaDatabaseSingleton.getInstance().$connect();
}

async function ensureRedisConnection() {
  const redis = new Redis({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password || undefined,
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  try {
    await redis.connect();
    await redis.ping();
  } finally {
    redis.disconnect();
  }
}

async function main() {
  await ensureDatabaseConnection();
  await ensureRedisConnection();
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
