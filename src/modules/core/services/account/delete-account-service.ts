import { ForbiddenError } from "@/core/errors/forbidden-error";
import { inject, injectable } from "tsyringe";
import { Account } from "../../entities/account";
import { AccountRole } from "../../entities/value-objects/role";
import { SoftDeleteAccountByIdUseCase } from "../../use-cases/account/soft-delete-account.use-case";

@injectable()
export class DeleteAccountService {
  constructor(
    @inject(SoftDeleteAccountByIdUseCase)
    private readonly softDeleteAccountByIdUseCase: SoftDeleteAccountByIdUseCase,
  ) {}

  async execute({ accountId }: { accountId: string }, requester: Account) {
    if (!requester.role.hasPermission(AccountRole.SUPER_ADMIN)) {
      throw new ForbiddenError("Você não tem permissão para realizar essa ação.");
    }

    if (accountId === requester.id) {
      throw new ForbiddenError("Você não pode excluir a própria conta administrativa.");
    }

    await this.softDeleteAccountByIdUseCase.execute({ accountId });
  }
}
