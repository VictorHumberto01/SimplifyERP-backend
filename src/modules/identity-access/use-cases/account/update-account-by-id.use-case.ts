import { DuplicateResourceError } from "@/core/errors/duplicate-resource-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { validate } from "@/core/utils/validate";
import { inject, injectable } from "tsyringe";
import { mixed, object, string } from "yup";
import { Account } from "../../entities/account";
import { Email } from "../../entities/value-objects/email";
import { AccountRole, Role } from "../../entities/value-objects/role";
import { IAccountRepository } from "../../repositories/account-repository";

interface Request {
  accountId: string;
  data: { name?: string; email?: string; role?: AccountRole };
}

@injectable()
export class UpdateAccountByIdUseCase {
  constructor(
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute({ accountId, data }: Request): Promise<{ account: Account }> {
    await validate(updateAccountByIdSchema, { accountId, data });
    const account = await this.accountRepository.getById(accountId);

    if (!account) throw new ResourceNotFoundError("Conta não encontrada.");

    if (data.email && data.email !== account.email.value) {
      const accountByEmail = await this.accountRepository.getByEmail(data.email);
      if (accountByEmail && accountByEmail.id !== accountId) {
        throw new DuplicateResourceError("E-mail já cadastrado.");
      }
      account.changeEmail(Email.loadEmail(data.email));
    }

    if (data.name) account.rename(data.name);
    if (data.role) account.changeRole(Role.loadRole(data.role));

    return { account: await this.accountRepository.save(account) };
  }
}

const updateAccountByIdSchema = object({
  accountId: string().uuid("O ID da conta deve ser um UUID válido.").required(),
  data: object({
    name: string().trim().min(2, "Nome inválido.").optional(),
    email: string().email("E-mail inválido.").optional(),
    role: mixed<AccountRole>().oneOf(Object.values(AccountRole)).optional(),
  }),
});
