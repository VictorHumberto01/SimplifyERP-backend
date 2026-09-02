import { ModuleKey } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { ToggleModuleUseCase } from "../../use-cases/module/toggle-module.use-case";

@injectable()
export class ToggleModuleService {
  constructor(
    @inject(ToggleModuleUseCase)
    private readonly toggleModuleUseCase: ToggleModuleUseCase,
  ) {}

  async execute(tenantId: string, module: ModuleKey, enabled: boolean) {
    return this.toggleModuleUseCase.execute({ tenantId, module, enabled });
  }
}
