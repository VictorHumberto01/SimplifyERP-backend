import { TokenType } from '@/core/enums/token-type';
import { IEncrypter } from '../../cryptography/encrypter';
import { inject, injectable } from 'tsyringe';

interface IGenerateTokenUseCaseRequest {
  userId: string;
  type: TokenType;
  version?: number;
}

interface IGenerateTokenUseCaseResponse {
  token: string;
  expiresAt: Date;
}

@injectable()
export class GenerateTokenUseCase {
  constructor(@inject('encrypter') private readonly encrypter: IEncrypter) {}

  execute({ userId, type, version }: IGenerateTokenUseCaseRequest): IGenerateTokenUseCaseResponse {
    const { token, expiresAt } = this.encrypter.encrypt({
      type,
      sub: userId,
      version,
    });

    return {
      token,
      expiresAt,
    };
  }
}
