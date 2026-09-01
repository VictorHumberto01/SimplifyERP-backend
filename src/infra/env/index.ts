import dotenv from "dotenv";
import * as yup from "yup";

dotenv.config();

const envVarsSchema = yup.object({
  NODE_ENV: yup.string().oneOf(["development", "production", "test"]).default("development"),
  DATABASE_URL: yup.string().required("DATABASE_URL é obrigatório"),
  PORT: yup.number().default(3333),
  JWT_SECRET: yup.string().min(32, "JWT_SECRET deve ter ao menos 32 caracteres").required(),
  // Opcional: sem essa chave, o servidor sobe normalmente e o MFA fica indisponível
  // (endpoints de setup/confirmação retornam erro 400 em vez de derrubar o boot).
  MFA_ENCRYPTION_KEY: yup
    .string()
    .matches(/^[0-9a-fA-F]{64}$/, "MFA_ENCRYPTION_KEY deve ter 64 caracteres hexadecimais (32 bytes)")
    .notRequired(),
  JWT_ACCESS_EXPIRATION_MINUTES: yup.number().positive().default(15),
  JWT_REFRESH_EXPIRATION_DAYS: yup.number().positive().default(7),
  PASSWORD_RESET_EXPIRATION_MINUTES: yup.number().positive().default(30),
  FRONTEND_URL: yup
    .string()
    .required("FRONTEND_URL é obrigatório")
    .test("valid-url", "FRONTEND_URL deve ser uma URL válida", (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }),
  REDIS_HOST: yup.string().default("localhost"),
  REDIS_PORT: yup.number().default(6379),
  REDIS_PASSWORD: yup.string().default(""),
  SENTRY_DSN: yup.string().default(""),
  SUPER_ADMIN_EMAIL: yup.string().email().required("SUPER_ADMIN_EMAIL é obrigatório"),
  SUPER_ADMIN_PASSWORD: yup.string().required("SUPER_ADMIN_PASSWORD é obrigatório"),
  RESEND_API_KEY: yup.string().default(""),
  RESEND_FROM_EMAIL: yup.string().default("SimplifyERP <noreply@example.com>"),
  MINIO_ENDPOINT: yup.string().default("localhost"),
  MINIO_PORT: yup.number().default(9000),
  MINIO_USE_SSL: yup.boolean().default(false),
  MINIO_ACCESS_KEY: yup.string().required("MINIO_ACCESS_KEY é obrigatório"),
  MINIO_SECRET_KEY: yup.string().required("MINIO_SECRET_KEY é obrigatório"),
  MINIO_BUCKET: yup.string().default("simplifyerp"),
});

const envVars = envVarsSchema.validateSync(process.env, { abortEarly: false });

export default {
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  port: envVars.PORT,
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  mfaEncryptionKey: envVars.MFA_ENCRYPTION_KEY,
  passwordResetExpirationMinutes: envVars.PASSWORD_RESET_EXPIRATION_MINUTES,
  frontendUrl: envVars.FRONTEND_URL,
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT,
    password: envVars.REDIS_PASSWORD,
  },
  sentryDsn: envVars.SENTRY_DSN,
  superAdmin: {
    email: envVars.SUPER_ADMIN_EMAIL,
    password: envVars.SUPER_ADMIN_PASSWORD,
  },
  resend: {
    apiKey: envVars.RESEND_API_KEY,
    fromEmail: envVars.RESEND_FROM_EMAIL,
  },
  minio: {
    endpoint: envVars.MINIO_ENDPOINT,
    port: envVars.MINIO_PORT,
    useSSL: envVars.MINIO_USE_SSL,
    accessKey: envVars.MINIO_ACCESS_KEY,
    secretKey: envVars.MINIO_SECRET_KEY,
    bucket: envVars.MINIO_BUCKET,
  },
};
