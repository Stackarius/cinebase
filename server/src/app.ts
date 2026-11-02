import express, { type Express } from  'express';
import cors  from 'cors';
import helmet from 'helmet';

const app: Express = express();

//GLOBAL MIDDLEWARE
app.use(cors());
app.use(helmet());
app.use(express.json());

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: "Cinebase server is running" })
});

export default app;