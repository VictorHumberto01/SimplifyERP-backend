import { PrismaClient } from '@prisma/client';

export class PrismaDatabaseSingleton {
  private static instance: PrismaClient;
  private constructor() {}

  static getInstance(): PrismaClient {
    if (!PrismaDatabaseSingleton.instance) {
      PrismaDatabaseSingleton.instance = new PrismaClient();
    }
    return PrismaDatabaseSingleton.instance;
  }
}
