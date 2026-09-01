import env from "@/infra/env";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../logger";
import { BadRequestError } from "./bad-request.error";
import { DuplicateResourceError } from "./duplicate-resource-error";
import { ForbiddenError } from "./forbidden-error";
import { ResourceNotFoundError } from "./resource-not-found-error";
import { UnauthorizedError } from "./unauthorized-error";

export async function fastifyErrorHandler(
  error: FastifyError | Error,
  _: FastifyRequest,
  reply: FastifyReply,
) {
  if (env.nodeEnv !== "test") logger.error(error);

  if (error instanceof DuplicateResourceError) return reply.status(409).send({ message: error.message });
  if (error instanceof BadRequestError) return reply.status(400).send({ message: error.message });
  if (error instanceof UnauthorizedError) return reply.status(401).send({ message: error.message });
  if (error instanceof ForbiddenError) return reply.status(403).send({ message: error.message });
  if (error instanceof ResourceNotFoundError) return reply.status(404).send({ message: error.message });

  if ("statusCode" in error && typeof error.statusCode === "number" && error.statusCode < 500) {
    return reply.status(error.statusCode).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Erro interno do servidor." });
}
