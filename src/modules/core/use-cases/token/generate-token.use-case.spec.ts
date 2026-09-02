import { JwtEncrypter } from '@/modules/core/cryptography/jwt-encrypter';
import { IEncrypter } from '../../cryptography/encrypter';
import { makeTokenPayload } from '@/modules/core/tests/factories/make-token-payload';
import { GenerateTokenUseCase } from './generate-token.use-case';

let encrypter: IEncrypter;
let sut: GenerateTokenUseCase;

describe('Generate Token Use Case', () => {
  beforeAll(() => {
    encrypter = new JwtEncrypter();
    sut = new GenerateTokenUseCase(encrypter);
  });

  it('should generate a jwt token', () => {
    const payload = makeTokenPayload();

    const response = sut.execute({
      userId: payload.sub,
      type: payload.type,
      version: 0,
    });

    expect(response.token).toBeTruthy();
    expect(response.token).toBeTypeOf('string');
  });
});
