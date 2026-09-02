import { Account } from "@/modules/core/entities/account";
import { Email } from "@/modules/core/entities/value-objects/email";
import { Password } from "@/modules/core/entities/value-objects/password";
import { AccountRole, Role } from "@/modules/core/entities/value-objects/role";
import { faker } from "@faker-js/faker";

export function makeAccount(override: Partial<Account> = {}): Account {
  return Account.create({
    name: faker.person.fullName(),
    email: Email.loadEmail(faker.internet.email()),
    password: Password.createNewPassword("SecurePassword123"),
    role: Role.loadRole(AccountRole.USER),
    deletedAt: null,
    ...override,
  });
}
