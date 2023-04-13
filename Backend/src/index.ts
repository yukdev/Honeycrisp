import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { NotFoundError } from './expressErrors';
import userRoutes from './routes/userRoutes';
import sessionRoutes from './routes/sessionRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);
app.use('/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.send('This is the backend for the Honeycrisp App!');
});

app.use(function (req, res, next) {
  throw new NotFoundError();
});

// generic error handling
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV !== 'test') console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

export default app;
