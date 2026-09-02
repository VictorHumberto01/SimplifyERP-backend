import { FastifyReply, FastifyRequest } from 'fastify';
import { AccountPresenter } from '@/modules/core/http/presenters/account-presenter';
import { IUpdateAccountDto } from '@/modules/core/dtos/account.dto';
import { container, injectable } from 'tsyringe';
import { ShowAccountService } from '@/modules/core/services/account/show-account-service';
import { IListAccountsFilters } from '@/modules/core/repositories/account-repository';
import { Pagination } from '@/core/types/pagination';
import { ListAccountsService } from '@/modules/core/services/account/list-accounts-service';
import { UpdateAccountService } from '@/modules/core/services/account/update-account-service';
import { DeleteAccountService } from '@/modules/core/services/account/delete-account-service';

@injectable()
export class AccountController {
  public async showAccount(
    req: FastifyRequest<{ Params: { accountId: string } }>,
    reply: FastifyReply
  ) {
    const { accountId } = req.params;
    const requester = req.account;

    const command = container.resolve(ShowAccountService);

    const { account } = await command.execute(
      {
        accountId,
      },
      requester
    );

    return reply.status(200).send(AccountPresenter.toHttp(account));
  }

  public async listAccounts(
    req: FastifyRequest<{ Querystring: IListAccountsFilters & Pagination }>,
    reply: FastifyReply
  ) {
    const requester = req.account;
    const { limit, page, ...filters } = req.query;

    const command = container.resolve(ListAccountsService);

    const { accounts } = await command.execute(
      {
        filters,
        pagination: {
          limit: Number(limit) || 10,
          page: Number(page) || 1,
        },
      },
      requester
    );

    return reply.status(200).send(accounts.map(AccountPresenter.toHttp));
  }

  public async update(
    req: FastifyRequest<{
      Params: { accountId: string };
      Body: IUpdateAccountDto;
    }>,
    reply: FastifyReply
  ) {
    const requester = req.account;
    const data = req.body;
    const { accountId } = req.params;

    const command = container.resolve(UpdateAccountService);

    const { account } = await command.execute(accountId, data, requester);

    return reply.status(200).send(AccountPresenter.toHttp(account));
  }

  public async delete(req: FastifyRequest<{ Params: { accountId: string } }>, reply: FastifyReply) {
    const requester = req.account;
    const { accountId } = req.params;

    const command = container.resolve(DeleteAccountService);

    await command.execute({ accountId }, requester);

    return reply.status(200).send({ message: 'Conta deletada com sucesso.' });
  }
}
