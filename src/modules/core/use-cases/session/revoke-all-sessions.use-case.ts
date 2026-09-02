import { inject, injectable } from "tsyringe";
import { ISessionRepository } from "../../repositories/session-repository";

@injectable()
export class RevokeAllSessionsUseCase {
  constructor(
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(accountId: string): Promise<void> {
    await this.sessionRepository.revokeAllByAccountId(accountId);
  }
}
