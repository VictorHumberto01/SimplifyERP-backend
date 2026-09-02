import { Session } from "../entities/session";

export interface ISessionRepository {
  save(session: Session): Promise<Session>;
  findById(id: string): Promise<Session | null>;
  findByRefreshTokenHash(refreshTokenHash: string): Promise<Session | null>;
  listActiveByAccountId(accountId: string): Promise<Session[]>;
  revokeAllByAccountId(accountId: string): Promise<void>;
}
