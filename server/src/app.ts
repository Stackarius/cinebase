import express, { type Express } from  'express';
import cors  from 'cors';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.routes'
import movieRoutes from './modules/movies/movie.routes'
import usersRoutes from './modules/users/users.routes'
import cookieParser from 'cookie-parser';
import { env } from './config';

const app: Express = express();

//GLOBAL MIDDLEWARE
app.use(cors({
  origin: env.CLIENT_URL.replace(/\/+$/, ""),
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser())

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/users", usersRoutes)

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Cinebase server is running" })
});

export default app;