import { inject, injectable } from "tsyringe";
import { RevokeSessionByIdUseCase } from "../../use-cases/session/revoke-session-by-id.use-case";

@injectable()
export class RevokeSessionService {
  constructor(
    @inject(RevokeSessionByIdUseCase)
    private readonly revokeSessionByIdUseCase: RevokeSessionByIdUseCase,
  ) {}

  async execute(sessionId: string, requesterAccountId: string): Promise<void> {
    await this.revokeSessionByIdUseCase.execute(sessionId, requesterAccountId);
  }
}
