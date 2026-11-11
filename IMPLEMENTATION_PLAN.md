# Cinebase Page Wiring: Implementation Plan

## Goal

Make every authenticated navigation destination perform a useful, end-to-end action instead of showing a placeholder. Keep TMDB access on the server, keep user-owned data in PostgreSQL, and make the session work across access-token expiry.

## Page-by-page behavior

| Route | Data source | User actions | Expected empty/error behavior |
|---|---|---|---|
| `/` | `GET /api/movies?page=1` | Open featured/popular movie details; add the featured title to the watchlist | Keep the home layout visible and offer a retry when movie loading fails |
| `/discover` | `GET /api/movies` or `GET /api/movies/search` | Search, page through results, open a movie | Show a useful empty result for no matches and a retry for an API failure |
| `/movies/:movieId` | `GET /api/movies/:id` | Read details, open an available trailer, add/remove the title from the watchlist | Invalid IDs and failed requests show an in-page message rather than a blank route |
| `/recent` | Movie IDs in local storage, hydrated through `GET /api/movies/:id` | Reopen a title or clear local history | Explain that history is empty or browser-local; report partial hydration failures |
| `/watchlist` | `GET /api/users/watchlist`, then movie detail requests | Remove a saved title | Explain how to add the first movie; surface failures and allow retry |
| `/settings` | `GET` and `PATCH /api/users/profile` | Update account name and email | Show loading, validation/API errors, and a success confirmation |

The global search form navigates to `/discover?query=...`; the query and page number are URL-backed so a search result page can be bookmarked or refreshed.

## Data ownership and request flow

1. **Client page** calls a feature API module rather than constructing API URLs in presentation code.
2. **Axios client** sends cookies (`withCredentials`) to the configured backend. On a protected `401`, it requests `/auth/refresh` once for concurrent requests, then retries each original request once.
3. **Express route** validates request parameters/body and requires an access cookie for profile, watchlist, and movie APIs.
4. **Movie service** calls TMDB using the server-only token. TMDB movie detail responses are hydrated for watchlist and recent-history IDs when pages load.
5. **Prisma** stores profile and watchlist state. A unique user/movie constraint prevents duplicate watchlist entries.
6. **Browser storage** stores only the most recent 20 movie IDs. It does not store titles, ratings, tokens, or other account data.

### Watchlist API contract

- `GET /api/users/watchlist` returns `{ data: [{ tmdbMovieId, addedAt }] }`.
- `POST /api/users/watchlist` accepts `{ tmdbMovieId }`; the server upserts by authenticated user and TMDB ID.
- `DELETE /api/users/watchlist/:tmdbMovieId` deletes only the authenticated user's matching item.
- Client pages hydrate IDs with the existing movie detail endpoint. If an individual title fails to hydrate, the rest of the list stays usable and a partial warning is shown.

### Profile API contract

- `GET /api/users/profile` returns the safe profile fields (never the password hash).
- `PATCH /api/users/profile` accepts at least one of `name` or `email`, validates it, and returns `409` if another account owns the requested email.
- Password changes are outside the current profile form and need a separate authenticated flow.

### Refresh behavior

- Do not add JWTs to browser storage. The server owns HttpOnly cookie issuance and rotation.
- Refresh only after a `401` from a non-auth endpoint; never retry login, register, refresh, or logout.
- Mark the original request before retrying so a failed replay cannot loop indefinitely.
- If refresh returns `401`, notify the protected-route boundary to redirect to login. Network/server errors during refresh remain request errors and are not treated as a confirmed logout.

## Work breakdown and completion

### Completed in this wiring pass

- [x] Replace the generic section placeholder with Discover, Recent, Watchlist, and Settings pages.
- [x] Add typed client API modules for movie lists, profile actions, and watchlist actions.
- [x] Add validated profile update and per-user watchlist endpoints backed by the existing Prisma models.
- [x] Make the shared search input submit a discover search and implement result pagination.
- [x] Record and clear a bounded recent movie history in browser local storage.
- [x] Add watchlist controls to movie details and the home feature carousel; allow removal from the Watchlist page.
- [x] Implement profile edit feedback and duplicate-email handling.
- [x] Refresh expired access cookies once and retry failed protected API requests.
- [x] Document local setup, current endpoints, page behavior, and known scope in the README.

### Verification required before merging

- [ ] `client`: run `pnpm build` to type-check and create a production build.
- [ ] `client`: run `pnpm lint` and resolve diagnostics introduced by this work.
- [ ] `server`: run `pnpm build` to check route/controller/service types.
- [ ] With PostgreSQL, TMDB credentials, and both apps running, verify the manual flows below.

## Acceptance checklist

### Discovery and details

1. Sign in, open Discover, search for a known title, and confirm the URL contains the encoded query.
2. Use Next/Previous and verify the displayed page and result set change without leaving Discover.
3. Open a movie and verify available data plus the correct in-page error for a bad ID or unavailable API.
4. Use the global search from another page and verify it lands on Discover with results for that term.

### Watchlist

1. Add a movie from details; the control should update to its saved state.
2. Open Watchlist and verify the same movie appears after reload and after signing in again.
3. Remove it and verify it disappears. Re-add the same ID and verify no duplicate is created.
4. Sign in as a different user and verify the first user's entries are not returned or removable.

### Recent history and settings

1. Open at least two detail pages and verify Recent lists them newest-first; clear and confirm the empty state.
2. Open a movie that is already in history and verify it moves to the newest position, not a duplicate.
3. Change a profile name/email and verify it remains after reloading Settings.
4. Attempt to use an email owned by another user and verify a clear error while preserving the original profile.

### Session expiry

1. With a valid refresh cookie, expire/remove the access cookie and make a protected request; verify refresh and one successful retry.
2. With no valid refresh cookie, make a protected request; verify the user is redirected to login rather than seeing a blank page.
3. Confirm auth endpoints do not trigger recursive refresh requests.

## Follow-on roadmap

These features need separate product/API decisions and are intentionally not represented as working features yet:

1. Add ratings and watched status with user-scoped CRUD, validation, and UI controls.
2. Add trending, top-rated, and genre discovery endpoints and filters.
3. Decide whether recent history should remain browser-local or synchronize to an account-backed table.
4. Add account password change and email verification before making email updates production-ready.
5. Add automated API/client tests around authorization isolation, refresh rotation, search pagination, and form validation.
6. Configure CORS and deployment environment values for the target production origins.
