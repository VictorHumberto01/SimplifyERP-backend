import { TokenType } from "@/core/enums/token-type";
import { IEncryptRequest } from "@/modules/core/cryptography/encrypter";
import { faker } from "@faker-js/faker";

export function makeTokenPayload(override: Partial<IEncryptRequest> = {}): IEncryptRequest {
  return {
    type: faker.helpers.enumValue(TokenType),
    sub: faker.string.uuid(),
    version: 0,
    ...override,
  };
}
