import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { reportsRouter } from './routes/reports';
import { usersRouter } from './routes/users';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({ ok: true, service: 'watersafe-hub', timestamp: new Date().toISOString() });
});

app.use('/api/reports', reportsRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;
app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
