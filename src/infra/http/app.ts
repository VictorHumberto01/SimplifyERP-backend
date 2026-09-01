import { BadRequestError } from "@/core/errors/bad-request.error";
import { DuplicateResourceError } from "@/core/errors/duplicate-resource-error";
import { fastifyErrorHandler } from "@/core/errors/fastify-error-handler";
import { ForbiddenError } from "@/core/errors/forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { envToLogger } from "@/core/logger/fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import * as Sentry from "@sentry/node";
import fastify from "fastify";
import env from "../env";
import { initSentry } from "../observability/sentry";
import v1Routes from "./routes/v1";

initSentry();

export const app = fastify({ logger: envToLogger[env.nodeEnv] ?? true });

Sentry.setupFastifyErrorHandler(app, {
  shouldHandleError: (error) =>
    env.nodeEnv === "production" &&
    !(error instanceof DuplicateResourceError) &&
    !(error instanceof BadRequestError) &&
    !(error instanceof UnauthorizedError) &&
    !(error instanceof ForbiddenError) &&
    !(error instanceof ResourceNotFoundError),
});

app.register(helmet);
app.register(rateLimit, { global: false });
app.register(cors, {
  origin: env.frontendUrl,
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
  credentials: true,
});

app.setErrorHandler(fastifyErrorHandler);

v1Routes.forEach((route) => app.register(route.route, { prefix: route.path }));

app.get("/v1/healthz", async (_, reply) =>
  reply.status(200).send({ status: "ok", timestamp: new Date().toISOString() }),
);
