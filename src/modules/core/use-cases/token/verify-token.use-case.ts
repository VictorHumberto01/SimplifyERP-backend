import { TokenType } from "@/core/enums/token-type";
import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { inject, injectable } from "tsyringe";
import { IEncrypter } from "../../cryptography/encrypter";

interface Request {
  token: string;
}

interface Response {
  userId: string;
  type: TokenType;
  version?: number;
}

@injectable()
export class VerifyTokenUseCase {
  constructor(@inject("encrypter") private readonly encrypter: IEncrypter) {}

  execute({ token }: Request): Response {
    try {
      const { sub, type, version } = this.encrypter.decrypt({ token });
      return { userId: sub, type, version };
    } catch {
      throw new UnauthorizedError("Token inválido");
    }
  }
}
