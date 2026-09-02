import { hashToken } from "@/core/utils/hash-token";
import { inject, injectable } from "tsyringe";
import { Session } from "../../entities/session";
import { ISessionRepository } from "../../repositories/session-repository";

interface ICreateSessionUseCaseRequest {
  accountId: string;
  refreshToken: string;
  expiresAt: Date;
  userAgent?: string | null;
  ip?: string | null;
}

@injectable()
export class CreateSessionUseCase {
  constructor(
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute({ accountId, refreshToken, expiresAt, userAgent, ip }: ICreateSessionUseCaseRequest): Promise<{ session: Session }> {
    const session = Session.create({
      accountId,
      refreshTokenHash: hashToken(refreshToken),
      expiresAt,
      userAgent: userAgent ?? null,
      ip: ip ?? null,
    });

    await this.sessionRepository.save(session);

    return { session };
  }
}
