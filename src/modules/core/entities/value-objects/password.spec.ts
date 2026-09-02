import { BadRequestError } from "@/core/errors/bad-request.error";
import { Password } from "./password";

describe("User Password Value Object", () => {
  it("should hash a strong password", () => {
    expect(Password.createNewPassword("ValidPassword123")).toBeInstanceOf(Password);
  });

  it.each(["short", "alllowercase123", "NoNumbersHere"])("should reject weak password %s", (value) => {
    expect(() => Password.createNewPassword(value)).toThrow(BadRequestError);
  });

  it("should compare passwords", async () => {
    const password = Password.createNewPassword("ValidPassword123");
    await expect(password.comparePasswords("ValidPassword123")).resolves.toBe(true);
    await expect(password.comparePasswords("InvalidPassword123")).resolves.toBe(false);
  });

  it("should load a stored hash", () => {
    const password = Password.createNewPassword("ValidPassword123");
    expect(Password.loadPassword(password.hash).hash).toBe(password.hash);
  });
});
