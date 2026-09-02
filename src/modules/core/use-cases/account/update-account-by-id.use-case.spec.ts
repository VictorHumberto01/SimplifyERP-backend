import { DuplicateResourceError } from "@/core/errors/duplicate-resource-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { makeAccount } from "@/modules/core/tests/factories/make-account";
import { InMemoryAccountRepository } from "@/modules/core/tests/in-memory-account-repository";
import { randomUUID } from "crypto";
import { UpdateAccountByIdUseCase } from "./update-account-by-id.use-case";

let sut: UpdateAccountByIdUseCase;
let repository: InMemoryAccountRepository;

describe("Update Account By Id Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository();
    sut = new UpdateAccountByIdUseCase(repository);
  });

  it("should update an account", async () => {
    const account = makeAccount();
    await repository.save(account);
    const response = await sut.execute({
      accountId: account.id,
      data: { name: "Nome Atualizado", email: "updated@example.com" },
    });
    expect(response.account.name).toBe("Nome Atualizado");
    expect(response.account.email.value).toBe("updated@example.com");
  });

  it("should throw if account is not found", async () => {
    await expect(sut.execute({ accountId: randomUUID(), data: { name: "Nome Atualizado" } }))
      .rejects.toThrow(ResourceNotFoundError);
  });

  it("should not reuse an email", async () => {
    const first = makeAccount();
    const second = makeAccount();
    await repository.save(first);
    await repository.save(second);
    await expect(sut.execute({ accountId: first.id, data: { email: second.email.value } }))
      .rejects.toThrow(DuplicateResourceError);
  });
});
