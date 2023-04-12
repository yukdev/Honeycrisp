import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { NotFoundError } from './expressErrors';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('This is the backend for the Honeycrisp App!');
});

app.use(function (req, res, next) {
  throw new NotFoundError();
});

export default app;
