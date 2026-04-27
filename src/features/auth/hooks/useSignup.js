// Encapsulates signup submission logic.
// SignupForm uses React Hook Form for validation; this hook manages the
// async lifecycle (loading, success, error) after RHF passes valid data.

import { useState } from 'react'
import { signup } from '../services/auth.service'
import logger from '../../../logger/logger.service'

export function useSignup() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState(null)

  async function handleSignup(data) {
    setIsLoading(true)
    setError(null)
    logger.info('Signup attempt', { email: data.email, role: data.role })

    try {
      await signup(data)
      setIsSuccess(true)
      logger.info('Signup successful', { email: data.email })
    } catch (err) {
      // err is a normalized error object from auth.service.js
      setError(err)
      logger.warn('Signup failed', { email: data.email, error: err })
    } finally {
      setIsLoading(false)
    }
  }

  return { handleSignup, isLoading, isSuccess, error }
}
