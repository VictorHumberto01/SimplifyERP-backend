import { inject, injectable } from "tsyringe";
import { DomainEvents } from "@/core/events/domain-events";
import { ILogoutDto } from "../../dtos/auth.dto";
import { ISessionRepository } from "../../repositories/session-repository";
import { AccountLoggedOutEvent } from "../../events/account-logged-out.event";
import { FindSessionByRefreshTokenUseCase } from "../../use-cases/session/find-session-by-refresh-token.use-case";

@injectable()
export class LogoutService {
  constructor(
    @inject(FindSessionByRefreshTokenUseCase)
    private readonly findSessionByRefreshTokenUseCase: FindSessionByRefreshTokenUseCase,
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute({ refreshToken }: ILogoutDto): Promise<void> {
    const { session } = await this.findSessionByRefreshTokenUseCase.execute(refreshToken);

    if (!session || session.revokedAt !== null) {
      return;
    }

    session.revoke();
    await this.sessionRepository.save(session);

    DomainEvents.dispatchImmediate(new AccountLoggedOutEvent(session.accountId));
  }
}
