# Cinebase

Cinebase is a movie discovery app for browsing TMDB titles, inspecting film details, and keeping a personal watchlist. The React client talks to the Express API; the API owns authentication and user data, and proxies movie data from TMDB.

## What works today

- **Home (`/`)** — features and popular movies from the server.
- **Discover (`/discover`)** — search movies or browse popular results with pagination. Search terms are shareable as URL query parameters.
- **Movie details (`/movies/:movieId`)** — movie overview, rating, genres, runtime, cast, and a YouTube trailer when TMDB has one. Opening a title records it in the browser's recent history.
- **Recently viewed (`/recent`)** — the most recent 20 movie details opened in the current browser profile. This is local browser storage, not a cross-device account feature.
- **Watchlist (`/watchlist`)** — saved TMDB movie IDs stored for the signed-in account. Add a movie from its detail page or the home feature carousel; remove it from this page.
- **Settings (`/settings`)** — view and update the signed-in account's name and email.
- **Authentication** — registration, login, protected pages, refresh-token rotation, and logout use secure server-managed cookies.

The watchlist and profile are account-backed. Movie metadata and imagery come from TMDB. Recent history intentionally stays in local storage.

## Technology

| Area | Technology |
|---|---|
| Client | React, TypeScript, Vite, React Router, Tailwind CSS |
| Server | Node.js, Express, TypeScript |
| Database | PostgreSQL, Prisma |
| Authentication | HttpOnly access and refresh cookies, JWT, Argon2id password hashing |
| Movie provider | TMDB API |
| HTTP client | Axios |

## Repository layout

```text
cinebase/
├── client/
│   └── src/
│       ├── components/       # Layout and reusable UI
│       ├── features/
│       │   ├── auth/         # Login, registration, auth API
│       │   ├── home/         # Home and library pages
│       │   ├── movies/       # Movie API, types, details, recent history
│       │   ├── users/        # Profile API
│       │   └── watchlist/    # Watchlist API and toggle control
│       ├── lib/              # Axios client and refresh handling
│       └── routes/
├── server/
│   ├── prisma/               # Database schema and migrations
│   └── src/
│       ├── config/           # Environment, database, TMDB clients
│       ├── middlewares/      # Authentication and request validation
│       └── modules/          # Auth, movies, and user endpoints
├── IMPLEMENTATION_PLAN.md
└── README.md
```

## Run locally

### Prerequisites

- Node.js LTS and pnpm (or Corepack-enabled Node.js)
- PostgreSQL (local or a [Neon](https://neon.tech) database)
- A TMDB API Read Access Token

### 1. Configure the server

From the repository root:

```powershell
cd server
pnpm install
```

Create `server/.env` with:

```env
PORT=5000
NODE_ENV=development
# Pooled connection string (runtime)
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxx-pooler.REGION.aws.neon.tech/neondb?sslmode=require"
# Direct connection string (Prisma Migrate/introspection)
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxx.REGION.aws.neon.tech/neondb?sslmode=require"
TMDB_ACCESS_TOKEN="your_tmdb_api_read_access_token"
JWT_SECRET="use-a-long-random-secret"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_SECRET="use-a-different-long-random-secret"
CLIENT_URL="http://localhost:5173"
```

Use unique random values for the JWT secrets; never commit `.env` or real credentials. `JWT_REFRESH_SECRET` is required by server configuration. The current refresh-token implementation stores hashed, random refresh tokens in the database and rotates them on use.

#### Using Neon

1. Create a project and database in the Neon console.
2. Copy both connection strings from **Connect**: use the **pooled** string for `DATABASE_URL` and the **direct** string for `DIRECT_URL`. Keep `sslmode=require`.
3. Apply the committed migrations with the direct connection, then generate the client:

```powershell
pnpm db:migrate
pnpm db:generate
```

For local PostgreSQL, set `DATABASE_URL` to the local database and omit `DIRECT_URL`. Prisma falls back to `DATABASE_URL` when `DIRECT_URL` is not set. During active schema development, use `pnpm db:migrate:dev` to create new migration files.

Start the API in the `server` directory:

```powershell
pnpm dev
```

The API listens on `http://localhost:5000`; health can be checked at `http://localhost:5000/api/health`.

### 2. Configure and run the client

In another terminal:

```powershell
cd client
pnpm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the client:

```powershell
pnpm dev
```

Vite prints the local client URL (normally `http://localhost:5173`). The server's CORS origin is currently configured for that development URL.

### 3. Build and lint

Run commands in their respective package directories:

```powershell
pnpm build
pnpm lint
```

The server package currently provides a TypeScript build but does not define a lint script.

## API

Authenticated endpoints require the server's access cookie. The client sends cookies with requests and retries a failed protected request once after refreshing an expired access cookie.

### Authentication

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Create an account and set auth cookies |
| `POST` | `/api/auth/login` | Authenticate and set auth cookies |
| `POST` | `/api/auth/refresh` | Rotate refresh token and issue a new access cookie |
| `POST` | `/api/auth/logout` | Revoke refresh token and clear auth cookies |

### Movies (authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/movies?page=1` | Popular movies |
| `GET` | `/api/movies/search?query=...&page=1` | Search TMDB movies |
| `GET` | `/api/movies/:id` | Movie details, credits, and videos |

### User profile and watchlist (authenticated)

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/users/profile` | Read the current profile |
| `PATCH` | `/api/users/profile` | Update name and/or email |
| `GET` | `/api/users/watchlist` | List saved TMDB IDs and save dates |
| `POST` | `/api/users/watchlist` | Add `{ "tmdbMovieId": 123 }`; idempotent for a repeated ID |
| `DELETE` | `/api/users/watchlist/:tmdbMovieId` | Remove a saved movie |

The server validates request inputs and scopes watchlist operations to the authenticated user. It stores movie IDs rather than copying TMDB metadata; the client asks the movie endpoint for current titles and images.

## Security and operational notes

- TMDB credentials and database/JWT secrets belong only in the server environment.
- Passwords are hashed with Argon2id. Access and refresh cookies are HttpOnly; the refresh cookie is scoped to `/api/auth`.
- When an API request returns `401`, the client shares one refresh request between concurrent failures, retries the original request once, and sends the user to login if refresh is rejected.
- The database enforces a unique `(userId, tmdbMovieId)` watchlist entry.
- Recent history is device/browser-specific and can be cleared from the Recent page.
- TMDB supplies movie metadata and images. Cinebase is not endorsed or certified by TMDB.

## Current scope and next steps

Ratings, profile avatars, watched status, trending/top-rated categories, and server-synchronized recent history do not yet have end-to-end UI/API support. See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for the page wiring details, acceptance checks, and follow-on work.
