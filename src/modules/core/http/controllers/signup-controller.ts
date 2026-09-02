import { FastifyReply, FastifyRequest } from "fastify";
import { container, injectable } from "tsyringe";
import { ISignupDto } from "@/modules/core/dtos/signup.dto";
import { SignupService } from "@/modules/core/services/tenant/signup-service";
import { AccountPresenter } from "@/modules/core/http/presenters/account-presenter";
import { TenantPresenter } from "@/modules/core/http/presenters/tenant-presenter";
import { EstablishmentPresenter } from "@/modules/core/http/presenters/establishment-presenter";

@injectable()
export class SignupController {
  public async signup(req: FastifyRequest<{ Body: ISignupDto }>, reply: FastifyReply) {
    const command = container.resolve(SignupService);
    const { account, tenant, establishment, accessToken, refreshToken } = await command.execute(
      {
        ...req.body,
        userAgent: req.headers["user-agent"] ?? null,
        ip: req.ip,
      },
      req.account,
    );

    return reply.status(201).send({
      account: AccountPresenter.toHttp(account),
      tenant: TenantPresenter.toHttp(tenant),
      establishment: EstablishmentPresenter.toHttp(establishment),
      tokens: { accessToken, refreshToken },
    });
  }
}
