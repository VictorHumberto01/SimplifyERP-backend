import { ForbiddenError } from "@/core/errors/forbidden-error";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { inject, injectable } from "tsyringe";
import { ISessionRepository } from "../../repositories/session-repository";

@injectable()
export class RevokeSessionByIdUseCase {
  constructor(
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(sessionId: string, requesterAccountId: string): Promise<void> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session) {
      throw new ResourceNotFoundError("Sessão não encontrada.");
    }

    if (session.accountId !== requesterAccountId) {
      throw new ForbiddenError("Você não pode encerrar a sessão de outra conta.");
    }

    session.revoke();
    await this.sessionRepository.save(session);
  }
}
