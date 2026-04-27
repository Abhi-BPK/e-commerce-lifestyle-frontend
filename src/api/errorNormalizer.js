// Normalizes every API error — Axios or mock — into one consistent shape so
// the rest of the app never has to parse different error formats.
//
// Shape: { status, message, field, code }

export function normalizeError(error) {
  // Axios error with a server response (4xx / 5xx)
  if (error?.response) {
    const { status, data } = error.response
    return {
      status,
      message: data?.message ?? data?.error ?? 'An error occurred.',
      field: data?.field ?? null,
      code: data?.code ?? null,
    }
  }

  // Axios error — request was made but no response arrived (network down)
  if (error?.request) {
    return {
      status: 0,
      message: 'Network error. Please check your connection and try again.',
      field: null,
      code: 'NETWORK_ERROR',
    }
  }

  // Already-normalized object thrown by a mock service
  if (error?.status !== undefined && error?.message) {
    return {
      status: error.status,
      message: error.message,
      field: error.field ?? null,
      code: error.code ?? null,
    }
  }

  // Fallback for truly unexpected errors
  return {
    status: 0,
    message: error?.message ?? 'An unexpected error occurred.',
    field: null,
    code: 'UNKNOWN',
  }
}
