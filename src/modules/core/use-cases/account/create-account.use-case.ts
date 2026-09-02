import { DuplicateResourceError } from "@/core/errors/duplicate-resource-error";
import { validate } from "@/core/utils/validate";
import { inject, injectable } from "tsyringe";
import { mixed, object, string } from "yup";
import { Email } from "../../entities/value-objects/email";
import { Password } from "../../entities/value-objects/password";
import { AccountRole, Role } from "../../entities/value-objects/role";
import { Account } from "../../entities/account";
import { IAccountRepository } from "../../repositories/account-repository";

interface ICreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
  role: AccountRole;
  mustChangePassword?: boolean;
  tenantId?: string | null;
}

@injectable()
export class CreateAccountUseCase {
  constructor(
    @inject("accountRepository")
    private readonly accountRepository: IAccountRepository,
  ) {}

  async execute(request: ICreateAccountUseCaseRequest, tx?: unknown): Promise<{ account: Account }> {
    await validate(createAccountSchema, request);

    if (await this.accountRepository.getByEmail(request.email)) {
      throw new DuplicateResourceError("E-mail já cadastrado.");
    }

    const account = await this.accountRepository.save(
      Account.create({
        name: request.name,
        email: Email.loadEmail(request.email),
        password: Password.createNewPassword(request.password),
        role: Role.loadRole(request.role),
        mustChangePassword: request.mustChangePassword ?? false,
        tenantId: request.tenantId ?? null,
        deletedAt: null,
      }),
      tx,
    );

    return { account };
  }
}

const createAccountSchema = object({
  name: string().trim().min(2, "Nome inválido.").required("Nome é obrigatório."),
  email: string().email("E-mail inválido.").required("E-mail é obrigatório."),
  password: string().min(8, "A senha deve ter pelo menos 8 caracteres.").required("Senha é obrigatória."),
  role: mixed<AccountRole>().oneOf(Object.values(AccountRole), "Perfil inválido.").required(),
});
