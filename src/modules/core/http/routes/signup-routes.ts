import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { SignupController } from "@/modules/core/http/controllers/signup-controller";
import { authenticate } from "@/infra/http/middlewares/authenticate";
import { httpValidate } from "@/infra/http/middlewares/http-validate";
import { SignupValidation } from "@/modules/core/http/validations/signup-validation";

const rateLimitMessage = { error: "Muitas tentativas. Tente novamente em 15 minutos." };

// Só o super admin cria tenants — ver SignupService para a checagem de role.
export async function signupRoutes(app: FastifyInstance) {
  const controller = container.resolve(SignupController);

  app.post("/", {
    config: { rateLimit: { max: 5, timeWindow: "15 minutes", errorResponseBuilder: (_req, context) => ({ statusCode: context.statusCode, message: rateLimitMessage.error }) } },
    preHandler: [authenticate, httpValidate(SignupValidation.signup())],
  }, controller.signup.bind(controller));
}
