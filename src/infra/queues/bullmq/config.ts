import { JobsOptions } from "bullmq";

export const defaultJobOptions: JobsOptions = {
  attempts: 3,
  backoff: { type: "exponential", delay: 5_000 },
  removeOnComplete: 100,
  removeOnFail: 500,
};
