import { Pagination } from "@/core/types/pagination";
import { Account } from "../entities/account";
import { AccountRole } from "../entities/value-objects/role";

export interface IListAccountsFilters {
  email?: string;
  name?: string;
  role?: AccountRole;
}

export interface IAccountRepository {
  list(
    filters: IListAccountsFilters,
    pagination: Pagination,
  ): Promise<Account[]>;
  getById(id: string): Promise<Account | null>;
  getByEmail(email: string): Promise<Account | null>;
  getByPasswordResetToken(token: string): Promise<Account | null>;
  // upsert
  save(data: Account, tx?: unknown): Promise<Account>;
}
