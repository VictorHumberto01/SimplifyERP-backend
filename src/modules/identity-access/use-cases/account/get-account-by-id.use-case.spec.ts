import { GetAccountByIdUseCase } from '@/modules/identity-access/use-cases/account/get-account-by-id.use-case';
import { InMemoryAccountRepository } from '@/modules/identity-access/tests/in-memory-account-repository';
import { makeAccount } from '@/modules/identity-access/tests/factories/make-account';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { randomUUID } from 'crypto';

let sut: GetAccountByIdUseCase;
let accountRepository: InMemoryAccountRepository;

describe('Get Account By Id Use Case', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    sut = new GetAccountByIdUseCase(accountRepository);
  });

  it('should get an account by id', async () => {
    const account = makeAccount();
    await accountRepository.save(account);

    const response = await sut.execute({
      accountId: account.id,
    });

    expect(response.account).toBeDefined();
    expect(response.account.id).toBe(account.id);
    expect(response.account.name).toBe(account.name);
    expect(response.account.email.value).toBe(account.email.value);
    expect(response.account.role.value).toBe(account.role.value);
  });

  it('should throw if account is not found', async () => {
    await expect(
      sut.execute({
        accountId: randomUUID(),
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });
});
