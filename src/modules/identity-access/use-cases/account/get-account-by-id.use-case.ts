import { inject, injectable } from 'tsyringe';
import { Account } from '../../entities/account';
import { IAccountRepository } from '../../repositories/account-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { object, string } from 'yup';
import { validate } from '@/core/utils/validate';

interface IGetAccountByIdUseCaseRequest {
  accountId: string;
}

interface IGetAccountByIdUseCaseResponse {
  account: Account;
}

@injectable()
export class GetAccountByIdUseCase {
  constructor(
    @inject('accountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute({
    accountId,
  }: IGetAccountByIdUseCaseRequest): Promise<IGetAccountByIdUseCaseResponse> {
    await validate(getAccountByIdSchema, { accountId });

    const account = await this.accountRepository.getById(accountId);

    if (!account) {
      throw new ResourceNotFoundError('Conta não encontrada. ID inexistente.');
    }

    return {
      account,
    };
  }
}

const getAccountByIdSchema = object({
  accountId: string()
    .uuid('O ID da conta deve ser um UUID válido.')
    .required('O ID da conta é obrigatório.'),
});
