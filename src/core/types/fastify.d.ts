import { Account } from '@/modules/core/entities/account';

declare module 'fastify' {
  export interface FastifyRequest {
    account: Account;
  }
}
