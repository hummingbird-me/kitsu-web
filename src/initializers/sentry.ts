import * as Sentry from '@sentry/react';

if (import.meta.env.SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.SENTRY_DSN as string,
    environment: import.meta.env.MODE,
  });
}
