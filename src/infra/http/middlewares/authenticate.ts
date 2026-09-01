import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { VerifyAccessTokenService } from "@/modules/identity-access/services/auth/verify-access-token-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { container } from "tsyringe";

// Rotas liberadas durante setup de credenciais
const SELF_SERVICE_SETUP_PATHS = [
  "/v1/auth/me",
  "/v1/auth/logout",
  "/v1/auth/change-password",
  "/v1/auth/mfa/setup",
  "/v1/auth/mfa/confirm",
];

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  try {
    const [scheme, accessToken] = req.headers.authorization?.split(" ") ?? [];
    if (scheme !== "Bearer" || !accessToken) throw new UnauthorizedError("Token inválido");

    const { account } = await container.resolve(VerifyAccessTokenService).execute({ accessToken });
    req.account = account;

    const path = req.url.split("?")[0];

    if (account.mustChangePassword && !SELF_SERVICE_SETUP_PATHS.includes(path)) {
      return reply.status(403).send({
        error: "Você deve alterar sua senha antes de continuar.",
        code: "MUST_CHANGE_PASSWORD",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Token inválido";
    return reply.status(401).send({ error: message });
  }
}
