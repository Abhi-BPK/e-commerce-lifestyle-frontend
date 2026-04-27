// Login page — thin orchestration shell.
// All login logic lives in useLogin; all UI lives in LoginForm.
// This page is responsible for:
//   1. Calling useLogin() to get the form action and state
//   2. Rendering the card layout and wordmark
//   3. Passing props down to LoginForm

import { useLogin } from '../hooks/useLogin'
import { LoginForm } from '../components/LoginForm'
import styles from './Login.module.css'

export default function Login() {
  const { state, formAction, isPending } = useLogin()

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        {/* Brand wordmark */}
        <p className={styles.wordmark}>DOPPEY</p>

        {/* Headings */}
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subheading}>Sign in to your account</p>

        <LoginForm
          formAction={formAction}
          state={state}
          isPending={isPending}
        />
      </div>
    </main>
  )
}
