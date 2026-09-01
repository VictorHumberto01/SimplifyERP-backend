import { inject, injectable } from "tsyringe";
import { Session } from "../../entities/session";
import { ISessionRepository } from "../../repositories/session-repository";

@injectable()
export class ListActiveSessionsUseCase {
  constructor(
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(accountId: string): Promise<{ sessions: Session[] }> {
    const sessions = await this.sessionRepository.listActiveByAccountId(accountId);
    return { sessions };
  }
}
