// Blocks navigation away from a page when the user has unsaved changes.
// Uses React Router v7's useBlocker. Pass shouldBlock=true to activate.
// The returned blocker object has:
//   blocker.state  — 'unblocked' | 'blocked' | 'proceeding'
//   blocker.proceed()  — confirm and continue navigation
//   blocker.reset()    — cancel and stay on the current page

import { useBlocker } from 'react-router-dom'

export function useNavigationGuard(shouldBlock) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      shouldBlock && currentLocation.pathname !== nextLocation.pathname,
  )

  return blocker
}
