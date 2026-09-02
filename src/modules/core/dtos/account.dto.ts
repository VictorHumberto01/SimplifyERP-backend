import { Pagination } from "@/core/types/pagination";
import { AccountRole } from "../entities/value-objects/role";
import { IListAccountsFilters } from "../repositories/account-repository";

export interface IUpdateAccountDto {
  name?: string;
  email?: string;
  role?: AccountRole;
}

export interface IListAccountsDto {
  pagination: Pagination;
  filters: IListAccountsFilters;
}
