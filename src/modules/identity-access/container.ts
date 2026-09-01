import { IAccountRepository } from "@/modules/identity-access/repositories/account-repository";
import { IEncrypter } from "@/modules/identity-access/cryptography/encrypter";
import { ISessionRepository } from "@/modules/identity-access/repositories/session-repository";
import { container } from "tsyringe";
import { PrismaAccountRepository } from "@/modules/identity-access/persistence/prisma/repositories/prisma-account-repository";
import { PrismaSessionRepository } from "@/modules/identity-access/persistence/prisma/repositories/prisma-session-repository";
import { JwtEncrypter } from "@/modules/identity-access/cryptography/jwt-encrypter";

container.registerSingleton<IAccountRepository>("accountRepository", PrismaAccountRepository);
container.registerSingleton<ISessionRepository>("sessionRepository", PrismaSessionRepository);
container.registerSingleton<IEncrypter>("encrypter", JwtEncrypter);
