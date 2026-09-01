import { FastifyInstance } from 'fastify';
import { AccountController } from '@/modules/identity-access/http/controllers/account-controller';
import { authenticate } from '@/infra/http/middlewares/authenticate';
import { httpValidate } from '@/infra/http/middlewares/http-validate';
import { AccountValidation } from '@/modules/identity-access/http/validations/account-validation';
import { container } from 'tsyringe';

const accountController = container.resolve(AccountController);

export async function accountRoutes(app: FastifyInstance) {
  app.get(
    '/:accountId',
    { preHandler: [authenticate, httpValidate(AccountValidation.show())] },
    accountController.showAccount.bind(accountController)
  );

  app.get(
    '/',
    { preHandler: [authenticate] },
    accountController.listAccounts.bind(accountController)
  );

  app.put(
    '/:accountId',
    { preHandler: [authenticate, httpValidate(AccountValidation.update())] },
    accountController.update.bind(accountController)
  );

  app.delete(
    '/:accountId',
    { preHandler: authenticate },
    accountController.delete.bind(accountController)
  );
}
