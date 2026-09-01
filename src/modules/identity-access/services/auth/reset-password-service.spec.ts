import crypto from "crypto";
import { DomainEvents } from "@/core/events/domain-events";
import { InMemoryAccountRepository } from "@/modules/identity-access/tests/in-memory-account-repository";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { makeAccount } from "@/modules/identity-access/tests/factories/make-account";
import { PasswordResetEvent } from "../../events/password-reset.event";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { RevokeAllSessionsUseCase } from "../../use-cases/session/revoke-all-sessions.use-case";
import { ResetPasswordService } from "./reset-password-service";

describe("Reset Password Service", () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
  });

  it("revokes every active session and dispatches PasswordResetEvent", async () => {
    const accountRepository = new InMemoryAccountRepository();
    const sessionRepository = new InMemorySessionRepository();

    const rawToken = "reset-token";
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const account = makeAccount();
    account.createPasswordResetToken(hashedToken, new Date(Date.now() + 60_000));
    await accountRepository.save(account);

    await new CreateSessionUseCase(sessionRepository).execute({
      accountId: account.id,
      refreshToken: "refresh-token",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const handler = vi.fn();
    DomainEvents.register(handler, PasswordResetEvent.name);

    const sut = new ResetPasswordService(accountRepository, new RevokeAllSessionsUseCase(sessionRepository));
    await sut.execute({ token: rawToken, newPassword: "NewSecurePassword456" });

    const activeSessions = await sessionRepository.listActiveByAccountId(account.id);
    expect(activeSessions).toHaveLength(0);
    expect(handler).toHaveBeenCalledOnce();
  });
});
