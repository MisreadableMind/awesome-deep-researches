# OAuth 2.0 and OpenID Connect: Complete Technical Deep Dive

---

## Table of Contents

1. [History and Overview](#1-history-and-overview)
2. [Core Concept](#2-core-concept)
3. [Key Participants and Roles](#3-key-participants-and-roles)
4. [How It Works - Step by Step](#4-how-it-works---step-by-step)
5. [Technical Architecture](#5-technical-architecture)
6. [Money Flow / Economics](#6-money-flow--economics)
7. [Security and Risk](#7-security-and-risk)
8. [Regulation and Compliance](#8-regulation-and-compliance)
9. [Comparisons and Alternatives](#9-comparisons-and-alternatives)
10. [Modern Developments](#10-modern-developments)
11. [Appendix](#11-appendix)
12. [Key Takeaways](#12-key-takeaways)

---

## 1. History and Overview

### 1.1 Before OAuth: The Password Anti-Pattern

Before OAuth existed, if one application needed to access your data on another application, the only option was to hand over your username and password. This was called the **password anti-pattern**, and it was everywhere.

**The Flickr-to-Printer Example.** Imagine it is 2005. You want to print your Flickr photos using a third-party printing service called PrintMyPhotos. PrintMyPhotos needs to access your Flickr account to download your images. The only way to do this: you type your Flickr username and password directly into the PrintMyPhotos website. PrintMyPhotos stores your credentials in plaintext, logs into Flickr on your behalf, and scrapes your photos.

The problems were staggering:

- **Full access.** PrintMyPhotos had your password, meaning it could do anything you could do: delete photos, change your profile, read private messages.
- **No revocation.** The only way to revoke access was to change your password, which broke every other app you had given your credentials to.
- **Password reuse.** Users frequently used the same password across sites, so a breach at PrintMyPhotos could compromise your Flickr, email, and bank accounts.
- **No audit trail.** Flickr could not distinguish between you logging in and PrintMyPhotos logging in.

This pattern was not limited to niche photo apps. Twitter, Facebook, and Google all faced the same problem as third-party developers built applications on top of their platforms.

### 1.2 OAuth 1.0 (2007-2010): The First Solution

**Blaine Cook**, the lead developer at Twitter, was one of the first to formalize a solution. In 2006, Twitter's OpenID implementation needed a way to delegate API access without sharing passwords. Cook, along with **Chris Messina** and contributions from the broader community, began drafting what would become OAuth.

**November 2006.** Larry Halff of Ma.gnolia approached Blaine Cook about a standard way for desktop widgets to access the Ma.gnolia API. Cook, Chris Messina, and others began drafting the OAuth protocol specification.

**October 2007.** The OAuth Core 1.0 specification was published as a community draft.

**April 2010.** OAuth 1.0 was published as **RFC 5849** ("The OAuth 1.0 Protocol") by the IETF.

OAuth 1.0 worked, but it was complex. Every request required a cryptographic signature using HMAC-SHA1. The signature base string construction was notoriously error-prone. Developers had to:

1. Collect all request parameters (URL, query params, body params, OAuth params)
2. Sort them alphabetically
3. Percent-encode each key and value
4. Concatenate them with `&`
5. Sign the result with the consumer secret and token secret

A single misplaced ampersand or encoding error would produce an `invalid_signature` error with no useful debugging information. Libraries existed, but the protocol was hostile to developers building without them.

### 1.3 OAuth 2.0 (2010-2012): Simplicity and Controversy

**Eran Hammer** was the lead author and editor of OAuth 2.0. The goal was radical simplification: drop the cryptographic signatures, rely on TLS for transport security, and introduce multiple "grant types" for different use cases.

**October 2012.** OAuth 2.0 was published as **RFC 6749** ("The OAuth 2.0 Authorization Framework") and **RFC 6750** ("The OAuth 2.0 Authorization Framework: Bearer Token Usage").

The key changes from OAuth 1.0:

| Feature | OAuth 1.0 (RFC 5849) | OAuth 2.0 (RFC 6749) |
|---------|----------------------|----------------------|
| Transport security | Cryptographic signatures per request | TLS/HTTPS required |
| Token types | Request token + access token | Authorization code + access token + refresh token |
| Client types | Single type | Confidential + public |
| Grant types | One flow | Authorization code, implicit, client credentials, ROPC |
| Extensibility | Limited | Designed for extension |
| Complexity | High (signatures) | Lower (bearer tokens) |
| Specification type | Single document | Framework (intentionally incomplete) |

**The "Road to Hell" Controversy.** In July 2012, Eran Hammer resigned as lead author and withdrew his name from the specification, publishing a blog post titled "OAuth 2.0 and the Road to Hell." His core complaints:

- OAuth 2.0 was a "framework," not a protocol. Two compliant implementations might be completely incompatible.
- The specification was "the output of enterprise committee design," driven by large companies (Google, Microsoft, Facebook) with different requirements.
- Bearer tokens without cryptographic binding meant that anyone who intercepted a token could use it freely.
- The working group had removed signatures to simplify the protocol but failed to replace them with an equivalent security mechanism.

Hammer was right about the interoperability issues. He was also right that bearer tokens without binding were weaker than OAuth 1.0's signed requests. But the ecosystem voted with its feet: OAuth 2.0's simplicity won. Virtually every major platform adopted it.

### 1.4 OpenID Connect (2014): The Identity Layer

OAuth 2.0 was an authorization framework, but developers kept using it for authentication. They would request an access token, call the `/userinfo` endpoint (or equivalent), and treat the response as proof of identity. This was insecure for several reasons (see Section 2).

**Nat Sakimura**, **John Bradley**, and **Mike Jones** led the effort to build a proper identity layer on top of OAuth 2.0. The result was **OpenID Connect 1.0** (OIDC), published in February 2014 by the OpenID Foundation.

OIDC added:

- **ID Token**: A JWT (JSON Web Token) that contains claims about the user's identity (who they are), signed by the identity provider.
- **UserInfo Endpoint**: A standardized API for fetching additional user profile information.
- **Discovery**: A `.well-known/openid-configuration` endpoint that describes all available endpoints and capabilities.
- **Dynamic Registration**: A protocol for clients to register themselves with an authorization server programmatically.
- **Standard Scopes**: `openid`, `profile`, `email`, `address`, `phone`.

### 1.5 Timeline of Key Milestones

| Year | Event | Significance |
|------|-------|-------------|
| 2005 | Brad Fitzpatrick creates OpenID 1.0 | Decentralized identity, no OAuth yet |
| 2006 | Blaine Cook (Twitter) + Chris Messina begin OAuth drafting | Response to password anti-pattern |
| 2007 | OAuth Core 1.0 community draft | First OAuth specification |
| 2007 | OpenID 2.0 published | Improved decentralized auth |
| 2010 | OAuth 1.0 published as RFC 5849 | IETF standardization |
| 2010 | OAuth 2.0 work begins in IETF (draft-ietf-oauth-v2) | Eran Hammer as lead editor |
| 2012 | OAuth 2.0 published as RFC 6749 + 6750 | Bearer token framework |
| 2012 | Eran Hammer resigns, publishes "Road to Hell" | Controversy over design |
| 2014 | OpenID Connect 1.0 final specification | Identity layer on OAuth 2.0 |
| 2015 | PKCE published as RFC 7636 | Protection for public clients |
| 2015 | JWT published as RFC 7519 | Token format standard |
| 2015 | JWK published as RFC 7517 | Key representation standard |
| 2017 | OAuth 2.0 for Native Apps (RFC 8252) | Best practices for mobile/desktop |
| 2018 | Token Exchange published as RFC 8693 | Cross-domain token exchange |
| 2019 | OAuth 2.0 for Browser-Based Apps (BCP) | SPA security guidance |
| 2020 | OAuth 2.1 draft begins | Consolidation of best practices |
| 2021 | PAR published as RFC 9126 | Back-channel authorization requests |
| 2022 | RAR published as RFC 9396 | Rich, structured authorization requests |
| 2023 | DPoP published as RFC 9449 | Proof-of-possession for tokens |
| 2023 | OAuth 2.0 Security BCP (RFC 9700 draft) | Updated security recommendations |
| 2025 | OAuth 2.1 expected finalization | PKCE required, implicit removed |

### 1.6 Scale Today

OAuth 2.0 and OpenID Connect are the dominant authorization and identity protocols on the internet:

- **Every "Sign in with Google" button** uses OIDC. Google processes billions of OIDC authentications per day.
- **Every "Log in with GitHub" button** uses OAuth 2.0 with OIDC.
- **Apple Sign In** uses OIDC (with Apple-specific extensions).
- **Microsoft Entra ID** (formerly Azure AD) handles over 1.2 billion authentications per day using OAuth 2.0 and OIDC.
- **Auth0** (Okta) processes over 4.5 billion logins per month.
- **Every major cloud provider** (AWS, GCP, Azure) uses OAuth 2.0 for API authorization.
- **Every modern SaaS application** with third-party integrations uses OAuth 2.0 for delegated access.

The protocol family handles authentication for an estimated 3+ billion internet users.

---

## 2. Core Concept

### 2.1 OAuth Is Authorization, NOT Authentication

This is the single most important thing to understand about OAuth 2.0, and the most common source of confusion.

**Authorization** answers: "What is this application allowed to do?"
**Authentication** answers: "Who is this person?"

OAuth 2.0 (RFC 6749) is an authorization framework. It allows a user to grant a third-party application limited access to their resources on another server, without sharing their credentials. It does not, by itself, tell the application who the user is.

**The Valet Key Analogy.** A valet key lets a parking attendant drive your car but not open the trunk or glove compartment. You are authorizing the valet to perform a limited set of actions (drive, park) without giving them your full car key (which also opens the trunk, the house, etc.). OAuth works the same way: you give an application a token that grants limited permissions, not your password that grants full access.

### 2.2 Why OAuth Alone Is Not Authentication

When a developer uses OAuth 2.0 to "log in" a user, the typical pattern is:

1. Redirect the user to Google's authorization endpoint
2. Receive an access token
3. Call Google's user info API with the access token
4. Use the response to identify the user

This seems to work, but it is insecure because:

- **The access token is not for you.** An access token is intended for the Resource Server (the API). It does not contain a claim about who the user is for the Client. A malicious Resource Server could replay the access token to impersonate the user at another Client.
- **No audience restriction.** The access token does not specify which Client it was issued for. If Client A's access token is stolen by Client B, Client B can use it to call the Resource Server and get the user's profile - then claim the user "logged in" to Client B.
- **Token substitution attacks.** An attacker can substitute one user's access token for another during the callback, causing the Client to associate the wrong identity.

This is why **OpenID Connect** was created. OIDC adds an **ID Token** - a signed JWT that says "this specific user authenticated at this specific time, and this token is intended for this specific client." The ID Token includes `iss` (issuer), `sub` (subject/user ID), `aud` (audience/client ID), `exp` (expiration), and `nonce` (replay protection).

### 2.3 The Mental Model

```
+------------------------------------------------------------------+
|                    OpenID Connect (Identity)                      |
|  "Who is this user?"                                             |
|  ID Token (JWT) - signed proof of identity                       |
|  UserInfo Endpoint - additional profile claims                   |
|  Discovery - .well-known/openid-configuration                    |
+------------------------------------------------------------------+
|                    OAuth 2.0 (Authorization)                      |
|  "What can this app do?"                                         |
|  Access Token - scoped permission to call APIs                   |
|  Refresh Token - get new access tokens without re-authorization  |
|  Grant Types - different flows for different client types         |
+------------------------------------------------------------------+
|                    HTTP / TLS (Transport)                         |
|  Redirects (302) - front-channel communication                   |
|  POST requests - back-channel communication                      |
|  Bearer headers - token presentation                             |
+------------------------------------------------------------------+
```

OIDC is a thin layer on top of OAuth 2.0. It uses the same endpoints, the same flows, and the same tokens - but adds an ID Token and a standardized set of identity claims.

### 2.4 Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "OAuth is a login protocol" | OAuth is an authorization framework. OIDC (built on OAuth) is the login protocol. |
| "An access token proves who the user is" | An access token proves the user granted permission. Only an ID Token (OIDC) proves identity. |
| "OAuth 2.0 is less secure than OAuth 1.0" | OAuth 2.0 delegates transport security to TLS. With PKCE, it is equally secure and far simpler. |
| "JWTs are always access tokens" | JWTs are a token format. Access tokens can be JWTs or opaque strings. ID Tokens are always JWTs. |
| "refresh_token gives unlimited access" | Refresh tokens have lifetimes, can be rotated, revoked, and are bound to the client. |
| "OAuth and OIDC are separate protocols" | OIDC is built directly on top of OAuth 2.0. An OIDC flow IS an OAuth flow with extra parameters. |
| "Scopes are permissions" | Scopes are a way for the client to request permissions. The authorization server decides what to actually grant. |
| "Bearer tokens are insecure" | Bearer tokens are fine when combined with TLS, short lifetimes, and audience restriction. DPoP adds proof-of-possession for higher security. |

### 2.5 What OIDC Adds to OAuth 2.0

| OAuth 2.0 Only | With OIDC |
|----------------|-----------|
| Access Token (opaque or JWT) | Access Token + **ID Token** (JWT) |
| Custom user info API | Standardized **/userinfo** endpoint |
| No discovery mechanism | **/.well-known/openid-configuration** |
| Custom scopes | Standard scopes: `openid`, `profile`, `email`, `address`, `phone` |
| No key publication | **JWKS** endpoint for public key distribution |
| No session management | Front-channel and back-channel logout |
| No standard claims | 20+ standard claims (sub, name, email, picture, etc.) |

---

## 3. Key Participants and Roles

### 3.1 The Four OAuth 2.0 Roles (RFC 6749)

| Role | Definition | Example |
|------|-----------|---------|
| **Resource Owner** | The entity capable of granting access to a protected resource. Usually the end user. | Sarah, who has a Google account with photos and contacts |
| **Client** | The application requesting access to the resource owner's protected resources. | Spotify, which wants to read Sarah's Google profile |
| **Authorization Server (AS)** | The server that authenticates the resource owner and issues access tokens after obtaining consent. | accounts.google.com |
| **Resource Server (RS)** | The server hosting the protected resources, capable of accepting and responding to protected resource requests using access tokens. | people.googleapis.com (Google Contacts API) |

In practice, the Authorization Server and Resource Server are often operated by the same organization (e.g., Google runs both accounts.google.com and its APIs), but they are architecturally distinct. Some deployments have one AS issuing tokens for many RSs.

### 3.2 OIDC Additions

OpenID Connect relabels and extends the OAuth 2.0 roles:

| OIDC Term | Maps To | What It Adds |
|-----------|---------|-------------|
| **OpenID Provider (OP)** / **Identity Provider (IdP)** | Authorization Server | Issues ID Tokens, hosts UserInfo endpoint, publishes Discovery document |
| **Relying Party (RP)** | Client | Consumes ID Tokens, validates identity claims |
| **UserInfo Endpoint** | Resource Server (specialized) | Returns identity claims based on access token scopes |

### 3.3 Client Types

RFC 6749 defines two client types based on their ability to maintain the confidentiality of their credentials:

| Client Type | Can Keep a Secret? | Examples | Authentication |
|-------------|-------------------|----------|----------------|
| **Confidential** | Yes - runs on a secure server | Server-side web app (Node.js, Django, Rails), backend service | client_id + client_secret (via HTTP Basic or POST body) |
| **Public** | No - code is visible to the user | Single-page app (React, Vue), native mobile app, desktop app, CLI tool | client_id only (no secret) + **PKCE required** |

The distinction matters because:
- A confidential client can authenticate itself to the token endpoint using a client_secret.
- A public client cannot store a secret securely (JavaScript source is viewable, mobile apps can be decompiled), so it relies on PKCE to prove it initiated the authorization request.

### 3.4 Client Registration

Before an OAuth flow can begin, the client must be registered with the Authorization Server. Registration produces:

| Parameter | Description | Example |
|-----------|------------|---------|
| `client_id` | Public identifier for the client | `spotify-web-abc123.apps.googleusercontent.com` |
| `client_secret` | Secret known only to the client and AS (confidential clients only) | `GOCSPX-abcdef123456` |
| `redirect_uri` | Where the AS sends the user after authorization. Must be pre-registered and exactly matched. | `https://accounts.spotify.com/login/google/redirect` |
| `grant_types` | Which OAuth grant types this client is allowed to use | `authorization_code`, `refresh_token` |
| `response_types` | Which response types the client can request | `code` |
| `scopes` | Which scopes the client is allowed to request | `openid profile email` |
| `token_endpoint_auth_method` | How the client authenticates at the token endpoint | `client_secret_basic`, `client_secret_post`, `private_key_jwt`, `none` |

**The redirect_uri is the most security-critical parameter.** If an attacker can register or manipulate a redirect_uri, they can intercept authorization codes and access tokens. Authorization servers must perform **exact string matching** on redirect URIs - no wildcards, no pattern matching, no open redirects.

![OAuth 2.0 ecosystem participants and OIDC additions](diagrams/oauth2-ecosystem-participants.mmd)

---

## 4. How It Works - Step by Step

### 4.1 The Authorization Code Flow

The Authorization Code flow is the most important OAuth 2.0 flow and the one you should use in almost all cases. It is used by web applications, mobile apps, and SPAs (with PKCE).

The flow has two phases:

1. **Front-channel** (browser redirects): The user authenticates and consents at the Authorization Server, which redirects back with a short-lived authorization code.
2. **Back-channel** (server-to-server): The client exchanges the authorization code for tokens at the token endpoint.

This two-step design is deliberate. The authorization code passes through the user's browser (front-channel), which is untrusted. But the code alone is useless - it must be exchanged for tokens via a direct server-to-server call (back-channel), which includes client authentication and PKCE verification.

#### Step 1: Client Generates PKCE Parameters

```
code_verifier  = random string, 43-128 characters
                 allowed: [A-Z] [a-z] [0-9] - . _ ~
                 example: dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk

code_challenge = BASE64URL(SHA256(code_verifier))
                 example: E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
```

The client stores the `code_verifier` in memory (server-side session or app state). It sends only the `code_challenge` to the authorization endpoint.

#### Step 2: Authorization Request (Front-Channel)

The client redirects the user's browser to the Authorization Server:

```http
GET /authorize?
  response_type=code
  &client_id=spotify-web-abc123.apps.googleusercontent.com
  &redirect_uri=https://accounts.spotify.com/login/google/redirect
  &scope=openid+profile+email
  &state=k8j2m9xp3n7q
  &nonce=a1b2c3d4e5f6
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
HTTP/1.1
Host: accounts.google.com
```

| Parameter | Purpose |
|-----------|---------|
| `response_type=code` | Tells the AS to return an authorization code |
| `client_id` | Identifies the client application |
| `redirect_uri` | Where to send the user after authorization |
| `scope` | What permissions the client is requesting |
| `state` | CSRF protection - random value verified on callback |
| `nonce` | OIDC replay protection - embedded in the ID Token |
| `code_challenge` | PKCE - SHA256 hash of the code_verifier |
| `code_challenge_method` | Always `S256` (SHA-256) |

#### Step 3: User Authenticates and Consents

The Authorization Server:
1. Presents a login page (if the user is not already logged in)
2. Authenticates the user (password, MFA, passkey, etc.)
3. Shows a consent screen listing the requested scopes
4. The user approves or denies

#### Step 4: Authorization Response (Front-Channel)

If the user approves, the AS redirects back to the client's redirect_uri with an authorization code:

```http
HTTP/1.1 302 Found
Location: https://accounts.spotify.com/login/google/redirect?
  code=SplxlOBeZQQYbYS6WxSbIA
  &state=k8j2m9xp3n7q
```

The authorization code is:
- **Short-lived** (typically 30-60 seconds)
- **Single-use** (can only be exchanged once)
- **Bound** to the client_id, redirect_uri, and code_challenge

#### Step 5: Token Exchange (Back-Channel)

The client sends a direct HTTPS POST to the token endpoint:

```http
POST /token HTTP/1.1
Host: oauth2.googleapis.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https://accounts.spotify.com/login/google/redirect
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

The AS validates:
1. The authorization code is valid, unexpired, and unused
2. The redirect_uri matches the one used in the authorization request
3. The client authentication is valid (client_secret or PKCE)
4. SHA256(code_verifier) matches the stored code_challenge

#### Step 6: Token Response

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "tGzv3JOkF0XG5Qx2TlKWIA",
  "scope": "openid profile email",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjQta2V5LTEifQ..."
}
```

| Token | Purpose | Lifetime | Format |
|-------|---------|----------|--------|
| `access_token` | Call resource server APIs | Short (5 min - 1 hour) | JWT or opaque |
| `refresh_token` | Get new access tokens without user interaction | Long (days - months) | Opaque |
| `id_token` | Prove user identity to the client (OIDC) | Short (5-15 minutes) | JWT (always) |

#### Step 7: Access Protected Resources

```http
GET /v1/people/me?personFields=names,emailAddresses HTTP/1.1
Host: people.googleapis.com
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9...
```

![Authorization Code flow with PKCE](diagrams/authorization-code-flow.mmd)

### 4.2 Concrete Walkthrough: Sarah Logs Into Spotify

Let us trace every HTTP request when Sarah clicks "Continue with Google" on Spotify.

**Setup:** Sarah has a Google account (sarah@gmail.com) but has never used Spotify before. She visits spotify.com and clicks "Continue with Google."

**1. Spotify's Server Prepares the Request**

Spotify generates:
- `code_verifier`: `dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk` (43 random chars)
- `code_challenge`: `E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM` (SHA256 + base64url)
- `state`: `k8j2m9xp3n7q` (random, stored in session)
- `nonce`: `a1b2c3d4e5f6` (random, stored in session)

**2. Browser Redirect to Google**

```
302 Location: https://accounts.google.com/o/oauth2/v2/auth?
  client_id=spotify-web-abc123.apps.googleusercontent.com
  &redirect_uri=https://accounts.spotify.com/login/google/redirect
  &response_type=code
  &scope=openid email profile
  &state=k8j2m9xp3n7q
  &nonce=a1b2c3d4e5f6
  &code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
  &code_challenge_method=S256
```

**3. Sarah Authenticates with Google**

- Sarah enters her email: sarah@gmail.com
- Sarah enters her password
- Sarah completes 2FA with Google Authenticator
- Google shows: "Spotify wants to: See your email address, See your personal info (name, picture)"
- Sarah clicks "Allow"

**4. Google Redirects Back to Spotify**

```
302 Location: https://accounts.spotify.com/login/google/redirect?
  code=4/0AY0e-g7hJ8kL...
  &state=k8j2m9xp3n7q
```

**5. Spotify's Server Exchanges the Code**

```http
POST https://oauth2.googleapis.com/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=4/0AY0e-g7hJ8kL...
&redirect_uri=https://accounts.spotify.com/login/google/redirect
&client_id=spotify-web-abc123.apps.googleusercontent.com
&client_secret=GOCSPX-...
&code_verifier=dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk
```

**6. Google Returns Tokens**

```json
{
  "access_token": "ya29.a0AXeO80T...",
  "expires_in": 3599,
  "scope": "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
  "token_type": "Bearer",
  "id_token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxMGM..."
}
```

**7. Spotify Validates the ID Token**

Spotify decodes the JWT (without verifying yet) to read the header:
```json
{
  "alg": "RS256",
  "kid": "c10c...",
  "typ": "JWT"
}
```

Spotify fetches Google's JWKS from `https://www.googleapis.com/oauth2/v3/certs`, finds the key matching `kid: "c10c..."`, and verifies the RS256 signature. Then validates claims:

```json
{
  "iss": "https://accounts.google.com",
  "azp": "spotify-web-abc123.apps.googleusercontent.com",
  "aud": "spotify-web-abc123.apps.googleusercontent.com",
  "sub": "110248495921238986420",
  "email": "sarah@gmail.com",
  "email_verified": true,
  "name": "Sarah Chen",
  "picture": "https://lh3.googleusercontent.com/a/default-user=s96-c",
  "given_name": "Sarah",
  "family_name": "Chen",
  "nonce": "a1b2c3d4e5f6",
  "iat": 1713996400,
  "exp": 1714000000
}
```

Validation checks:
- `iss` == `https://accounts.google.com` (expected issuer)
- `aud` == `spotify-web-abc123.apps.googleusercontent.com` (this client)
- `exp` > current time (not expired)
- `nonce` == `a1b2c3d4e5f6` (matches stored nonce)
- Signature is valid against Google's public key

**8. Spotify Creates a Local Account**

Spotify looks up: does a user with Google `sub: "110248495921238986420"` exist? No. Spotify creates a new account, links the Google identity, sets a session cookie, and redirects Sarah to her new Spotify dashboard.

**Total elapsed time: approximately 8 seconds.** Spotify never saw Sarah's Google password.

![Sarah logs into Spotify with Google](diagrams/sarah-logs-into-spotify.mmd)

---

## 5. Technical Architecture

### 5.1 Grant Types

OAuth 2.0 defines multiple grant types (authorization flows) for different client types and use cases.

#### 5.1.1 Authorization Code + PKCE (Recommended)

This is the grant type covered in detail in Section 4. It is the recommended flow for:
- Server-side web applications
- Single-page applications (with PKCE)
- Native mobile and desktop applications (with PKCE)

PKCE (Proof Key for Code Exchange, RFC 7636) was originally designed for public clients but is now recommended for all clients, including confidential ones (OAuth 2.1 makes it mandatory).

![PKCE deep dive - verifier and challenge mechanics](diagrams/authorization-code-pkce-flow.mmd)

#### 5.1.2 Client Credentials (Machine-to-Machine)

Used when the client itself is the resource owner - no user is involved. Common for backend service-to-service communication.

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

grant_type=client_credentials
&scope=api:read api:write
```

Response:

```json
{
  "access_token": "eyJhbGciOiJSUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "api:read api:write"
}
```

Key differences from Authorization Code:
- No user interaction, no consent screen, no redirect
- No refresh token (the client can simply re-authenticate)
- The client IS the resource owner
- Client must be confidential (has a client_secret)

![Client Credentials flow for machine-to-machine](diagrams/client-credentials-flow.mmd)

#### 5.1.3 Device Authorization Grant (Smart TV / CLI)

Used for input-constrained devices that cannot display a browser or accept keyboard input easily. Defined in RFC 8628.

Real-world examples:
- Smart TV apps (Netflix, YouTube on Apple TV)
- Game consoles (PlayStation, Xbox)
- CLI tools (`gh auth login`, `aws sso login`, `gcloud auth login`)

The device displays a URL and a short code. The user visits the URL on their phone or computer, enters the code, and authorizes. The device polls the token endpoint until the user completes authorization.

```http
POST /device/code HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

client_id=tv_app_123
&scope=openid profile
```

Response:

```json
{
  "device_code": "GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNh",
  "user_code": "WDJB-MJHT",
  "verification_uri": "https://example.com/device",
  "verification_uri_complete": "https://example.com/device?user_code=WDJB-MJHT",
  "expires_in": 1800,
  "interval": 5
}
```

The device then polls:

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:device_code
&device_code=GmRhmhcxhwAzkoEqiMEg_DnyEysNkuNh
&client_id=tv_app_123
```

The AS responds with `authorization_pending` until the user completes authorization, then returns tokens.

![Device Authorization flow for smart TVs and CLIs](diagrams/device-code-flow.mmd)

#### 5.1.4 Implicit Grant (DEPRECATED)

The Implicit Grant was designed for JavaScript-only applications in 2012 when CORS was not widely supported and SPAs could not make cross-origin POST requests to the token endpoint. It returned the access token directly in the URL fragment.

**Why it is deprecated:**

1. **Token in URL.** The access token is in the URL fragment (`#access_token=...`), which is visible in browser history and can leak via Referer headers.
2. **No client authentication.** The AS cannot verify which client is receiving the token.
3. **No PKCE.** There is no mechanism to bind the token request to the authorization request.
4. **No refresh tokens.** When the token expires, the user must re-authorize.
5. **Token replay.** An intercepted token can be replayed by any party.

**What to use instead:** Authorization Code + PKCE. Modern browsers fully support CORS, so SPAs can make cross-origin POST requests to the token endpoint.

OAuth 2.1 formally removes the Implicit Grant.

![Implicit flow (deprecated) with vulnerability notes](diagrams/implicit-flow-deprecated.mmd)

#### 5.1.5 Resource Owner Password Credentials (DEPRECATED)

The ROPC grant sends the user's username and password directly to the client, which forwards them to the token endpoint:

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=password
&username=sarah@gmail.com
&password=hunter2
&scope=openid profile
&client_id=my_app
```

**Why it is deprecated:** This is the exact password anti-pattern that OAuth was designed to eliminate. The client sees the user's password. It was included in RFC 6749 as a migration path for legacy applications, not for new development.

OAuth 2.1 formally removes the ROPC grant.

### 5.2 JWT Anatomy

JSON Web Tokens (RFC 7519) are the format used for OIDC ID Tokens and often for access tokens. A JWT has three parts, separated by dots:

```
eyJhbGciOiJSUzI1NiIsImtpZCI6ImMxMGMifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJzdWIiOiIxMTAyNDg0OTU5MjEyMzg5ODY0MjAiLCJhdWQiOiJzcG90aWZ5LXdlYi1hYmMxMjMuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJleHAiOjE3MTQwMDAwMDAsImlhdCI6MTcxMzk5NjQwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Part 1: Header** (base64url-decoded):
```json
{
  "alg": "RS256",
  "kid": "c10c",
  "typ": "JWT"
}
```

- `alg`: Signing algorithm (RS256 = RSA + SHA-256, ES256 = ECDSA + SHA-256)
- `kid`: Key ID, used to look up the correct public key from the JWKS endpoint
- `typ`: Token type

**Part 2: Payload** (base64url-decoded):
```json
{
  "iss": "https://accounts.google.com",
  "sub": "110248495921238986420",
  "aud": "spotify-web-abc123.apps.googleusercontent.com",
  "exp": 1714000000,
  "iat": 1713996400,
  "nonce": "a1b2c3d4e5f6",
  "name": "Sarah Chen",
  "email": "sarah@gmail.com",
  "email_verified": true,
  "picture": "https://lh3.googleusercontent.com/a/default-user=s96-c"
}
```

Standard JWT claims (RFC 7519):

| Claim | Name | Required in ID Token | Description |
|-------|------|---------------------|-------------|
| `iss` | Issuer | Yes | URL of the authorization server that issued the token |
| `sub` | Subject | Yes | Unique identifier for the user (stable, never reassigned) |
| `aud` | Audience | Yes | Client ID of the intended recipient |
| `exp` | Expiration | Yes | Unix timestamp after which the token is invalid |
| `iat` | Issued At | Yes | Unix timestamp when the token was issued |
| `nonce` | Nonce | If sent in request | Value from the authorization request (replay protection) |
| `auth_time` | Authentication Time | If requested | When the user last authenticated |
| `azp` | Authorized Party | Optional | Client ID that the token was issued to (Google extension) |
| `at_hash` | Access Token Hash | Optional | Left half of SHA-256 of the access token |

**Part 3: Signature**

```
RSASSA-PKCS1-v1_5(
  SHA-256(
    base64url(header) + "." + base64url(payload)
  ),
  private_key
)
```

To verify: the Relying Party fetches the public key from the JWKS endpoint, identifies the key by `kid`, and verifies the signature. If valid, the token was issued by the claimed issuer and has not been tampered with.

![JWT anatomy - header, payload, signature dissection](diagrams/jwt-anatomy.mmd)

### 5.3 Token Types Comparison

| Property | Access Token | Refresh Token | ID Token |
|----------|-------------|---------------|----------|
| **Purpose** | Call resource server APIs | Get new access tokens | Prove user identity to client |
| **Audience** | Resource Server | Authorization Server | Client (Relying Party) |
| **Format** | JWT or opaque string | Opaque string | JWT (always) |
| **Lifetime** | Short (5 min - 1 hour) | Long (days - months) | Short (5-15 min) |
| **Sent to** | Resource Server (via Authorization header) | Authorization Server (via POST /token) | Never sent to APIs |
| **Contains** | Scopes, client_id, sub, exp | Nothing readable (opaque) | Identity claims (sub, name, email) |
| **Can be refreshed** | Yes (via refresh token) | Yes (via rotation) | Yes (via new auth or refresh) |
| **Revocable** | Depends (JWT = no, opaque = yes) | Yes (server-side revocation) | N/A (short-lived, validated at receipt) |

### 5.4 Token Introspection and Revocation

**Token Introspection (RFC 7662)** allows a Resource Server to check whether an access token is currently active:

```http
POST /introspect HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(rs_client_id:rs_client_secret)

token=eyJhbGciOiJSUzI1NiJ9...
```

Response:

```json
{
  "active": true,
  "scope": "openid profile email",
  "client_id": "spotify-web-abc123",
  "username": "sarah@gmail.com",
  "token_type": "Bearer",
  "exp": 1714000000,
  "iat": 1713996400,
  "sub": "110248495921238986420",
  "iss": "https://accounts.google.com"
}
```

This is useful when access tokens are opaque strings (not JWTs) and the Resource Server cannot validate them locally.

**Token Revocation (RFC 7009)** allows a client to invalidate a token before it expires:

```http
POST /revoke HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

token=tGzv3JOkF0XG5Qx2TlKWIA
&token_type_hint=refresh_token
```

The AS revokes the token (and optionally all tokens in the same grant). The response is always `200 OK`, even if the token was already invalid (to prevent information leakage).

### 5.5 All Endpoints

| Endpoint | Method | Purpose | Specification |
|----------|--------|---------|--------------|
| `/authorize` | GET | Authorization request (front-channel) | RFC 6749 Section 3.1 |
| `/token` | POST | Token exchange (back-channel) | RFC 6749 Section 3.2 |
| `/userinfo` | GET/POST | Return identity claims (OIDC) | OIDC Core Section 5.3 |
| `/revoke` | POST | Revoke a token | RFC 7009 |
| `/introspect` | POST | Check token status | RFC 7662 |
| `/.well-known/openid-configuration` | GET | OIDC Discovery document | OIDC Discovery |
| `/.well-known/jwks.json` (or `/jwks`) | GET | Public keys for JWT verification | RFC 7517 |
| `/device/code` | POST | Device authorization request | RFC 8628 |
| `/register` | POST | Dynamic client registration | RFC 7591 |
| `/par` | POST | Pushed authorization request | RFC 9126 |

### 5.6 OpenID Connect Discovery

Every OIDC provider publishes a JSON document at `/.well-known/openid-configuration`. This is the starting point for any OIDC integration.

Example (Google, abbreviated):

```json
{
  "issuer": "https://accounts.google.com",
  "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
  "token_endpoint": "https://oauth2.googleapis.com/token",
  "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
  "revocation_endpoint": "https://oauth2.googleapis.com/revoke",
  "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
  "scopes_supported": ["openid", "email", "profile"],
  "response_types_supported": ["code", "token", "id_token", "code token", "code id_token"],
  "grant_types_supported": ["authorization_code", "refresh_token", "urn:ietf:params:oauth:grant-type:device_code"],
  "subject_types_supported": ["public"],
  "id_token_signing_alg_values_supported": ["RS256"],
  "token_endpoint_auth_methods_supported": ["client_secret_post", "client_secret_basic"],
  "code_challenge_methods_supported": ["plain", "S256"]
}
```

Clients should fetch this document at startup and cache it. It eliminates hardcoded endpoint URLs and enables automatic configuration.

### 5.7 PKCE Cryptographic Walkthrough

PKCE (Proof Key for Code Exchange, "pixy") prevents authorization code interception attacks.

**The Attack Without PKCE:**
1. A malicious app on a mobile device registers the same custom URL scheme as the legitimate app (e.g., `myapp://callback`)
2. User authorizes the legitimate app
3. The AS redirects with the authorization code to `myapp://callback?code=abc`
4. The OS delivers the redirect to the malicious app instead of the legitimate one
5. The malicious app exchanges the code for tokens

**How PKCE Prevents This:**

```
1. Legitimate app generates:
   code_verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"

2. Computes challenge:
   SHA256("dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk")
   = bytes: 13d3 27a5 a1da 2c8b c5ac 4c4c 98ae 087a ...
   BASE64URL(bytes)
   = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"

3. Sends code_challenge in authorization request (front-channel)
   AS stores: code -> code_challenge mapping

4. At token exchange, sends code_verifier (back-channel)
   AS computes: SHA256(code_verifier) and compares to stored code_challenge

5. Malicious app has the code but NOT the code_verifier
   (code_verifier was generated in memory and never sent over the front-channel)
   Token exchange FAILS for the malicious app
```

The `code_verifier` must be:
- 43-128 characters long
- Using unreserved characters: `[A-Z] [a-z] [0-9] - . _ ~`
- Cryptographically random (use `crypto.getRandomValues()` or equivalent)

### 5.8 State Parameter and CSRF Prevention

The `state` parameter prevents Cross-Site Request Forgery (CSRF) attacks on the redirect URI.

**The Attack Without State:**
1. Attacker starts an OAuth flow and gets an authorization code for their own account
2. Attacker crafts a URL: `https://app.example.com/callback?code=ATTACKERS_CODE`
3. Attacker tricks the victim into clicking this URL (e.g., via email or embedded image)
4. The app exchanges the attacker's code for tokens and associates the attacker's identity with the victim's session
5. The victim is now logged in as the attacker (or the attacker's account is linked to the victim's account)

**How State Prevents This:**
1. The app generates a random `state` value and stores it in the session
2. The `state` is included in the authorization request
3. The AS echoes the `state` back in the redirect
4. The app verifies that the returned `state` matches the stored value
5. An attacker cannot forge a valid `state` because it is bound to the victim's session

### 5.9 Scopes

Scopes define the level of access a client is requesting. They are space-separated strings included in the authorization request.

**OIDC Standard Scopes:**

| Scope | Claims Returned |
|-------|----------------|
| `openid` | Required for OIDC. Returns `sub` claim. |
| `profile` | `name`, `family_name`, `given_name`, `middle_name`, `nickname`, `preferred_username`, `profile`, `picture`, `website`, `gender`, `birthdate`, `zoneinfo`, `locale`, `updated_at` |
| `email` | `email`, `email_verified` |
| `address` | `address` (JSON object with `street_address`, `locality`, `region`, `postal_code`, `country`) |
| `phone` | `phone_number`, `phone_number_verified` |

**Custom Scopes (Examples):**

| Provider | Scope | Access Granted |
|----------|-------|---------------|
| Google | `https://www.googleapis.com/auth/drive.readonly` | Read-only access to Google Drive |
| GitHub | `repo` | Full access to private repositories |
| Slack | `channels:read` | View basic channel info |
| Spotify | `user-read-playback-state` | Read playback state |

Scopes are a negotiation. The client requests scopes, the user may consent to all or some, and the AS may grant a subset. The `scope` field in the token response indicates what was actually granted.

![OpenID Connect layered on top of OAuth 2.0](diagrams/openid-connect-layer.mmd)

![Token lifecycle - issued, active, expired, revoked](diagrams/token-lifecycle.mmd)

---

## 6. Money Flow / Economics

### 6.1 Commercial IDaaS Pricing

Identity-as-a-Service (IDaaS) is a significant market. Companies pay for managed authentication and authorization infrastructure rather than building it themselves.

| Provider | Free Tier | Paid Starting Price | Enterprise | Key Differentiator |
|----------|-----------|--------------------|-----------|--------------------|
| **Auth0 (Okta)** | 25,000 MAU | $35/mo (Essentials) | Custom | Largest ecosystem, Universal Login, Actions |
| **Okta Workforce** | N/A | $2/user/mo (SSO) | $6+/user/mo | Enterprise SSO, lifecycle management |
| **AWS Cognito** | 50,000 MAU | $0.0055/MAU | Volume discounts | AWS integration, cheap at scale |
| **Firebase Auth** | 50,000 MAU (phone: 10K) | $0.0055/MAU | N/A | Google ecosystem, simple setup |
| **Microsoft Entra ID** | Basic SSO (free) | $6/user/mo (P1) | $9/user/mo (P2) | Microsoft 365 integration, conditional access |
| **Clerk** | 10,000 MAU | $25/mo + $0.02/MAU | Custom | Developer UX, pre-built components |
| **Descope** | 7,500 MAU | Custom | Custom | No-code workflow builder |
| **Stytch** | 25 orgs | $249/mo | Custom | Passwordless-first, B2B focus |
| **FusionAuth** | Self-host free | $125/mo (cloud) | Custom | No MAU limits on self-host |

**MAU** = Monthly Active Users (unique users who authenticate at least once per month).

The total IDaaS market is estimated at $7-8 billion annually (2025) and growing at approximately 13% per year.

### 6.2 Open-Source Alternatives

| Project | Language | OIDC Provider | SAML | Maintained By | Notes |
|---------|----------|--------------|------|--------------|-------|
| **Keycloak** | Java | Yes | Yes | Red Hat / CNCF | Most mature, widest adoption. Heavy JVM footprint. |
| **Ory Hydra** | Go | Yes | No | Ory (company) | Headless OAuth 2.0/OIDC server. Lightweight, API-first. |
| **Ory Kratos** | Go | N/A (identity management) | No | Ory | User management, registration, login. Pairs with Hydra. |
| **Authentik** | Python | Yes | Yes | Community | Modern UI, flow-based engine. Growing fast. |
| **Zitadel** | Go | Yes | No | Zitadel AG | Cloud-native, event-sourced, built-in multi-tenancy. |
| **Casdoor** | Go | Yes | Yes | Casbin | Combined IAM + OIDC provider. |
| **Dex** | Go | Yes (limited) | No | CNCF | Lightweight connector/proxy. Used by Kubernetes. |

Self-hosting means you pay for infrastructure (compute, database, networking) but not per-user licensing. For organizations with 100,000+ users, self-hosting Keycloak or Ory can save millions compared to commercial IDaaS.

### 6.3 How Free Social Logins Monetize

Every major social login provider offers OAuth/OIDC for free. Their motivations:

| Provider | Revenue Model | Why They Offer Free Login |
|----------|--------------|--------------------------|
| **Google** | Ecosystem lock-in | Every "Sign in with Google" keeps users in Google's ecosystem. More Google accounts = more Gmail, Drive, YouTube. Indirect ad revenue from user data. |
| **Apple** | Privacy as product feature | "Sign in with Apple" differentiates iPhone. "Hide My Email" generates unique forwarding addresses. Strengthens hardware moat. Required by App Store policy if app offers other social logins. |
| **Facebook/Meta** | Social graph + ad targeting | Facebook Login provides identity + social connections. "Continue with Facebook" gives Meta a signal that the user is active. Historical: extensive data sharing (pre-2018 Cambridge Analytica). |
| **GitHub** | Developer ecosystem | Every OAuth integration makes GitHub more central to developer workflows. Converts free users to paid Teams/Enterprise. Powers Copilot upsell. |
| **Microsoft** | Enterprise upsell | Entra ID free tier drives adoption. Organizations start free, upgrade to P1/P2 for conditional access, PIM, identity governance. |

### 6.4 Build vs Buy Analysis

| Factor | Build (Open-Source) | Buy (IDaaS) |
|--------|-------------------|-------------|
| **Initial cost** | $0 licensing, high dev time | Low/free tier, fast setup |
| **Ongoing cost** | Infrastructure + engineering maintenance | Per-MAU pricing, scales with usage |
| **Time to market** | Weeks to months | Hours to days |
| **Customization** | Full control | Limited to provider's features |
| **Compliance** | You own the audit | Provider handles certifications |
| **Expertise required** | Deep security and protocol knowledge | Minimal (provider handles complexity) |
| **Scaling** | You manage infrastructure | Provider manages scaling |
| **Vendor lock-in** | None (standard protocols) | Moderate (migration cost) |
| **Best for** | Large orgs, regulated industries, privacy-sensitive | Startups, small teams, rapid iteration |

**Rule of thumb:** If your team has fewer than 5 engineers, use a managed service. If you are in a regulated industry requiring on-premises deployment, use Keycloak or Ory. If budget is near zero, start with social login providers and a free-tier IDaaS.

![Identity provider economics and market landscape](diagrams/identity-provider-economics.mmd)

---

## 7. Security and Risk

### 7.1 Threat Model

OAuth 2.0 and OIDC have a well-documented threat model (RFC 6819, updated in the Security BCP). The following are the most critical attack vectors and their defenses.

#### 7.1.1 Authorization Code Interception

**Attack:** An attacker intercepts the authorization code during the front-channel redirect. On mobile, this happens when a malicious app registers the same custom URL scheme. On the web, this can happen via a compromised redirect URI or network interception.

**Defense: PKCE (RFC 7636).** The code_verifier is generated in the legitimate client's memory and never transmitted over the front-channel. Even if the attacker intercepts the authorization code, they cannot exchange it without the code_verifier.

#### 7.1.2 CSRF on Redirect URI

**Attack:** An attacker initiates an OAuth flow with their own account, captures the authorization response, and tricks the victim into loading the callback URL. The victim's session becomes linked to the attacker's account.

**Defense: State parameter.** The client generates a random, unguessable `state` value, stores it in the session, and includes it in the authorization request. On callback, the client verifies the returned `state` matches. The attacker cannot forge a valid `state` for the victim's session.

#### 7.1.3 Redirect URI Manipulation

**Attack:** The attacker modifies the `redirect_uri` to point to a server they control. If the AS accepts the modified URI, the authorization code is sent to the attacker.

**Defense: Exact redirect URI matching.** The AS must perform exact string comparison between the registered redirect_uri and the one in the authorization request. No wildcards, no pattern matching, no open redirects. A single trailing slash difference must cause rejection.

#### 7.1.4 Token Theft via XSS

**Attack:** If an access token is stored in `localStorage` or a JavaScript-accessible variable, an XSS vulnerability allows an attacker to extract it.

**Defense: Backend-for-Frontend (BFF) pattern.** Store tokens in httpOnly, Secure, SameSite cookies that JavaScript cannot access. The SPA communicates with a lightweight backend proxy that handles token management. Alternatively, use `DPoP` (RFC 9449) to bind tokens to a client-held key pair, making stolen tokens useless without the private key.

#### 7.1.5 Refresh Token Theft

**Attack:** An attacker steals a refresh token from a compromised device or database. They use it to obtain new access tokens indefinitely.

**Defense: Refresh token rotation.** Each time a refresh token is used, the AS issues a new refresh token and invalidates the old one. If the AS detects that an old (already-rotated) refresh token is being used, it revokes the entire token family (all tokens from that grant), forcing the user to re-authenticate.

#### 7.1.6 Mix-Up Attack

**Attack:** When a client supports multiple identity providers, an attacker can confuse the client about which IdP issued the authorization response. The client sends the authorization code to the attacker's AS instead of the legitimate one, leaking the code.

**Defense: Issuer validation.** The client must always verify the `iss` (issuer) claim in the ID Token and/or the authorization response (using the `iss` response parameter from RFC 9207) against the expected identity provider.

#### 7.1.7 Token Replay

**Attack:** An attacker captures a valid access token and replays it from a different client or context.

**Defense: DPoP (RFC 9449).** DPoP (Demonstration of Proof-of-Possession) binds the access token to a client-generated key pair. Each request includes a DPoP proof JWT signed with the client's private key. The Resource Server verifies that the DPoP proof matches the token's binding. A stolen token is useless without the client's private key.

#### 7.1.8 Clickjacking

**Attack:** The attacker loads the consent screen in a transparent iframe and overlays it with a deceptive UI. The user clicks what appears to be a benign button but actually clicks "Allow" on the consent screen.

**Defense:** The Authorization Server should set `X-Frame-Options: DENY` and `Content-Security-Policy: frame-ancestors 'none'` to prevent iframe embedding of the consent page.

### 7.2 Token Storage in SPAs

Where to store tokens in a browser-based application is one of the most debated topics in OAuth security.

| Storage Method | XSS Vulnerable | CSRF Vulnerable | Recommendation |
|---------------|---------------|----------------|----------------|
| `localStorage` | Yes - JS can read it | No | Not recommended for sensitive tokens |
| `sessionStorage` | Yes - JS can read it | No | Slightly better (lost on tab close), still not recommended |
| `httpOnly` cookie | No - JS cannot read it | Yes (mitigated with SameSite) | Better, but cookie-based CSRF still possible |
| **BFF pattern** | No - tokens never in browser | No | Recommended. Backend proxy holds tokens. |
| Service Worker | Partially (isolated scope) | No | Emerging pattern, not widely adopted |

**The BFF (Backend-for-Frontend) Pattern:**
1. The SPA communicates with a thin backend proxy (the BFF)
2. The BFF handles the OAuth flow and stores tokens server-side
3. The SPA authenticates to the BFF using httpOnly, Secure, SameSite=Strict cookies
4. The BFF attaches the access token to API requests on behalf of the SPA

This pattern eliminates token exposure in the browser entirely.

### 7.3 Known Incidents

| Year | Incident | Impact | Root Cause |
|------|----------|--------|------------|
| 2018 | Facebook token breach | 50 million accounts exposed | "View As" feature had a vulnerability that leaked access tokens via Open Graph |
| 2018 | GitHub OAuth bypass | Users could authorize apps for organizations they did not own | Insufficient validation of organization membership during OAuth flow |
| 2019 | Multiple open redirect vulnerabilities in major IdPs | Authorization codes could be leaked to attacker-controlled domains | Lax redirect URI validation, wildcard patterns |
| 2020 | SolarWinds SAML token forging | US government agencies breached | Attackers forged SAML tokens using stolen signing keys (not OAuth, but related) |
| 2022 | Okta LAPSUS$ breach | Support system accessed, customer data exposed | Social engineering, not an OAuth protocol flaw |
| 2023 | Microsoft Storm-0558 | US government email accounts accessed | Stolen MSA signing key used to forge tokens for Entra ID |

### 7.4 Security Best Practices Summary

| Practice | RFC / BCP | Priority |
|----------|-----------|----------|
| Use PKCE for ALL clients (confidential and public) | RFC 7636, OAuth 2.1 | Critical |
| Use exact redirect URI matching | RFC 6749, Security BCP | Critical |
| Validate state parameter | RFC 6749 | Critical |
| Validate all ID Token claims (iss, aud, exp, nonce) | OIDC Core | Critical |
| Use short-lived access tokens (5-15 minutes) | Security BCP | High |
| Implement refresh token rotation | Security BCP | High |
| Store tokens in httpOnly cookies or use BFF pattern | Security BCP for Browser-Based Apps | High |
| Set X-Frame-Options / frame-ancestors on AS pages | Security BCP | High |
| Use sender-constrained tokens (DPoP or mTLS) | RFC 9449 | Medium |
| Implement token revocation | RFC 7009 | Medium |
| Use PAR for sensitive authorization requests | RFC 9126 | Medium |
| Implement AS metadata validation via Discovery | OIDC Discovery | Medium |

![Threat model with attack vectors and defenses](diagrams/threat-model-attack-vectors.mmd)

---

## 8. Regulation and Compliance

### 8.1 GDPR and OAuth Consent

The EU General Data Protection Regulation (GDPR) has specific implications for OAuth and OIDC implementations.

**Consent Screens vs. GDPR Consent.** The OAuth consent screen ("Spotify wants to access your email and profile") is not the same as GDPR consent. OAuth consent is about delegating access to technical resources. GDPR consent is about the lawful basis for processing personal data. They may overlap (e.g., the user consents to sharing their email), but they are legally distinct.

**Data Minimization.** GDPR requires that data collection be limited to what is necessary. This maps directly to OAuth scopes: request only the scopes you actually need. If your app only needs the user's email to create an account, do not request the `profile` scope (which includes name, picture, locale, etc.).

**Right to Erasure.** When a user requests deletion under GDPR Article 17, the Relying Party must delete all data obtained via OAuth/OIDC, including cached ID Token claims, UserInfo responses, and any profile data derived from them.

**Cross-Border Data Transfers.** If the IdP is in the US (e.g., Google, Auth0) and the user is in the EU, the token exchange and UserInfo responses involve cross-border data transfers. This requires appropriate safeguards (Standard Contractual Clauses, adequacy decisions, etc.).

### 8.2 Privacy Considerations

**IdP Tracking.** Every time a user authenticates via a social login, the IdP knows which Relying Party the user visited. Google knows every app you log into with "Sign in with Google." This is a significant privacy concern.

**Apple's "Hide My Email."** Apple addresses IdP tracking (partially) with its private email relay service. When using Sign in with Apple, the user can choose to hide their real email. Apple generates a unique forwarding address (e.g., `dpdx4f9z7y@privaterelay.appleid.com`) for each Relying Party. The RP never sees the user's real email.

**Pairwise Subject Identifiers.** OIDC supports pairwise `sub` values, where the same user gets a different `sub` for each Relying Party. This prevents RPs from correlating user identities across applications by comparing `sub` values. Most providers use public `sub` values (same across all RPs), but the option exists.

### 8.3 Industry-Specific Standards

| Standard | Industry | What It Adds to OAuth/OIDC |
|----------|----------|--------------------------|
| **FAPI 1.0 / 2.0** (Financial-grade API) | Banking, open banking | Mandatory PKCE, PAR, sender-constrained tokens, stricter redirect URI rules, response signing |
| **SMART on FHIR** | Healthcare | OAuth 2.0 + FHIR scopes for patient data access. Enables EHR app authorization. |
| **eIDAS 2.0** | EU government | European Digital Identity Wallet. OIDC-based, cross-border identity. |
| **CIBA** (Client Initiated Backchannel Authentication) | Banking, payments | Decoupled authentication - user authorizes on a separate device. Used for SCA (Strong Customer Authentication). |

### 8.4 Compliance Certifications

When choosing an identity provider for regulated workloads, look for:

| Certification | Relevance |
|--------------|-----------|
| **SOC 2 Type II** | Audited security controls for SaaS providers |
| **ISO 27001** | Information security management system |
| **HIPAA** | US healthcare data protection (required for PHI) |
| **FedRAMP** | US government cloud security (required for federal agencies) |
| **PCI DSS** | Payment card data protection (if tokens carry card data) |
| **FAPI certification** | OpenID Foundation certifies OIDC providers against FAPI profiles |
| **OIDC certification** | OpenID Foundation certifies basic, implicit, hybrid, config, and dynamic profiles |

---

## 9. Comparisons and Alternatives

### 9.1 OAuth 2.0 + OIDC vs. SAML 2.0

| Feature | OAuth 2.0 + OIDC | SAML 2.0 |
|---------|-------------------|----------|
| **Year** | 2012 (OAuth), 2014 (OIDC) | 2005 |
| **Data format** | JSON (JWT) | XML |
| **Token size** | ~800 bytes (typical JWT) | 5-20 KB (XML assertion) |
| **Transport binding** | HTTP redirects + HTTPS POST | HTTP POST binding, HTTP redirect, SOAP |
| **Signing** | JWS (JSON Web Signature) | XML DSig |
| **Encryption** | JWE (JSON Web Encryption) | XML Enc |
| **Discovery** | .well-known/openid-configuration (JSON) | SAML metadata XML |
| **Mobile support** | Excellent (designed for it) | Poor (XML parsing, no native mobile SDKs) |
| **SPA support** | Excellent (PKCE, CORS) | Not designed for SPAs |
| **API authorization** | Built-in (access tokens + scopes) | Not designed for API access |
| **Delegation** | Core use case (third-party access) | Not a primary feature |
| **Enterprise SSO** | Growing adoption | Dominant in enterprise |
| **Complexity** | Moderate | High (XML schemas, canonicalization) |
| **Debugging** | Easy (JWT is base64, readable) | Hard (XML namespaces, canonicalization) |
| **Ecosystem** | Modern cloud, mobile, APIs | Legacy enterprise, on-premises IdPs |
| **Identity providers** | Google, Apple, GitHub, Entra ID | ADFS, Shibboleth, PingFederate |

**When to use SAML:** You are integrating with enterprise customers who already use ADFS, PingFederate, or Okta with SAML. Their IT department requires SAML. You have no choice.

**When to use OIDC:** Everything else. New applications, consumer-facing products, mobile apps, APIs, and modern enterprise deployments.

### 9.2 OAuth vs. API Keys

| Feature | OAuth 2.0 | API Keys |
|---------|-----------|----------|
| **User context** | Yes (delegated access) | No (static credential) |
| **Scoped access** | Yes (fine-grained scopes) | Typically all-or-nothing |
| **Expiration** | Built-in (token lifetime) | Usually never (unless manually rotated) |
| **Revocation** | Per-token, per-grant | Per-key |
| **Audit trail** | Per-user, per-application | Per-key (no user context) |
| **Setup complexity** | Higher (flows, redirects, tokens) | Low (generate key, send in header) |
| **Best for** | User-facing apps, third-party integrations | Internal services, rate limiting, simple API access |

### 9.3 OAuth vs. mTLS

| Feature | OAuth 2.0 | mTLS (Mutual TLS) |
|---------|-----------|-------------------|
| **Authentication model** | Token-based | Certificate-based |
| **User context** | Yes | No (identifies machines, not users) |
| **Infrastructure** | AS + RS | PKI (certificate authority, distribution, rotation) |
| **Granularity** | Per-request scopes | Binary (valid cert or not) |
| **Best for** | User authorization, API access | Service mesh, zero-trust, machine-to-machine |
| **Can be combined** | Yes - OAuth + mTLS client auth (RFC 8705) | Yes |

### 9.4 OAuth vs. Session Cookies

| Feature | OAuth 2.0 | Session Cookies |
|---------|-----------|----------------|
| **Cross-origin** | Yes (designed for it) | No (same-origin by default) |
| **Third-party access** | Yes | No |
| **Mobile support** | Yes (tokens in memory) | Limited (cookie handling varies) |
| **Scalability** | Stateless (JWT) or centralized | Requires session store (Redis, DB) |
| **Best for** | APIs, third-party apps, mobile | Same-origin web apps, server-rendered pages |

### 9.5 Decision Matrix

| Scenario | Recommended Approach |
|----------|---------------------|
| Consumer web app with social login | OIDC (Authorization Code + PKCE) |
| Enterprise SSO for employees | OIDC or SAML (depending on existing IdP) |
| Mobile app needing user identity | OIDC (Authorization Code + PKCE) |
| Backend microservice calling another microservice | OAuth 2.0 Client Credentials or mTLS |
| Smart TV / CLI tool | OAuth 2.0 Device Authorization Grant |
| Simple internal API with rate limiting | API keys |
| Third-party integration (user delegates access) | OAuth 2.0 (Authorization Code + PKCE) |
| Service mesh (Kubernetes, Istio) | mTLS + optional OAuth 2.0 |
| Same-origin server-rendered web app | Session cookies (OAuth may be unnecessary) |
| Banking / financial API | OIDC + FAPI profile (PAR, DPoP, mTLS) |

![Decision tree for choosing auth approach](diagrams/oauth-vs-saml-vs-apikeys.mmd)

---

## 10. Modern Developments

### 10.1 OAuth 2.1 (Draft)

OAuth 2.1 is not a new protocol. It is a consolidation of OAuth 2.0 (RFC 6749) plus all the security best practices that have been published since 2012. It is expected to be finalized in 2025.

**Key changes from OAuth 2.0:**

| Change | Current Status (OAuth 2.0) | OAuth 2.1 |
|--------|---------------------------|-----------|
| PKCE | Optional (recommended) | **Required for all clients** |
| Implicit grant | Allowed | **Removed** |
| ROPC grant | Allowed | **Removed** |
| Refresh token rotation | Optional | **Required for public clients** |
| Redirect URI matching | Implementation-defined | **Exact string matching required** |
| Bearer token in URI query | Allowed (discouraged) | **Removed** |

OAuth 2.1 does not add new features. It codifies what everyone should already be doing.

### 10.2 GNAP (Grant Negotiation and Authorization Protocol)

GNAP is a clean-sheet redesign of OAuth, not an incremental update. It is being developed in the IETF GNAP working group.

**Key differences from OAuth 2.0:**

| Feature | OAuth 2.0 | GNAP |
|---------|-----------|------|
| Core concept | Client requests scopes via redirects | Client and AS negotiate a grant via HTTP API |
| Redirect requirement | Required for most flows | Optional (supports redirect, push, poll) |
| Client identification | client_id from pre-registration | Client identifies itself with keys (no pre-registration required) |
| Token binding | Optional (DPoP) | Built-in (key-bound by default) |
| Request format | URL query parameters | JSON objects (richer, structured) |
| Backwards compatibility | N/A | Not backwards compatible with OAuth 2.0 |
| Maturity | Production (2012+) | Draft (not yet production-ready) |

GNAP is interesting but unlikely to replace OAuth 2.0/OIDC in the near term. The OAuth ecosystem is too entrenched. Watch GNAP for long-term evolution, but build with OAuth 2.0/OIDC today.

### 10.3 DPoP (Demonstration of Proof-of-Possession, RFC 9449)

DPoP solves the bearer token problem: if someone steals your access token, they can use it freely. DPoP binds the token to a client-generated key pair.

**How it works:**

1. The client generates an asymmetric key pair (e.g., ES256)
2. At the token endpoint, the client includes a `DPoP` header containing a signed JWT proof
3. The AS issues a token bound to the client's public key (`cnf` claim)
4. On every API request, the client includes a new DPoP proof signed with its private key
5. The Resource Server verifies the DPoP proof matches the token's binding

```http
POST /token HTTP/1.1
Host: auth.example.com
DPoP: eyJhbGciOiJFUzI1NiIsInR5cCI6ImRwb3Arand0IiwiandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTYiLCJ4IjoibE4... }

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&code_verifier=dBjftJeZ4CVP...
```

The token response includes:
```json
{
  "access_token": "eyJ...bound-token...",
  "token_type": "DPoP"
}
```

API requests include both the token and a fresh DPoP proof:
```http
GET /resource HTTP/1.1
Authorization: DPoP eyJ...bound-token...
DPoP: eyJ...fresh-proof-jwt...
```

A stolen `access_token` is useless without the private key to generate DPoP proofs.

### 10.4 RAR (Rich Authorization Requests, RFC 9396)

Traditional OAuth scopes are coarse-grained strings like `read`, `write`, `admin`. RAR allows structured, typed authorization requests:

```json
{
  "authorization_details": [
    {
      "type": "payment_initiation",
      "instructedAmount": {
        "currency": "EUR",
        "amount": "123.50"
      },
      "debtorAccount": {
        "iban": "DE40100100103307118608"
      },
      "creditorName": "Merchant A",
      "creditorAccount": {
        "iban": "DE02100100109307118603"
      }
    }
  ]
}
```

This is essential for banking (PSD2/Open Banking) where "authorize a payment of EUR 123.50 from account X to account Y" cannot be expressed as a simple scope string.

### 10.5 PAR (Pushed Authorization Requests, RFC 9126)

Normally, authorization request parameters are sent via the browser's URL (front-channel). This has limits:

- URL length restrictions (~2000 characters in some browsers)
- Parameters visible in browser history and logs
- Complex parameters (like RAR) are hard to encode in URLs

PAR moves the authorization request to the back-channel:

```http
POST /par HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(client_id:client_secret)

response_type=code
&client_id=spotify-web-abc123
&redirect_uri=https://accounts.spotify.com/callback
&scope=openid profile email
&code_challenge=E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM
&code_challenge_method=S256
```

Response:

```json
{
  "request_uri": "urn:ietf:params:oauth:request_uri:6esc_11ACC5bwc014ltc14eY22c",
  "expires_in": 60
}
```

The client then redirects the browser with just the `request_uri`:

```
GET /authorize?
  client_id=spotify-web-abc123
  &request_uri=urn:ietf:params:oauth:request_uri:6esc_11ACC5bwc014ltc14eY22c
```

Benefits: parameters are not exposed in the browser, complex requests (RAR) work, and the AS can authenticate the client before the user is involved.

### 10.6 Passkeys and OIDC Interaction

Passkeys (WebAuthn / FIDO2) replace passwords with public-key cryptography. They are phishing-resistant because the credential is bound to the origin (domain) and never leaves the device.

**How passkeys interact with OIDC:**

1. **Passkeys as an authentication method at the IdP.** The user registers a passkey with Google. When logging into Spotify via OIDC, Google uses the passkey instead of a password for Step 3 of the Authorization Code flow. The OIDC flow itself is unchanged - passkeys replace the authentication mechanism, not the authorization protocol.

2. **Passkeys replacing OIDC entirely.** For first-party authentication (no third-party access needed), passkeys can replace OIDC altogether. The user registers a passkey directly with the Relying Party. No IdP is needed. This is simpler but loses the "sign in with Google" convenience and IdP-managed identity lifecycle.

3. **Conditional UI / Autofill.** Modern browsers show passkey options in the login form's autofill dropdown, alongside passwords. This makes the passkey experience seamless and familiar.

### 10.7 Token Exchange (RFC 8693)

Token Exchange allows a service to exchange one token for another. Common use cases:

- **Impersonation:** A backend service exchanges a user's access token for a new token with different scopes (e.g., a gateway exchanges a broad token for a narrow one before forwarding to a microservice).
- **Delegation:** Service A has a user's token and needs to call Service B on the user's behalf but with Service B-specific scopes.
- **Cross-domain SSO:** Exchange an ID Token from one domain for an access token in another domain.

```http
POST /token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:token-exchange
&subject_token=eyJhbGciOiJSUzI1NiJ9...
&subject_token_type=urn:ietf:params:oauth:token-type:access_token
&requested_token_type=urn:ietf:params:oauth:token-type:access_token
&audience=https://service-b.example.com
&scope=service-b:read
```

![OAuth evolution from 1.0 to GNAP](diagrams/oauth21-and-gnap-evolution.mmd)

---

## 11. Appendix

### 11.1 Glossary

| Term | Definition |
|------|-----------|
| **Access Token** | A credential used to access protected resources on the Resource Server. |
| **Authorization Code** | A short-lived, single-use code exchanged for tokens at the token endpoint. |
| **Authorization Endpoint** | The URL where the user authenticates and consents (/authorize). |
| **Authorization Server (AS)** | The server that authenticates users and issues tokens. |
| **Bearer Token** | A token that grants access to anyone who possesses it (no proof-of-possession). |
| **BFF** | Backend-for-Frontend, a proxy that handles OAuth flows on behalf of a SPA. |
| **CIBA** | Client Initiated Backchannel Authentication, allows decoupled auth flows. |
| **Claim** | A key-value pair in a JWT payload (e.g., "email": "sarah@gmail.com"). |
| **Client** | The application requesting access to the user's resources. |
| **Client Credentials** | OAuth grant for machine-to-machine communication. |
| **Client ID** | Public identifier for a registered OAuth client. |
| **Client Secret** | Confidential credential shared between client and AS. |
| **Code Challenge** | SHA256(code_verifier), sent in the authorization request (PKCE). |
| **Code Verifier** | Random string generated by the client, sent at token exchange (PKCE). |
| **Confidential Client** | A client that can securely store a client_secret (server-side app). |
| **Consent Screen** | The UI where the user approves or denies the client's scope request. |
| **CORS** | Cross-Origin Resource Sharing, browser policy for cross-origin requests. |
| **CSRF** | Cross-Site Request Forgery, mitigated by the state parameter. |
| **Discovery Document** | JSON at .well-known/openid-configuration describing AS endpoints. |
| **DPoP** | Demonstration of Proof-of-Possession, binds tokens to client keys. |
| **FAPI** | Financial-grade API, a high-security profile of OAuth/OIDC for banking. |
| **GNAP** | Grant Negotiation and Authorization Protocol, potential OAuth successor. |
| **Grant Type** | The method used to obtain an access token (authorization_code, client_credentials, etc.). |
| **ID Token** | A JWT containing identity claims, issued by OIDC providers. |
| **IdP** | Identity Provider, the service that authenticates users and issues identity assertions. |
| **Implicit Grant** | Deprecated OAuth flow that returned tokens directly in the URL fragment. |
| **Issuer (iss)** | The entity that issued a token (URL of the authorization server). |
| **JWK** | JSON Web Key, a JSON representation of a cryptographic key. |
| **JWKS** | JSON Web Key Set, a set of JWKs published at a well-known endpoint. |
| **JWT** | JSON Web Token, a compact, signed (and optionally encrypted) JSON object. |
| **Nonce** | A random value included in the auth request and embedded in the ID Token (replay prevention). |
| **OIDC** | OpenID Connect, an identity layer built on top of OAuth 2.0. |
| **Opaque Token** | A token that is not self-contained (must be introspected at the AS). |
| **PAR** | Pushed Authorization Requests, sends auth params via back-channel. |
| **PKCE** | Proof Key for Code Exchange, prevents authorization code interception. |
| **Public Client** | A client that cannot securely store secrets (SPA, mobile app). |
| **RAR** | Rich Authorization Requests, structured authorization beyond scopes. |
| **Redirect URI** | The URL where the AS sends the user after authorization. |
| **Refresh Token** | A long-lived token used to obtain new access tokens. |
| **Relying Party (RP)** | The OIDC term for the client that consumes identity tokens. |
| **Resource Owner** | The user who owns the protected resources. |
| **Resource Server (RS)** | The server hosting APIs protected by OAuth tokens. |
| **ROPC** | Resource Owner Password Credentials, deprecated OAuth grant. |
| **Scope** | A string that defines the level of access being requested. |
| **State** | A random value for CSRF protection in the authorization flow. |
| **Subject (sub)** | The unique identifier for the user in the issuer's system. |
| **Token Endpoint** | The URL where the client exchanges codes or refresh tokens for tokens. |
| **Token Exchange** | RFC 8693, allows exchanging one token type for another. |
| **Token Introspection** | RFC 7662, allows checking if a token is active. |
| **Token Revocation** | RFC 7009, allows invalidating a token before expiration. |
| **UserInfo Endpoint** | OIDC endpoint that returns identity claims based on the access token. |

### 11.2 All Diagrams

| Diagram | Source | Section | Description |
|---------|--------|---------|-------------|
| Ecosystem Participants | [`diagrams/oauth2-ecosystem-participants.mmd`](diagrams/oauth2-ecosystem-participants.mmd) | 3 | Four OAuth roles + OIDC additions |
| Authorization Code Flow | [`diagrams/authorization-code-flow.mmd`](diagrams/authorization-code-flow.mmd) | 4 | Complete Auth Code + PKCE flow |
| PKCE Deep Dive | [`diagrams/authorization-code-pkce-flow.mmd`](diagrams/authorization-code-pkce-flow.mmd) | 5 | PKCE verifier/challenge mechanics |
| Client Credentials | [`diagrams/client-credentials-flow.mmd`](diagrams/client-credentials-flow.mmd) | 5 | Machine-to-machine grant |
| Device Code Flow | [`diagrams/device-code-flow.mmd`](diagrams/device-code-flow.mmd) | 5 | Smart TV / CLI flow |
| Implicit Flow (Deprecated) | [`diagrams/implicit-flow-deprecated.mmd`](diagrams/implicit-flow-deprecated.mmd) | 5 | Deprecated flow with vulnerabilities |
| OpenID Connect Layer | [`diagrams/openid-connect-layer.mmd`](diagrams/openid-connect-layer.mmd) | 5 | OIDC layered on OAuth 2.0 |
| JWT Anatomy | [`diagrams/jwt-anatomy.mmd`](diagrams/jwt-anatomy.mmd) | 5 | Header.Payload.Signature dissection |
| Token Lifecycle | [`diagrams/token-lifecycle.mmd`](diagrams/token-lifecycle.mmd) | 5 | Token states and transitions |
| Sarah Logs Into Spotify | [`diagrams/sarah-logs-into-spotify.mmd`](diagrams/sarah-logs-into-spotify.mmd) | 4 | Concrete end-to-end walkthrough |
| Identity Provider Economics | [`diagrams/identity-provider-economics.mmd`](diagrams/identity-provider-economics.mmd) | 6 | Commercial vs free vs open-source IDPs |
| Auth Approach Decision Tree | [`diagrams/oauth-vs-saml-vs-apikeys.mmd`](diagrams/oauth-vs-saml-vs-apikeys.mmd) | 9 | Decision tree for choosing auth approach |
| Threat Model | [`diagrams/threat-model-attack-vectors.mmd`](diagrams/threat-model-attack-vectors.mmd) | 7 | Attacks (red) and defenses (green) |
| OAuth Evolution | [`diagrams/oauth21-and-gnap-evolution.mmd`](diagrams/oauth21-and-gnap-evolution.mmd) | 10 | OAuth 1.0 to 2.0 to 2.1 to GNAP timeline |

### 11.3 Complete RFC Reference

| RFC | Title | Year | Relevance |
|-----|-------|------|-----------|
| RFC 5849 | The OAuth 1.0 Protocol | 2010 | Historical, superseded by OAuth 2.0 |
| RFC 6749 | The OAuth 2.0 Authorization Framework | 2012 | Core OAuth 2.0 specification |
| RFC 6750 | OAuth 2.0 Bearer Token Usage | 2012 | How to use bearer tokens |
| RFC 6819 | OAuth 2.0 Threat Model and Security Considerations | 2013 | Original security analysis |
| RFC 7009 | OAuth 2.0 Token Revocation | 2013 | Token revocation endpoint |
| RFC 7515 | JSON Web Signature (JWS) | 2015 | Signing JWTs |
| RFC 7516 | JSON Web Encryption (JWE) | 2015 | Encrypting JWTs |
| RFC 7517 | JSON Web Key (JWK) | 2015 | Key representation |
| RFC 7518 | JSON Web Algorithms (JWA) | 2015 | Cryptographic algorithms for JWS/JWE |
| RFC 7519 | JSON Web Token (JWT) | 2015 | Token format |
| RFC 7521 | Assertion Framework for OAuth 2.0 | 2015 | Using assertions as grants |
| RFC 7523 | JWT Profile for OAuth 2.0 Client Auth and Grants | 2015 | JWT as client credential or grant |
| RFC 7591 | OAuth 2.0 Dynamic Client Registration | 2015 | Programmatic client registration |
| RFC 7636 | Proof Key for Code Exchange (PKCE) | 2015 | Protection for public clients |
| RFC 7662 | OAuth 2.0 Token Introspection | 2015 | Check if a token is active |
| RFC 8252 | OAuth 2.0 for Native Apps | 2017 | Best practices for mobile/desktop apps |
| RFC 8414 | OAuth 2.0 Authorization Server Metadata | 2018 | AS discovery (complementary to OIDC Discovery) |
| RFC 8628 | OAuth 2.0 Device Authorization Grant | 2019 | Smart TV / CLI flow |
| RFC 8693 | OAuth 2.0 Token Exchange | 2020 | Exchange one token for another |
| RFC 8705 | OAuth 2.0 Mutual-TLS Client Auth and Cert-Bound Access Tokens | 2020 | mTLS for client auth and token binding |
| RFC 8707 | Resource Indicators for OAuth 2.0 | 2020 | Specify which RS the token is for |
| RFC 9101 | JWT-Secured Authorization Request (JAR) | 2021 | Sign the authorization request itself |
| RFC 9126 | Pushed Authorization Requests (PAR) | 2021 | Back-channel authorization requests |
| RFC 9207 | OAuth 2.0 Authorization Server Issuer Identification | 2022 | Prevent mix-up attacks |
| RFC 9396 | Rich Authorization Requests (RAR) | 2022 | Structured authorization beyond scopes |
| RFC 9449 | DPoP (Demonstration of Proof-of-Possession) | 2023 | Token bound to client key pair |

### 11.4 HTTP Status Codes for OAuth

| Status Code | Context | Meaning |
|-------------|---------|---------|
| 200 OK | Token endpoint, introspection, userinfo | Successful response |
| 302 Found | Authorization endpoint | Redirect to client with code or error |
| 400 Bad Request | Token endpoint | Invalid request (missing params, invalid code, bad PKCE) |
| 401 Unauthorized | Resource Server | Token missing, expired, or invalid |
| 403 Forbidden | Resource Server | Token valid but insufficient scope |
| 405 Method Not Allowed | Any endpoint | Wrong HTTP method (GET instead of POST on /token) |
| 429 Too Many Requests | Device code polling | Client is polling too fast (slow_down error) |

**Common error responses at the token endpoint:**

```json
{
  "error": "invalid_grant",
  "error_description": "The authorization code has expired or has already been used."
}
```

| Error Code | Meaning |
|-----------|---------|
| `invalid_request` | Missing required parameter or malformed request |
| `invalid_client` | Client authentication failed |
| `invalid_grant` | Auth code expired, used, or PKCE verification failed |
| `unauthorized_client` | Client not authorized for this grant type |
| `unsupported_grant_type` | AS does not support the requested grant type |
| `invalid_scope` | Requested scope is invalid or exceeds what was granted |
| `authorization_pending` | Device code: user has not yet authorized (keep polling) |
| `slow_down` | Device code: reduce polling frequency |
| `expired_token` | Device code: the device_code has expired |

---

## 12. Key Takeaways

1. **OAuth is authorization, not authentication.** OAuth 2.0 answers "what can this app do?" not "who is this user?" If you need identity, you need OpenID Connect (which is built on top of OAuth 2.0).

2. **Authorization Code + PKCE is the one flow you need.** It works for web apps, mobile apps, SPAs, and desktop apps. The Implicit and ROPC grants are deprecated. Client Credentials is for machine-to-machine only. Device Code is for input-constrained devices.

3. **The redirect_uri is the most critical security parameter.** If an attacker can control where the authorization code is sent, they can steal tokens. Always use exact string matching. Never use wildcards or open redirects.

4. **PKCE is not just for public clients.** OAuth 2.1 makes PKCE mandatory for all clients, including confidential ones. It costs nothing to implement and prevents authorization code interception.

5. **JWTs are not magic.** An unsigned JWT is just base64-encoded JSON. Always verify the signature using the issuer's public keys (from the JWKS endpoint). Always validate `iss`, `aud`, `exp`, and `nonce`.

6. **Tokens are not passwords.** Access tokens are short-lived permissions. Refresh tokens are long-lived but revocable and rotatable. Neither should be stored in places JavaScript can access (use httpOnly cookies or the BFF pattern).

7. **The consent screen is not GDPR consent.** OAuth consent ("Spotify wants to access your email") is about delegating technical access. GDPR consent is about lawful basis for data processing. They may overlap but are legally distinct.

8. **Self-host if you must, buy if you can.** Unless you are in a regulated industry requiring on-premises deployment or have 100K+ users making IDaaS prohibitively expensive, use a managed identity provider. The security implications of a misconfigured auth server are severe.

9. **OIDC Discovery is your best friend.** Every integration starts with fetching `/.well-known/openid-configuration`. It tells you every endpoint, every supported algorithm, every scope. Never hardcode endpoint URLs.

10. **The future is proof-of-possession.** Bearer tokens (anyone with the token can use it) are being replaced by sender-constrained tokens (DPoP, mTLS-bound). OAuth 2.1 codifies best practices. GNAP is a clean-sheet redesign but years away from production adoption.
