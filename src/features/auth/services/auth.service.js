// Mock auth service — replace the function bodies with real Axios calls
// when the .NET Core API is ready. The interface (parameters and return shape)
// must stay the same so the hooks that call these functions don't change.

import { normalizeError } from '../../../api/errorNormalizer'

// Simulates network latency so the UI loading states are testable
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_USERS = [
  {
    id: 1,
    email: 'user@demo.com',
    password: 'password123',
    role: 'user',
    firstName: 'Alex',
    lastName: 'Carter',
  },
  {
    id: 2,
    email: 'vendor@demo.com',
    password: 'vendor123',
    role: 'vendor',
    firstName: 'Jordan',
    lastName: 'Blake',
  },
]

// Produces a fake JWT-like string (not a real JWT — backend will issue real ones)
function generateFakeToken(user) {
  const payload = btoa(JSON.stringify({ sub: user.email, role: user.role, iat: Date.now() }))
  return `fake.${payload}.token`
}

// Returns a user object with the password field removed.
// Object.fromEntries avoids the unused-variable lint error that destructuring
// rest spread triggers when the discarded key has no other use.
function safeUser(user) {
  return Object.fromEntries(Object.entries(user).filter(([k]) => k !== 'password'))
}

// ── login ─────────────────────────────────────────────────────────────────
// Returns: { token: string, user: { id, email, role, firstName, lastName } }
// Throws:  normalized error object { status, message, field, code }

export async function login({ email, password }) {
  await delay(700)

  const match = MOCK_USERS.find(
    (u) => u.email === email && u.password === password,
  )

  if (!match) {
    // Throw in the same normalized shape the Axios interceptor would produce,
    // so the hook that calls login() always receives the same error shape
    // regardless of whether this is the mock or the real API.
    throw normalizeError({
      response: {
        status: 401,
        data: { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
      },
    })
  }

  return {
    token: generateFakeToken(match),
    user: safeUser(match),
  }
}

// ── signup ────────────────────────────────────────────────────────────────
// Returns: { success: true }
// Throws:  normalized error object

// Accepts the full form payload as a single object so no individual field
// is ever "unused" — the whole object is logged and will be forwarded to the
// real API when it's ready.
export async function signup(data) {
  await delay(700)

  const alreadyExists = MOCK_USERS.some((u) => u.email === data.email)
  if (alreadyExists) {
    throw normalizeError({
      response: {
        status: 409,
        data: {
          message: 'An account with this email already exists.',
          field: 'email',
          code: 'EMAIL_TAKEN',
        },
      },
    })
  }

  // In production this will be replaced with an Axios POST to /api/auth/signup
  console.log('Signup data (mock — not persisted):', data)

  return { success: true }
}
