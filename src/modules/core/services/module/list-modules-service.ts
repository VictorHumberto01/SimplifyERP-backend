import { inject, injectable } from "tsyringe";
import { ListEnabledModulesUseCase } from "../../use-cases/module/list-enabled-modules.use-case";

@injectable()
export class ListModulesService {
  constructor(
    @inject(ListEnabledModulesUseCase)
    private readonly listEnabledModulesUseCase: ListEnabledModulesUseCase,
  ) {}

  async execute(tenantId: string) {
    return this.listEnabledModulesUseCase.execute({ tenantId });
  }
}
