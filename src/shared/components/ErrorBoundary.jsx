// React class component — error boundaries MUST be class components.
// Catches render errors in any child component tree and shows a fallback UI
// instead of a blank screen. All errors are forwarded to the logger so they
// reach Sentry / Datadog in production.

import { Component } from 'react'
import logger from '../../logger/logger.service'
import styles from './ErrorBoundary.module.css'

export class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message ?? 'Unknown error' }
  }

  componentDidCatch(error, info) {
    logger.error('React ErrorBoundary caught an error', error, {
      componentStack: info.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      // Allow consumers to provide their own fallback UI
      if (this.props.fallback) return this.props.fallback

      return (
        <div className={styles.container}>
          <p className={styles.title}>Something went wrong</p>
          <p className={styles.message}>
            We hit an unexpected error. Please refresh the page.
          </p>
          <button
            className={styles.button}
            onClick={() => window.location.reload()}
          >
            Refresh page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
