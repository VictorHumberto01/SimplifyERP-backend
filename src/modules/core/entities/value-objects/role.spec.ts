import { BadRequestError } from "@/core/errors/bad-request.error";
import { AccountRole, Role } from "./role";

describe("Role Value Object", () => {
  it("should create a valid role", () => {
    expect(Role.loadRole(AccountRole.USER).value).toBe(AccountRole.USER);
  });

  it("should reject an invalid role", () => {
    expect(() => Role.loadRole("invalid" as AccountRole)).toThrow(BadRequestError);
  });

  it("should allow super admin to access user permissions", () => {
    const role = Role.loadRole(AccountRole.SUPER_ADMIN);
    expect(role.hasPermission(AccountRole.USER)).toBe(true);
  });

  it("should not allow a normal user to access super admin permissions", () => {
    const role = Role.loadRole(AccountRole.USER);
    expect(role.hasPermission(AccountRole.SUPER_ADMIN)).toBe(false);
  });
});
