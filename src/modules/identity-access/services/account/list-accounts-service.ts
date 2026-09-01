import { ForbiddenError } from "@/core/errors/forbidden-error";
import { inject, injectable } from "tsyringe";
import { IListAccountsDto } from "../../dtos/account.dto";
import { Account } from "../../entities/account";
import { AccountRole } from "../../entities/value-objects/role";
import { ListAccountsUseCase } from "../../use-cases/account/list-accounts.use-case";

@injectable()
export class ListAccountsService {
  constructor(@inject(ListAccountsUseCase) private readonly listAccountsUseCase: ListAccountsUseCase) {}

  async execute(request: IListAccountsDto, requester: Account) {
    if (!requester.role.hasPermission(AccountRole.SUPER_ADMIN)) {
      throw new ForbiddenError("Você não tem permissão para realizar essa ação.");
    }

    return this.listAccountsUseCase.execute(request);
  }
}
