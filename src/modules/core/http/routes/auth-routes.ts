import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { AuthController } from "@/modules/core/http/controllers/auth-controller";
import { SessionController } from "@/modules/core/http/controllers/session-controller";
import { authenticate } from "@/infra/http/middlewares/authenticate";
import { httpValidate } from "@/infra/http/middlewares/http-validate";
import { AuthValidation } from "@/modules/core/http/validations/auth-validation";
import { SessionValidation } from "@/modules/core/http/validations/session-validation";

const rateLimitMessage = { error: "Muitas tentativas. Tente novamente em 15 minutos." };

export async function authRoutes(app: FastifyInstance) {
  const controller = container.resolve(AuthController);
  const sessionController = container.resolve(SessionController);

  app.post("/register", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.register())],
  }, controller.register.bind(controller));

  app.post("/login", {
    config: { rateLimit: { max: 10, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.login())],
  }, controller.login.bind(controller));

  app.post("/mfa/verify", {
    config: { rateLimit: { max: 10, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.verifyMfa())],
  }, controller.verifyMfa.bind(controller));

  app.post("/refresh-token", {
    config: { rateLimit: { max: 30, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.refreshAuth())],
  }, controller.refreshAuth.bind(controller));

  app.post("/logout", {
    preHandler: [httpValidate(AuthValidation.logout())],
  }, controller.logout.bind(controller));

  app.get("/me", { preHandler: [authenticate] }, controller.me);

  app.post("/forgot-password", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.forgotPassword())],
  }, controller.forgotPassword.bind(controller));

  app.post("/reset-password", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [httpValidate(AuthValidation.resetPassword())],
  }, controller.resetPassword.bind(controller));

  app.put("/change-password", {
    preHandler: [authenticate, httpValidate(AuthValidation.changePassword())],
  }, controller.changePassword.bind(controller));

  app.post("/mfa/setup", { preHandler: [authenticate] }, controller.setupMfa.bind(controller));

  app.post("/mfa/confirm", {
    preHandler: [authenticate, httpValidate(AuthValidation.confirmMfa())],
  }, controller.confirmMfa.bind(controller));

  app.get("/sessions", { preHandler: [authenticate] }, sessionController.list.bind(sessionController));

  app.delete("/sessions/:sessionId", {
    preHandler: [authenticate, httpValidate(SessionValidation.revoke())],
  }, sessionController.revoke.bind(sessionController));
}
