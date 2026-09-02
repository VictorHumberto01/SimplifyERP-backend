import { inject, injectable } from "tsyringe";
import { Session } from "../../entities/session";
import { ListActiveSessionsUseCase } from "../../use-cases/session/list-active-sessions.use-case";

@injectable()
export class ListSessionsService {
  constructor(
    @inject(ListActiveSessionsUseCase)
    private readonly listActiveSessionsUseCase: ListActiveSessionsUseCase,
  ) {}

  async execute(accountId: string): Promise<{ sessions: Session[] }> {
    return this.listActiveSessionsUseCase.execute(accountId);
  }
}
