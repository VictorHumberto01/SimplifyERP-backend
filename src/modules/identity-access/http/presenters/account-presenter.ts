import { Account } from "@/modules/identity-access/entities/account";

export class AccountPresenter {
  static toHttp(account: Account) {
    return {
      id: account.id,
      name: account.name,
      email: account.email.value,
      role: account.role.value,
      mustChangePassword: account.mustChangePassword,
      mfaEnabled: account.mfaEnabled,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    };
  }
}
