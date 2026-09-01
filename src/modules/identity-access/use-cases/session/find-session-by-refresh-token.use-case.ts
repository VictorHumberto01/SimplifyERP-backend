import { hashToken } from "@/core/utils/hash-token";
import { inject, injectable } from "tsyringe";
import { Session } from "../../entities/session";
import { ISessionRepository } from "../../repositories/session-repository";

@injectable()
export class FindSessionByRefreshTokenUseCase {
  constructor(
    @inject("sessionRepository")
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(refreshToken: string): Promise<{ session: Session | null }> {
    const session = await this.sessionRepository.findByRefreshTokenHash(hashToken(refreshToken));
    return { session };
  }
}
