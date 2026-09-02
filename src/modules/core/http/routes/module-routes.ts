import { FastifyInstance } from "fastify";
import { container } from "tsyringe";
import { ModuleController } from "@/modules/core/http/controllers/module-controller";
import { authenticate } from "@/infra/http/middlewares/authenticate";
import { httpValidate } from "@/infra/http/middlewares/http-validate";
import { ModuleValidation } from "@/modules/core/http/validations/module-validation";

export async function moduleRoutes(app: FastifyInstance) {
  const controller = container.resolve(ModuleController);

  app.get("/modules", { preHandler: [authenticate] }, controller.list.bind(controller));

  app.patch("/modules/:module", {
    preHandler: [authenticate, httpValidate(ModuleValidation.toggle())],
  }, controller.toggle.bind(controller));
}
