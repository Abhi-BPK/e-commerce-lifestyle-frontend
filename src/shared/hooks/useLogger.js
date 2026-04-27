// Convenience hook — gives components access to the logger without a
// direct import path dependency on the logger module location.

import logger from '../../logger/logger.service'

export function useLogger() {
  return logger
}
