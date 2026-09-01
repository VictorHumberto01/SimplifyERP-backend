import "reflect-metadata";

Object.assign(process.env, {
  NODE_ENV: "test",
  DATABASE_URL: "postgresql://test:test@localhost:5432/simplifyerp_test",
  JWT_SECRET: "test-secret-with-at-least-32-characters",
  MFA_ENCRYPTION_KEY: "0".repeat(63) + "1",
  JWT_ACCESS_EXPIRATION_MINUTES: "15",
  JWT_REFRESH_EXPIRATION_DAYS: "7",
  PASSWORD_RESET_EXPIRATION_MINUTES: "30",
  FRONTEND_URL: "http://localhost:3000",
  REDIS_HOST: "localhost",
  REDIS_PORT: "6379",
  REDIS_PASSWORD: "",
  SUPER_ADMIN_EMAIL: "admin@example.test",
  SUPER_ADMIN_PASSWORD: "AdminTest123",
  MINIO_ACCESS_KEY: "test-access-key",
  MINIO_SECRET_KEY: "test-secret-key",
  MINIO_BUCKET: "simplifyerp-test",
});
