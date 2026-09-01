import pino from "pino";

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = pino(
  isDevelopment
    ? {
        transport: {
          target: "pino-pretty",
          options: { levelFirst: true, colorize: true, translateTime: "dd/mm/yyyy HH:MM:ss" },
        },
      }
    : undefined,
);
