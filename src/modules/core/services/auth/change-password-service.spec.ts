import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryAccountRepository } from "@/modules/core/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/core/tests/in-memory-session-repository";
import { makeAccount } from "@/modules/core/tests/factories/make-account";
import { Password } from "../../entities/value-objects/password";
import { PasswordChangedEvent } from "../../events/password-changed.event";
import { GetAccountByIdUseCase } from "../../use-cases/account/get-account-by-id.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";
import { ChangePasswordService } from "./change-password-service";

const CURRENT_PASSWORD = "SecurePassword123";

describe("Change Password Service", () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
  });

  it("revokes every active session and dispatches PasswordChangedEvent", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();
    const account = makeAccount({ password: Password.createNewPassword(CURRENT_PASSWORD) });
    await accountRepository.save(account);
    await new CreateSessionUseCase(sessionRepository).execute({
      accountId: account.id,
      refreshToken: "refresh-token",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const handler = vi.fn();
    DomainEvents.register(handler, PasswordChangedEvent.name);

    const sut = new ChangePasswordService(
      new GetAccountByIdUseCase(accountRepository),
      accountRepository,
      new RevokeAllSessionsUseCase(sessionRepository),
    );

    await sut.execute(account.id, { currentPassword: CURRENT_PASSWORD, newPassword: "NewSecurePassword456" });

    const activeSessions = await sessionRepository.listActiveByAccountId(account.id);
    expect(activeSessions).toHaveLength(0);
    expect(handler).toHaveBeenCalledOnce();
  });
});
