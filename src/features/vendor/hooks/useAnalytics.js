// Fetches analytics data once on mount.
// The analytics page is read-only — no mutations needed.

import { useState, useEffect } from 'react'
import { getAnalytics } from '../services/vendor.analytics.service'
import logger from '../../../logger/logger.service'

export function useAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    getAnalytics()
      .then(setAnalytics)
      .catch((err) => { setError('Failed to load analytics'); logger.error('useAnalytics fetch', err) })
      .finally(() => setLoading(false))
  }, [])

  return { analytics, loading, error }
}
