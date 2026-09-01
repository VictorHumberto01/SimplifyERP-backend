import { Account } from '@/modules/identity-access/entities/account';

declare module 'fastify' {
  export interface FastifyRequest {
    account: Account;
  }
}
