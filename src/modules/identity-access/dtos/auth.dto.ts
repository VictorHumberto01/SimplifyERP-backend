import { IEncryptResponse } from "../cryptography/encrypter";

export interface IAuthTokens {
  access: IEncryptResponse;
  refresh: IEncryptResponse;
}

export interface IRegisterAccountDto {
  name: string;
  email: string;
  password: string;
  userAgent?: string | null;
  ip?: string | null;
}

export interface IRequestContextDto {
  userAgent?: string | null;
  ip?: string | null;
}

export interface ILoginWithEmailAndPasswordDto extends IRequestContextDto {
  email: string;
  password: string;
}

export interface IRefreshAuthDto extends IRequestContextDto {
  refreshToken: string;
}

export interface ILogoutDto {
  refreshToken: string;
}

export interface ISetupMfaDto {
  accountId: string;
}

export interface IConfirmMfaDto {
  code: string;
}

export interface IVerifyMfaDto extends IRequestContextDto {
  mfaChallengeToken: string;
  code: string;
}

export interface IForgotPasswordDto {
  email: string;
}

export interface IResetPasswordDto {
  token: string;
  newPassword: string;
}

export interface IChangePasswordDto {
  currentPassword?: string;
  newPassword: string;
}
