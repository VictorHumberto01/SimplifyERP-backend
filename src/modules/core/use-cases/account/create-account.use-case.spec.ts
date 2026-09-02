import { DuplicateResourceError } from "@/core/errors/duplicate-resource-error";
import { AccountRole } from "@/modules/core/entities/value-objects/role";
import { InMemoryAccountRepository } from "@/modules/core/tests/in-memory-account-repository";
import { CreateAccountUseCase } from "./create-account.use-case";

let sut: CreateAccountUseCase;
let repository: InMemoryAccountRepository;

const request = {
  name: "Usuário de Teste",
  email: "user@example.com",
  password: "SecurePassword123",
  role: AccountRole.USER,
};

describe("Create Account Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryAccountRepository();
    sut = new CreateAccountUseCase(repository);
  });

  it("should create an account", async () => {
    const { account } = await sut.execute(request);
    expect(account.email.value).toBe(request.email);
    expect(account.role.value).toBe(AccountRole.USER);
  });

  it("should reject an existing email", async () => {
    await sut.execute(request);
    await expect(sut.execute(request)).rejects.toThrow(DuplicateResourceError);
  });

  it("should reject invalid data", async () => {
    await expect(sut.execute({ ...request, password: "weak" })).rejects.toThrow();
  });
});
