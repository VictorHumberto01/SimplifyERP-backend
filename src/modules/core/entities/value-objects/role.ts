import { BadRequestError } from "@/core/errors/bad-request.error";

export enum AccountRole {
  SUPER_ADMIN = "super_admin",
  USER = "user",
  OWNER = "owner",
  OPERATOR = "operator",
}

export class Role {
  private constructor(private readonly _value: AccountRole) {}

  get value() {
    return this._value;
  }

  static loadRole(role: AccountRole): Role {
    if (!Object.values(AccountRole).includes(role)) {
      throw new BadRequestError("Perfil de acesso inválido.");
    }

    return new Role(role);
  }

  public hasPermission(requiredRole: AccountRole) {
    if (!Object.values(AccountRole).includes(requiredRole)) {
      throw new BadRequestError("Perfil de acesso requerido inválido.");
    }

    return this.isSuperAdmin() || this._value === requiredRole;
  }

  public isSuperAdmin() {
    return this._value === AccountRole.SUPER_ADMIN;
  }
}
