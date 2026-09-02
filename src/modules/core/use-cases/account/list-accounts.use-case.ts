import { inject, injectable } from 'tsyringe';
import { Account } from '../../entities/account';
import { IAccountRepository, IListAccountsFilters } from '../../repositories/account-repository';
import { Pagination } from '@/core/types/pagination';
import { number, object, string } from 'yup';
import { validate } from '@/core/utils/validate';

interface IListAccountsRequest {
  pagination: Pagination;
  filters: IListAccountsFilters;
}

interface IListAccountsResponse {
  accounts: Account[];
}

@injectable()
export class ListAccountsUseCase {
  constructor(
    @inject('accountRepository')
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute({ filters, pagination }: IListAccountsRequest): Promise<IListAccountsResponse> {
    await validate(listAccountsSchema, {
      filters,
      pagination,
    });

    const accounts = await this.accountRepository.list(filters, pagination);

    return {
      accounts,
    };
  }
}

const listAccountsSchema = object({
  pagination: object({
    page: number().required('A página é obrigatória.'),
    limit: number().required('O limite é obrigatório.'),
  }),
  filters: object({
    email: string().optional().nullable(),
    name: string().optional().nullable(),
    document: string().optional().nullable(),
    phone: string().optional().nullable(),
  }),
});
