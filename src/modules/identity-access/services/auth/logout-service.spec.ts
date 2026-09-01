import { DomainEvents } from "@/core/events/domain-events";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { AccountLoggedOutEvent } from "../../events/account-logged-out.event";
import { FindSessionByRefreshTokenUseCase } from "../../use-cases/session/find-session-by-refresh-token.use-case";
import { CreateSessionUseCase } from "../../use-cases/session/create-session.use-case";
import { LogoutService } from "./logout-service";

describe("Logout Service", () => {
  afterEach(() => {
    DomainEvents.clearHandlers();
  });

  it("revokes the session matching the refresh token and dispatches AccountLoggedOutEvent", async () => {
    const sessionRepository = new InMemorySessionRepository();
    const createSessionUseCase = new CreateSessionUseCase(sessionRepository);
    const findSessionByRefreshTokenUseCase = new FindSessionByRefreshTokenUseCase(sessionRepository);
    const sut = new LogoutService(findSessionByRefreshTokenUseCase, sessionRepository);

    const { session } = await createSessionUseCase.execute({
      accountId: "account-1",
      refreshToken: "refresh-token",
      expiresAt: new Date(Date.now() + 60_000),
    });

    const handler = vi.fn();
    DomainEvents.register(handler, AccountLoggedOutEvent.name);

    await sut.execute({ refreshToken: "refresh-token" });

    const updated = await sessionRepository.findById(session.id);
    expect(updated?.revokedAt).not.toBeNull();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does nothing when the refresh token has no matching session", async () => {
    const sessionRepository = new InMemorySessionRepository();
    const findSessionByRefreshTokenUseCase = new FindSessionByRefreshTokenUseCase(sessionRepository);
    const sut = new LogoutService(findSessionByRefreshTokenUseCase, sessionRepository);

    await expect(sut.execute({ refreshToken: "unknown" })).resolves.not.toThrow();
  });
});
