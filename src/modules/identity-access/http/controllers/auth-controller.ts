import {
  IChangePasswordDto,
  IConfirmMfaDto,
  IForgotPasswordDto,
  ILoginWithEmailAndPasswordDto,
  ILogoutDto,
  IRefreshAuthDto,
  IRegisterAccountDto,
  IResetPasswordDto,
  IVerifyMfaDto,
} from "@/modules/identity-access/dtos/auth.dto";
import { ChangePasswordService } from "@/modules/identity-access/services/auth/change-password-service";
import { CredentialsLoginService } from "@/modules/identity-access/services/auth/credentials-login-service";
import { ForgotPasswordService } from "@/modules/identity-access/services/auth/forgot-password-service";
import { LogoutService } from "@/modules/identity-access/services/auth/logout-service";
import { RefreshAuthService } from "@/modules/identity-access/services/auth/refresh-auth-service";
import { RegisterAccountService } from "@/modules/identity-access/services/auth/register-account-service";
import { ResetPasswordService } from "@/modules/identity-access/services/auth/reset-password-service";
import { ConfirmMfaService } from "@/modules/identity-access/services/mfa/confirm-mfa-service";
import { SetupMfaService } from "@/modules/identity-access/services/mfa/setup-mfa-service";
import { VerifyMfaService } from "@/modules/identity-access/services/mfa/verify-mfa-service";
import { FastifyReply, FastifyRequest } from "fastify";
import { container, injectable } from "tsyringe";
import { AccountPresenter } from "@/modules/identity-access/http/presenters/account-presenter";

function requestContext(req: FastifyRequest) {
  return { userAgent: req.headers["user-agent"] ?? null, ip: req.ip };
}

@injectable()
export class AuthController {
  public async register(req: FastifyRequest<{ Body: IRegisterAccountDto }>, reply: FastifyReply) {
    const command = container.resolve(RegisterAccountService);
    const { account, accessToken, refreshToken } = await command.execute({
      ...req.body,
      ...requestContext(req),
    });

    return reply.status(201).send({
      account: AccountPresenter.toHttp(account),
      tokens: { accessToken, refreshToken },
    });
  }

  public async login(req: FastifyRequest<{ Body: ILoginWithEmailAndPasswordDto }>, reply: FastifyReply) {
    const command = container.resolve(CredentialsLoginService);
    const result = await command.login({ ...req.body, ...requestContext(req) });

    if (result.mfaRequired) {
      return reply.status(200).send({ mfaRequired: true, mfaChallengeToken: result.mfaChallengeToken });
    }

    return reply.status(200).send({
      mfaRequired: false,
      account: AccountPresenter.toHttp(result.account),
      tokens: { accessToken: result.accessToken, refreshToken: result.refreshToken },
    });
  }

  public async refreshAuth(req: FastifyRequest<{ Body: IRefreshAuthDto }>, reply: FastifyReply) {
    const command = container.resolve(RefreshAuthService);
    const { tokens, account } = await command.execute({ ...req.body, ...requestContext(req) });
    return reply.status(200).send({ tokens, account: AccountPresenter.toHttp(account) });
  }

  public async logout(req: FastifyRequest<{ Body: ILogoutDto }>, reply: FastifyReply) {
    await container.resolve(LogoutService).execute(req.body);
    return reply.status(200).send({ message: "Sessão encerrada com sucesso." });
  }

  public async me(req: FastifyRequest, reply: FastifyReply) {
    return reply.status(200).send({ account: AccountPresenter.toHttp(req.account) });
  }

  public async forgotPassword(req: FastifyRequest<{ Body: IForgotPasswordDto }>, reply: FastifyReply) {
    await container.resolve(ForgotPasswordService).execute(req.body);
    return reply.status(200).send({ message: "Se este e-mail estiver cadastrado, um link de recuperação será enviado." });
  }

  public async resetPassword(req: FastifyRequest<{ Body: IResetPasswordDto }>, reply: FastifyReply) {
    await container.resolve(ResetPasswordService).execute(req.body);
    return reply.status(200).send({ message: "Senha redefinida com sucesso." });
  }

  public async changePassword(req: FastifyRequest<{ Body: IChangePasswordDto }>, reply: FastifyReply) {
    await container.resolve(ChangePasswordService).execute(req.account.id, req.body);
    return reply.status(200).send({ message: "Senha alterada com sucesso." });
  }

  public async setupMfa(req: FastifyRequest, reply: FastifyReply) {
    const { otpauthUrl } = await container.resolve(SetupMfaService).execute(req.account.id);
    return reply.status(200).send({ otpauthUrl });
  }

  public async confirmMfa(req: FastifyRequest<{ Body: IConfirmMfaDto }>, reply: FastifyReply) {
    await container.resolve(ConfirmMfaService).execute(req.account.id, req.body.code);
    return reply.status(200).send({ message: "MFA habilitado com sucesso." });
  }

  public async verifyMfa(req: FastifyRequest<{ Body: IVerifyMfaDto }>, reply: FastifyReply) {
    const command = container.resolve(VerifyMfaService);
    const { account, accessToken, refreshToken } = await command.execute({ ...req.body, ...requestContext(req) });

    return reply
      .status(200)
      .send({ account: AccountPresenter.toHttp(account), tokens: { accessToken, refreshToken } });
  }
}
