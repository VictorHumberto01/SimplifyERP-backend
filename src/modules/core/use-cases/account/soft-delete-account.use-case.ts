import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { IAccountRepository } from '../../repositories/account-repository';
import { inject, injectable } from 'tsyringe';
import { object, string } from 'yup';
import { validate } from '@/core/utils/validate';

interface ISoftDeleteAccountByIdRequest {
  accountId: string;
}

@injectable()
export class SoftDeleteAccountByIdUseCase {
  constructor(
    @inject('accountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute({ accountId }: ISoftDeleteAccountByIdRequest): Promise<void> {
    await validate(softDeleteAccountByIdSchema, { accountId });

    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new ResourceNotFoundError('Conta não encontrada.');
    }

    account.softDelete();

    await this.accountRepository.save(account);
  }
}

const softDeleteAccountByIdSchema = object({
  accountId: string()
    .uuid('O ID da conta deve ser um UUID válido.')
    .required('O ID da conta é obrigatório.'),
});
