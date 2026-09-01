import { BadRequestError } from "@/core/errors/bad-request.error";
import bcrypt from "bcryptjs";

export class Password {
  private static readonly PASSWORD_SALT_ROUNDS = 12;

  private constructor(public readonly hash: string) {}

  static loadPassword(hash: string): Password {
    return new Password(hash);
  }

  static createNewPassword(password: string): Password {
    if (!this.isPasswordValid(password)) {
      throw new BadRequestError(
        "A senha deve ter pelo menos 8 caracteres, uma letra maiúscula e um número.",
      );
    }

    return new Password(bcrypt.hashSync(password, Password.PASSWORD_SALT_ROUNDS));
  }

  private static isPasswordValid(password: string): boolean {
    return Boolean(
      password &&
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password),
    );
  }

  public comparePasswords(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.hash);
  }
}
