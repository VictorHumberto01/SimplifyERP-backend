import { ForbiddenError } from "@/core/errors/forbidden-error";
import { inject, injectable } from "tsyringe";
import { IUpdateAccountDto } from "../../dtos/account.dto";
import { Account } from "../../entities/account";
import { AccountRole } from "../../entities/value-objects/role";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { UpdateAccountByIdUseCase } from "../../use-cases/account/update-account-by-id.use-case";

@injectable()
export class UpdateAccountService {
  constructor(
    @inject(UpdateAccountByIdUseCase)
    private readonly updateAccountByIdUseCase: UpdateAccountByIdUseCase,
    @inject(GetAccountByIdUseCase)
    private readonly getAccountByIdUseCase: GetAccountByIdUseCase,
  ) {}

  async execute(accountId: string, data: IUpdateAccountDto, requester: Account) {
    if (accountId === requester.id) {
      if (data.role) {
        throw new ForbiddenError("Você não pode alterar o próprio perfil de acesso.");
      }

      return this.updateAccountByIdUseCase.execute({ accountId, data });
    }

    if (!requester.role.hasPermission(AccountRole.SUPER_ADMIN)) {
      throw new ForbiddenError("Você não tem permissão para atualizar outras contas.");
    }

    await this.getAccountByIdUseCase.execute({ accountId });
    return this.updateAccountByIdUseCase.execute({ accountId, data });
  }
}
