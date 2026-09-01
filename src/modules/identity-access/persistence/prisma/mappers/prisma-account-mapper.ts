import { IPersistenceMapper } from "@/core/types/persistence-mapper";
import { Account as DomainAccount } from "@/modules/identity-access/entities/account";
import { Email } from "@/modules/identity-access/entities/value-objects/email";
import { Password } from "@/modules/identity-access/entities/value-objects/password";
import { AccountRole, Role } from "@/modules/identity-access/entities/value-objects/role";
import { User as PersistenceUser } from "@prisma/client";
import { injectable } from "tsyringe";

@injectable()
export class PrismaAccountMapper implements IPersistenceMapper<DomainAccount, PersistenceUser> {
  toPersistence(account: DomainAccount): PersistenceUser {
    return {
      id: account.id,
      name: account.name,
      email: account.email.value,
      role: account.role.value,
      password: account.password.hash,
      mustChangePassword: account.mustChangePassword,
      passwordResetVersion: account.passwordResetVersion,
      passwordResetToken: account.passwordResetToken,
      passwordResetExpiresAt: account.passwordResetExpiresAt,
      mfaEnabled: account.mfaEnabled,
      mfaSecretCipher: account.mfaSecretCipher,
      mfaConfirmedAt: account.mfaConfirmedAt,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      deletedAt: account.deletedAt,
    };
  }

  toDomain(user: PersistenceUser): DomainAccount {
    return DomainAccount.create(
      {
        name: user.name,
        email: Email.loadEmail(user.email),
        password: Password.loadPassword(user.password),
        role: Role.loadRole(user.role as AccountRole),
        mustChangePassword: user.mustChangePassword,
        passwordResetVersion: user.passwordResetVersion,
        passwordResetToken: user.passwordResetToken,
        passwordResetExpiresAt: user.passwordResetExpiresAt,
        mfaEnabled: user.mfaEnabled,
        mfaSecretCipher: user.mfaSecretCipher,
        mfaConfirmedAt: user.mfaConfirmedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      user.id,
    );
  }
}
