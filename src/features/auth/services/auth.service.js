// auth.service — login + signup against the .NET 8 backend.
//
// What changed:
//   The mock used an in-memory MOCK_USERS array and a fake JWT. We now hit
//   real /api/auth/login and /api/auth/signup endpoints. The signatures of
//   `login()` and `signup()` are unchanged so the calling hooks (useLogin,
//   useSignup) didn't need to be touched aside from the new cart hydration.
//
// Error handling:
//   No try/catch in this file — the response interceptor in
//   src/api/interceptors.js converts every HTTP error into the same shape
//   `{ status, message, field, code }` and rejects with it. The hooks catch
//   that shape and surface it to the form.

import api from '../../../api/axios.instance'

// ── login ─────────────────────────────────────────────────────────────────
// POST /api/auth/login   →   { token, user: { id, email, role, firstName, lastName } }
// Throws (rejection) the normalized error shape on 401 / 400 / 500 / etc.
export async function login({ email, password }) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

// ── signup ────────────────────────────────────────────────────────────────
// POST /api/auth/signup  →  { success: true }
//
// `data` is whatever SignupForm passes through:
//   { firstName, lastName, email, password, confirmPassword, role? }
// The backend validates everything (email format, password length,
// matching confirmPassword, unique email). On a duplicate email it returns
// 409 with { field: 'email', code: 'EMAIL_TAKEN' } which the form surfaces
// as an inline error.
export async function signup(data) {
  const response = await api.post('/auth/signup', data)
  return response.data
}

// ── loginWithGoogle ───────────────────────────────────────────────────────────
// POST /api/auth/oidc/google  →  { token, user }
//
// The backend receives the authorization code and exchanges it with Google's
// token endpoint on our behalf (server-to-server). We never touch Google's
// tokens directly — we only pass the code and PKCE verifier.
//
// codeVerifier: required by Google when PKCE was used in the authorization request.
//   We generated it in initiateGoogleLogin() and stored it in sessionStorage.
// redirectUri: must exactly match what was used in the authorization URL —
//   Google validates this server-side.
export async function loginWithGoogle({ code, redirectUri, codeVerifier }) {
  const response = await api.post('/auth/oidc/google', { code, redirectUri, codeVerifier })
  return response.data
}

// ── loginWithGithub ───────────────────────────────────────────────────────────
// POST /api/auth/oidc/github  →  { token, user }
//
// Same pattern as loginWithGoogle but without PKCE — GitHub's OAuth App flow
// does not support it. The backend exchanges the code with GitHub, fetches the
// user profile (and email if hidden), then returns a JWT.
export async function loginWithGithub({ code, redirectUri }) {
  const response = await api.post('/auth/oidc/github', { code, redirectUri })
  return response.data
}
