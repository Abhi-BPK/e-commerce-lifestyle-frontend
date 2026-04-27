// Single logger interface — swap the provider here without touching any call site.
// Currently uses console; replace the internals with Sentry / Datadog in production.

const isDev = import.meta.env.DEV

function stamp() {
  return new Date().toISOString()
}

const logger = {
  debug(message, meta = {}) {
    if (!isDev) return
    console.debug({ level: 'debug', message, timestamp: stamp(), ...meta })
  },

  info(message, meta = {}) {
    console.info({ level: 'info', message, timestamp: stamp(), ...meta })
    // production: analytics.track(message, meta)
  },

  warn(message, meta = {}) {
    console.warn({ level: 'warn', message, timestamp: stamp(), ...meta })
    // production: Sentry.captureMessage(message, { level: 'warning', extra: meta })
  },

  // error() accepts a real Error object as the second argument so Sentry can
  // extract the stack trace cleanly.
  error(message, error, meta = {}) {
    console.error({ level: 'error', message, error, timestamp: stamp(), ...meta })
    // production: Sentry.captureException(error, { extra: { message, ...meta } })
  },
}

export default logger
