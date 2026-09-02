import { BadRequestError } from "@/core/errors/bad-request.error";
import { ModuleKey } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { container, injectable } from "tsyringe";
import { ListModulesService } from "@/modules/core/services/module/list-modules-service";
import { ToggleModuleService } from "@/modules/core/services/module/toggle-module-service";
import { EnabledModulePresenter } from "@/modules/core/http/presenters/enabled-module-presenter";

function requireTenantId(req: FastifyRequest): string {
  if (!req.account.tenantId) {
    throw new BadRequestError("Esta conta não está associada a um estabelecimento.");
  }
  return req.account.tenantId;
}

@injectable()
export class ModuleController {
  public async list(req: FastifyRequest, reply: FastifyReply) {
    const tenantId = requireTenantId(req);
    const { modules } = await container.resolve(ListModulesService).execute(tenantId);
    return reply.status(200).send({ modules: EnabledModulePresenter.toHttp(modules) });
  }

  public async toggle(
    req: FastifyRequest<{ Params: { module: ModuleKey }; Body: { enabled: boolean } }>,
    reply: FastifyReply,
  ) {
    const tenantId = requireTenantId(req);
    const { enabledModule } = await container
      .resolve(ToggleModuleService)
      .execute(tenantId, req.params.module, req.body.enabled);

    return reply.status(200).send({
      module: enabledModule.module,
      enabled: enabledModule.enabled,
    });
  }
}
