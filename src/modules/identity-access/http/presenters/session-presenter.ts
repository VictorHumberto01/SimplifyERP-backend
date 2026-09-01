import { Session } from "@/modules/identity-access/entities/session";

export class SessionPresenter {
  static toHttp(session: Session) {
    return {
      id: session.id,
      userAgent: session.userAgent,
      ip: session.ip,
      createdAt: session.createdAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
    };
  }
}
