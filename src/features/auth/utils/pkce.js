// PKCE (Proof Key for Code Exchange) utilities for Google OAuth.
//
// What is PKCE?
//   PKCE is a security extension for OAuth 2.0. Before redirecting to Google,
//   we generate two related values:
//     1. code_verifier — a random secret we keep (stored in sessionStorage)
//     2. code_challenge — the SHA-256 hash of the verifier (sent to Google)
//
//   When Google redirects back with an auth code, we send both the code AND
//   the original verifier to our backend. Google can verify that the entity
//   exchanging the code is the same one that started the flow — preventing
//   authorization code interception attacks.
//
// Why no npm package?
//   The Web Crypto API (crypto.subtle) is built into every modern browser and
//   gives us SHA-256 natively. No extra bundle size needed.

/**
 * generateCodeVerifier
 * Creates a cryptographically random 128-character URL-safe string.
 * This is the secret that stays on our side — never sent to Google directly.
 */
export function generateCodeVerifier() {
  // 96 random bytes → 128 characters when base64url-encoded (each byte = 1.33 chars)
  const array = new Uint8Array(96)
  crypto.getRandomValues(array)
  return base64urlEncode(array)
}

/**
 * generateCodeChallenge
 * Returns a Promise<string> — the base64url-encoded SHA-256 hash of the verifier.
 * This is what we send to Google up-front so they can verify us later.
 * It's async because crypto.subtle.digest returns a Promise.
 *
 * @param {string} verifier — the code_verifier generated above
 * @returns {Promise<string>}
 */
export async function generateCodeChallenge(verifier) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)

  // crypto.subtle.digest returns an ArrayBuffer containing the raw SHA-256 bytes
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return base64urlEncode(new Uint8Array(hashBuffer))
}

/**
 * base64urlEncode (internal)
 * Converts a Uint8Array to a base64url string (RFC 4648 §5).
 *
 * base64url differs from standard base64 in two ways:
 *   + → -   (so the string is safe in URLs without percent-encoding)
 *   / → _   (same reason)
 * Trailing = padding is also removed.
 * OAuth providers reject standard base64 — this encoding is required.
 */
function base64urlEncode(bytes) {
  // btoa() requires a binary string where each character represents one byte
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
