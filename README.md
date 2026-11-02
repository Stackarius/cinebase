# Cinebase 🎬

**Discover movies. Build your watchlist. Keep track of what you love.**

Cinebase is a full-stack movie discovery platform that allows users to explore movies, discover trending titles, search for films, manage personal watchlists, and rate movies.

The platform uses [The Movie Database (TMDB)](https://www.themoviedb.org/) API as its external movie data provider, while providing its own authentication system, user management, and personalized features.

> **Project Status:** In Development 🚧

## ✨ Features

### Authentication & User Management
- User registration and login.
- Secure password hashing.
- JWT-based authentication.
- Protected API endpoints.
- Refresh token management.
- User profile management.

### Movie Discovery
- Browse trending movies.
- Explore popular and top-rated movies.
- Search for movies.
- View detailed movie information.
- Explore movie genres.
- Discover movie casts and crew.

### Personalization
- Add movies to a personal watchlist.
- Remove movies from watchlists.
- Rate movies.
- Track watched movies.
- Manage personal movie collections.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript |
| Build Tool | Vite |
| Backend | Node.js + Express |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT + bcryptjs |
| Validation | Zod |
| External API | TMDB API |
| HTTP Client | Axios |

## 🏗️ Architecture

Cinebase follows a modular monolithic architecture with separate frontend and backend applications.

```text
                 ┌──────────────────┐
                 │   React Client   │
                 │   TypeScript     │
                 └────────┬─────────┘
                          │
                     HTTP / JSON
                          │
                 ┌────────▼─────────┐
                 │  Express Server  │
                 │   TypeScript     │
                 └────────┬─────────┘
                          │
             ┌────────────┴────────────┐
             │                         │
      ┌──────▼──────┐          ┌───────▼──────┐
      │ PostgreSQL  │          │  TMDB API    │
      │   Prisma    │          │ Movie Data   │
      └─────────────┘          └──────────────┘
```

The backend handles authentication, authorization, application logic, database operations, and communication with TMDB. The frontend communicates exclusively with the backend API.

## 📁 Project Structure

```text
cinebase/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── movies/
│   │   │   └── watchlist/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── prisma.config.ts
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js (LTS)
- npm
- PostgreSQL
- Git
- A TMDB account for API credentials

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd cinebase
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="postgresql://postgres:password@localhost:5432/cinebase?schema=public"

JWT_SECRET="your_access_token_secret"
JWT_REFRESH_SECRET="your_refresh_token_secret"

TMDB_ACCESS_TOKEN="your_tmdb_api_read_access_token"

CLIENT_URL="http://localhost:5173"
```

Replace the placeholder values with your actual credentials.

### 3. Set up the database

Create a PostgreSQL database named `cinebase`.

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma Client:

```bash
npx prisma generate
```

### 4. Start the backend

```bash
npm run dev
```

The backend should be available at:

`http://localhost:5000`

### 5. Set up the frontend

Open another terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The frontend should be available at:

`http://localhost:5173`

## 🔌 API Overview

Planned API endpoints:

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate a user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Revoke refresh token |
| GET | `/api/auth/me` | Get authenticated user |

### Movies

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/movies/trending` | Get trending movies |
| GET | `/api/movies/popular` | Get popular movies |
| GET | `/api/movies/top-rated` | Get top-rated movies |
| GET | `/api/movies/search` | Search movies |
| GET | `/api/movies/:id` | Get movie details |
| GET | `/api/movies/:id/cast` | Get movie cast |

### Watchlist

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/watchlist` | Get personal watchlist |
| POST | `/api/watchlist` | Add a movie |
| DELETE | `/api/watchlist/:id` | Remove a movie |

### Ratings

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/ratings` | Get personal ratings |
| POST | `/api/ratings` | Rate a movie |
| PATCH | `/api/ratings/:id` | Update a rating |
| DELETE | `/api/ratings/:id` | Delete a rating |

*These endpoints describe the planned API contract and may change during development.*

## 🔐 Security Considerations

- Passwords are hashed before storage.
- Protected endpoints require authentication.
- Authorization is enforced on user-specific resources.
- Sensitive credentials are stored in environment variables.
- Request payloads are validated before processing.
- Rate limiting is applied to sensitive endpoints.
- TMDB credentials are never exposed to the frontend.

## 🎯 Project Objectives

Cinebase is also a backend engineering learning project focused on:

- Building RESTful APIs.
- Understanding authentication and authorization.
- Designing relational database schemas.
- Working with Prisma ORM.
- Integrating third-party APIs.
- Implementing middleware and centralized error handling.
- Handling asynchronous operations and external API failures.
- Writing maintainable, modular backend code.
- Testing and documenting APIs.

## 🎬 TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Movie metadata and images are provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

## 📌 License

This project is currently developed for educational and portfolio purposes.

A formal license will be added when the project is ready for release.
