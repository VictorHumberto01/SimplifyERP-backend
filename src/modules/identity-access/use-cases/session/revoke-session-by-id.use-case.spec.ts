import { ForbiddenError } from "@/core/errors/forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InMemorySessionRepository } from "@/modules/identity-access/tests/in-memory-session-repository";
import { CreateSessionUseCase } from "./create-session.use-case";
import { RevokeSessionByIdUseCase } from "./revoke-session-by-id.use-case";

describe("Revoke Session By Id Use Case", () => {
  it("revokes a session owned by the requester", async () => {
    const repository = new InMemorySessionRepository();
    const createSessionUseCase = new CreateSessionUseCase(repository);
    const sut = new RevokeSessionByIdUseCase(repository);

    const { session } = await createSessionUseCase.execute({
      accountId: "account-1",
      refreshToken: "token",
      expiresAt: new Date(Date.now() + 60_000),
    });

    await sut.execute(session.id, "account-1");

    const updated = await repository.findById(session.id);
    expect(updated?.revokedAt).not.toBeNull();
  });

  it("rejects revoking a session that belongs to a different account", async () => {
    const repository = new InMemorySessionRepository();
    const createSessionUseCase = new CreateSessionUseCase(repository);
    const sut = new RevokeSessionByIdUseCase(repository);

    const { session } = await createSessionUseCase.execute({
      accountId: "account-1",
      refreshToken: "token",
      expiresAt: new Date(Date.now() + 60_000),
    });

    await expect(sut.execute(session.id, "account-2")).rejects.toThrow(ForbiddenError);
  });

  it("rejects revoking a session that does not exist", async () => {
    const repository = new InMemorySessionRepository();
    const sut = new RevokeSessionByIdUseCase(repository);

    await expect(sut.execute("unknown-id", "account-1")).rejects.toThrow(ResourceNotFoundError);
  });
});
