import { Pagination } from "@/core/types/pagination";
import { Account } from "@/modules/identity-access/entities/account";
import {
  IAccountRepository,
  IListAccountsFilters,
} from "@/modules/identity-access/repositories/account-repository";

export class InMemoryAccountRepository implements IAccountRepository {
  items: Account[] = [];

  async list(
    filters: IListAccountsFilters,
    pagination: Pagination,
  ): Promise<Account[]> {
    let accounts = this.items;

    if (filters.email) {
      accounts = accounts.filter((item) =>
        item.email.value.includes(filters.email!),
      );
    }

    if (filters.name) {
      accounts = accounts.filter((item) => item.name.includes(filters.name!));
    }

    if (pagination.page && pagination.limit) {
      const start = (pagination.page - 1) * pagination.limit;
      const end = start + pagination.limit;
      accounts = accounts.slice(start, end);
    }

    return accounts;
  }

  async getById(id: string): Promise<Account | null> {
    return this.items.find((item) => item.id === id) || null;
  }

  async getByEmail(email: string): Promise<Account | null> {
    return this.items.find((item) => item.email.value === email) || null;
  }

  async getByPasswordResetToken(token: string): Promise<Account | null> {
    return (
      this.items.find(
        (item) => item.passwordResetToken === token && !item.deletedAt,
      ) || null
    );
  }

  async save(data: Account): Promise<Account> {
    const existingIndex = this.items.findIndex((item) => item.id === data.id);
    if (existingIndex !== -1) {
      this.items[existingIndex] = data;
    } else {
      this.items.push(data);
    }
    return data;
  }
}
