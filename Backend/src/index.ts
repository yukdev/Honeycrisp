import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import { NotFoundError } from './expressErrors';

dotenv.config();

export const app = express();

app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  throw new NotFoundError();
});
