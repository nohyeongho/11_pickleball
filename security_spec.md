# Security Specification: Busan Pickleball Tournament

## 1. Data Invariants
1. `TournamentApplication` documents must possess all mandatory fields (`id`, `regNumber`, `division`, `clubName`, `player1Name`, `player1Phone`, `player2Name`, `player2Phone`, `depositorName`, `eventType`, `status`, `createdAt`).
2. Document ID must match `isValidId(id)` and strictly match `request.resource.data.id`.
3. Event type must be one of `['남자복식', '여자복식', '혼합복식']`.
4. Field sizes must adhere to boundaries defined in `firebase-blueprint.json` (names <= 50 chars, phones <= 20 chars, etc.).
5. Settings document `/settings/tournament` must only be modifiable with valid structure.

## 2. The "Dirty Dozen" Malicious Payloads
1. **Oversized Name Attack**: Player name exceeds 200 characters to bloat storage.
2. **Invalid Event Type**: Event type set to `'외계복식'` outside allowed enum.
3. **Ghost Field Injection**: Adding `isAdmin: true` or `bypassed: true` into application payload.
4. **Missing Required Fields**: Payload without `player1Phone` or `regNumber`.
5. **Path ID Poisoning**: Using non-alphanumeric or path traversal string as document ID.
6. **ID Mismatch Attack**: Document ID in path is `app_123` while internal `id` is `app_999`.
7. **Negative or Non-String Values**: Number supplied where string is expected.
8. **Script Injection in Division**: Setting division to `<script>alert(1)</script>`.
9. **Status Hijack Attack**: Direct modification of sensitive status without authorization.
10. **Unbounded Array Injection**: Attempting to inject arbitrarily large arrays into document.
11. **Malicious Settings Overwrite**: Emptying required tournament settings.
12. **Tampered Password Attack**: Blanking out password to hijack cancellation.
