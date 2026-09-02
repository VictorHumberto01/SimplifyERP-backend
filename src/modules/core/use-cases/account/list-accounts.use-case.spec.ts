import { ListAccountsUseCase } from '@/modules/core/use-cases/account/list-accounts.use-case';
import { InMemoryAccountRepository } from '@/modules/core/tests/in-memory-account-repository';
import { makeAccount } from '@/modules/core/tests/factories/make-account';
import { Email } from '@/modules/core/entities/value-objects/email';

let sut: ListAccountsUseCase;
let accountRepository: InMemoryAccountRepository;

describe('List Accounts Use Case', () => {
  beforeEach(() => {
    accountRepository = new InMemoryAccountRepository();
    sut = new ListAccountsUseCase(accountRepository);
  });

  it('should list all accounts', async () => {
    const accounts = [
      makeAccount({ name: 'John Doe' }),
      makeAccount({ name: 'Jane Doe' }),
      makeAccount({ name: 'Bob Smith' }),
    ];

    for (const account of accounts) {
      await accountRepository.save(account);
    }

    const response = await sut.execute({
      pagination: {
        page: 1,
        limit: 10,
      },
      filters: {},
    });

    expect(response.accounts).toHaveLength(3);
    expect(response.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
        }),
        expect.objectContaining({
          name: 'Jane Doe',
        }),
        expect.objectContaining({
          name: 'Bob Smith',
        }),
      ])
    );
  });

  it('should filter accounts by email', async () => {
    const accounts = [
      makeAccount({ email: Email.loadEmail('john@example.com') }),
      makeAccount({ email: Email.loadEmail('jane@example.com') }),
      makeAccount({ email: Email.loadEmail('bob@example.com') }),
    ];

    for (const account of accounts) {
      await accountRepository.save(account);
    }

    const response = await sut.execute({
      pagination: {
        page: 1,
        limit: 10,
      },
      filters: {
        email: 'john',
      },
    });

    expect(response.accounts).toHaveLength(1);
    expect(response.accounts[0].email.value).toBe('john@example.com');
  });

  it('should filter accounts by name', async () => {
    const accounts = [
      makeAccount({ name: 'John Doe' }),
      makeAccount({ name: 'Jane Doe' }),
      makeAccount({ name: 'Bob Smith' }),
    ];

    for (const account of accounts) {
      await accountRepository.save(account);
    }

    const response = await sut.execute({
      pagination: {
        page: 1,
        limit: 10,
      },
      filters: {
        name: 'Doe',
      },
    });

    expect(response.accounts).toHaveLength(2);
    expect(response.accounts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'John Doe',
        }),
        expect.objectContaining({
          name: 'Jane Doe',
        }),
      ])
    );
  });

  it('should paginate results', async () => {
    const accounts = [
      makeAccount({ name: 'John Doe' }),
      makeAccount({ name: 'Jane Doe' }),
      makeAccount({ name: 'Bob Smith' }),
    ];

    for (const account of accounts) {
      await accountRepository.save(account);
    }

    const response = await sut.execute({
      pagination: {
        page: 1,
        limit: 2,
      },
      filters: {},
    });

    expect(response.accounts).toHaveLength(2);
  });
});
