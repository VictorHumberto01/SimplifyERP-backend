import { JwtEncrypter } from '@/modules/identity-access/cryptography/jwt-encrypter';
import { IEncrypter } from '../../cryptography/encrypter';
import { VerifyTokenUseCase } from './verify-token.use-case';
import { makeTokenPayload } from '@/modules/identity-access/tests/factories/make-token-payload';
import { UnauthorizedError } from '@/core/errors/unauthorized-error';

let encrypter: IEncrypter;
let sut: VerifyTokenUseCase;

describe('Verify Token Use Case', () => {
  beforeAll(() => {
    encrypter = new JwtEncrypter();
    sut = new VerifyTokenUseCase(encrypter);
  });

  it('should return the decrypted token information', () => {
    const payload = makeTokenPayload();
    const { token } = encrypter.encrypt(payload);

    const response = sut.execute({ token });

    expect(response.userId).toEqual(payload.sub);
    expect(response.type).toEqual(payload.type);
  });

  it('should throw if token is invalid', async () => {
    const token: string = 'INVALID_TOKEN';

    expect(() => sut.execute({ token })).toThrow(UnauthorizedError);
  });
});
