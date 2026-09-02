import { logger } from "@/core/logger";
import { Password } from "@/modules/core/entities/value-objects/password";
import { AccountRole } from "@/modules/core/entities/value-objects/role";
import env from "@/infra/env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function initialSeed() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: env.superAdmin.email },
  });

  if (existingAdmin) return;

  await prisma.user.create({
    data: {
      name: "Administrador",
      email: env.superAdmin.email,
      password: Password.createNewPassword(env.superAdmin.password).hash,
      role: AccountRole.SUPER_ADMIN,
      mustChangePassword: true,
    },
  });

  logger.info("Conta inicial de superadministrador criada");
}
