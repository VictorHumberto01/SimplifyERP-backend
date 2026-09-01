import { GetAccountByEmailUseCase } from '@/modules/identity-access/use-cases/account/get-account-by-email.use-case';
import { InMemoryAccountRepository } from '@/modules/identity-access/tests/in-memory-account-repository';
import { makeAccount } from '@/modules/identity-access/tests/factories/make-account';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

let sut: GetAccountByEmailUseCase;
let accountRepository: InMemoryAccountRepository;

describe('Get Account By Email Use Case', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    sut = new GetAccountByEmailUseCase(accountRepository);
  });

  it('should get an account by email', async () => {
    const account = makeAccount();
    await accountRepository.save(account);

    const response = await sut.execute({
      email: account.email.value,
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
        email: 'non-existent@email.com',
      })
    ).rejects.toThrow(ResourceNotFoundError);
  });

  it('should validate email format', async () => {
    await expect(
      sut.execute({
        email: 'invalid-email',
      })
    ).rejects.toThrow();
  });
});
