import { hashToken } from "@/core/utils/hash-token";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { CreateSessionUseCase } from "./create-session.use-case";

describe("Create Session Use Case", () => {
  it("stores a hash of the refresh token, never the raw value", async () => {
    const repository = new InMemorySessionRepository();
    const sut = new CreateSessionUseCase(repository);

    const { session } = await sut.execute({
      accountId: "account-1",
      refreshToken: "raw-refresh-token",
      expiresAt: new Date(Date.now() + 60_000),
      userAgent: "vitest",
      ip: "127.0.0.1",
    });

    expect(session.refreshTokenHash).toBe(hashToken("raw-refresh-token"));
    expect(session.refreshTokenHash).not.toBe("raw-refresh-token");
    expect(repository.items).toHaveLength(1);
  });
});
