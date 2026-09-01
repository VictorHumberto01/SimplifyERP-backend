import * as Sentry from '@sentry/node';
import env from '../env';

export function initSentry() {
  if (env.nodeEnv !== 'production') return;

  Sentry.init({
    dsn: env.sentryDsn,
    tracesSampleRate: 0.1,
    environment: env.nodeEnv,
  });
}
