import { UnauthorizedError } from "@/core/errors/unauthorized-error";
import { TokenType } from "@/core/enums/token-type";
import { IDecryptRequest, IDecryptResponse, IEncrypter, IEncryptRequest, IEncryptResponse } from "@/modules/core/cryptography/encrypter";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "@/infra/env";

export class JwtEncrypter implements IEncrypter {
  private getTokenExpirationTime(type: TokenType) {
    switch (type) {
      case TokenType.ACCESS:
        return env.jwt.accessExpirationMinutes * 60;
      case TokenType.MFA_CHALLENGE:
        return 5 * 60;
      case TokenType.REFRESH:
      default:
        return env.jwt.refreshExpirationDays * 24 * 60 * 60;
    }
  }

  encrypt({ type, sub, version }: IEncryptRequest): IEncryptResponse {
    const expiresIn = this.getTokenExpirationTime(type);
    const token = jwt.sign({ type, version }, env.jwt.secret, {
      algorithm: "HS256",
      subject: sub,
      issuer: "simplifyerp-api",
      audience: "simplifyerp-web",
      // Guarantees token uniqueness even when two tokens are issued for the same
      // account/type/version within the same second (jwt `iat` has second granularity).
      // Session/refresh-token-hash lookups rely on the token string being unique.
      jwtid: crypto.randomUUID(),
      expiresIn,
    });

    return { token, expiresAt: new Date(Date.now() + expiresIn * 1000) };
  }

  decrypt({ token }: IDecryptRequest): IDecryptResponse {
    const payload = jwt.verify(token, env.jwt.secret, {
      algorithms: ["HS256"],
      issuer: "simplifyerp-api",
      audience: "simplifyerp-web",
    });

    if (typeof payload === "string" || !payload.sub || !payload.type) {
      throw new UnauthorizedError("Token inválido");
    }

    return payload as unknown as IDecryptResponse;
  }
}
