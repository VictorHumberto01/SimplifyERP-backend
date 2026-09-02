import { ForbiddenError } from "@/core/errors/forbidden-error";
import { inject, injectable } from "tsyringe";
import { Account } from "../../entities/account";
import { AccountRole } from "../../entities/value-objects/role";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";

@injectable()
export class ShowAccountService {
  constructor(@inject(GetAccountByIdUseCase) private readonly getAccountByIdUseCase: GetAccountByIdUseCase) {}

  async execute({ accountId }: { accountId: string }, requester: Account) {
    if (!requester.role.hasPermission(AccountRole.SUPER_ADMIN)) {
      throw new ForbiddenError("Você não tem permissão para realizar essa ação.");
    }

    return this.getAccountByIdUseCase.execute({ accountId });
  }
}
