# CineVantaara — Security & Privacy Architecture

---

## 1. Zero Administrator Decryption Backdoor Guarantee
In accordance with international creative confidentiality standards (scripts, unreleased treatments, and casting discussions):
- **Client-Side End-to-End Encryption (E2EE):** All direct messaging payloads are encrypted on the creator's browser using AES-GCM 256-bit keys generated via the browser's native `window.crypto.subtle`.
- **Private Key Isolation:** Keys are stored exclusively in client-side storage. No server, database record, administrator console, or support tool has access to client decryption keys.
- **Server Ciphertext-Only Storage:** The backend database stores only `IV:CIPHERTEXT`. Even in the event of a database dump or administrative inspection, private messages remain indecipherable.

---

## 2. Password & Identity Protection
- **BCrypt Password Hashing:** Salted hashing with work factor 10. Passwords are never stored or logged in plain text.
- **JWT Stateless Token Rotation:** Access tokens expire after 24 hours; refresh tokens are stored as non-replayable, rotatable hashes.
- **Multi-Role RBAC:** Backend authorization via `@PreAuthorize` prevents unauthorized access to executive producer endpoints or administrative tools.

---

## 3. 3-Tier Administrative Access Model

```
┌────────────────────────────────────────────────────────┐
│ Super Administrator                                    │
│ - Security protocol audits                             │
│ - Identity verification oversight                      │
│ - System configuration & audit logs                    │
│ [NO ACCESS TO PRIVATE PASSWORDS OR CHAT CIPHERTEXT]    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Platform Administrator                                 │
│ - Content dispute management                           │
│ - Opportunity & casting legitimacy checks              │
│ [NO ACCESS TO PRIVATE PASSWORDS OR CHAT CIPHERTEXT]    │
└──────────────────────────┬─────────────────────────────┘
                           │
┌──────────────────────────▼─────────────────────────────┐
│ Moderator                                              │
│ - Public portfolio flags & guideline compliance        │
│ [NO ACCESS TO PRIVATE PASSWORDS OR CHAT CIPHERTEXT]    │
└────────────────────────────────────────────────────────┘
```

---

## 4. Anti-Abuse & Integrity Measures
- **Anti-Spam Review Guard:** Database composite constraint `(author_id, target_user_id, project_title)` strictly prevents duplicate or fraudulent reviews for the same project.
- **Producer Role Enforcement:** Producers cannot upload personal portfolios through the system; their role is strictly scoped to talent recruitment, casting calls, and opportunity greenlighting.
- **Audit Logging:** Every administrative action generates an immutable audit record containing the administrator's ID, action code, timestamp, and target entity.
