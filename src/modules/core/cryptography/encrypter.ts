import { TokenType } from '@/core/enums/token-type';

export interface IEncryptRequest {
  sub: string;
  type: TokenType;
  version?: number;
}

export interface IEncryptResponse {
  token: string;
  expiresAt: Date;
}

export interface IDecryptRequest {
  token: string;
}

export interface IDecryptResponse {
  sub: string;
  type: TokenType;
  version?: number;
}

export interface IEncrypter {
  encrypt: (obj: IEncryptRequest) => IEncryptResponse;
  decrypt: (obj: IDecryptRequest) => IDecryptResponse;
}
