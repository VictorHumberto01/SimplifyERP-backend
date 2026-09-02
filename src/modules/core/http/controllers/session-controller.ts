import { FastifyReply, FastifyRequest } from "fastify";
import { container, injectable } from "tsyringe";
import { ListSessionsService } from "@/modules/core/services/session/list-sessions-service";
import { RevokeSessionService } from "@/modules/core/services/session/revoke-session-service";
import { SessionPresenter } from "@/modules/core/http/presenters/session-presenter";

@injectable()
export class SessionController {
  public async list(req: FastifyRequest, reply: FastifyReply) {
    const { sessions } = await container.resolve(ListSessionsService).execute(req.account.id);
    return reply.status(200).send(sessions.map(SessionPresenter.toHttp));
  }

  public async revoke(req: FastifyRequest<{ Params: { sessionId: string } }>, reply: FastifyReply) {
    await container.resolve(RevokeSessionService).execute(req.params.sessionId, req.account.id);
    return reply.status(200).send({ message: "Sessão encerrada com sucesso." });
  }
}
