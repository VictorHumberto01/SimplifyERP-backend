import { inject, injectable } from 'tsyringe';
import { Account } from '../../entities/account';
import { IAccountRepository } from '../../repositories/account-repository';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { object, string } from 'yup';
import { validate } from '@/core/utils/validate';

interface IGetAccountByEmailAccountUseCaseRequest {
  email: string;
}

interface IGetAccountByEmailUseCaseResponse {
  account: Account;
}

@injectable()
export class GetAccountByEmailUseCase {
  constructor(
    @inject('accountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute({
    email,
  }: IGetAccountByEmailAccountUseCaseRequest): Promise<IGetAccountByEmailUseCaseResponse> {
    await validate(getAccountByEmailSchema, { email });

    const account = await this.accountRepository.getByEmail(email);

    if (!account) {
      throw new ResourceNotFoundError('Conta não encontrada. E-mail inexistente.');
    }

    return {
      account,
    };
  }
}

const getAccountByEmailSchema = object({
  email: string()
    .email('O e-mail deve ser um endereço de e-mail válido.')
    .required('O e-mail é obrigatório.'),
});
