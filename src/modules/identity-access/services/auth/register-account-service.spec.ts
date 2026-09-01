import { AccountRole } from "../../entities/value-objects/role";
import { CreateAccountUseCase } from "../../use-cases/account/create-account.use-case";
import { GenerateTokenUseCase } from "../../use-cases/token/generate-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { JwtEncrypter } from "@/modules/identity-access/cryptography/jwt-encrypter";
import { InMemoryAccountRepository } from "@/modules/identity-access/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { RegisterAccountService } from "./register-account-service";

describe("Register Account Service", () => {
  it("always creates a normal user even if a privileged role is injected", async () => {
    const createAccount = new CreateAccountUseCase(new InMemoryAccountRepository());
    const generateToken = new GenerateTokenUseCase(new JwtEncrypter());
    const createSession = new CreateSessionUseCase(new InMemorySessionRepository());
    const service = new RegisterAccountService(createAccount, generateToken, createSession);

    const { account } = await service.execute({
      name: "Usuário de Teste",
      email: "user@example.com",
      password: "SecurePassword123",
      role: AccountRole.SUPER_ADMIN,
    } as never);

    expect(account.role.value).toBe(AccountRole.USER);
  });
});
