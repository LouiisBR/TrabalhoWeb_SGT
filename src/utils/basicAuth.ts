// basicAuth.ts
import { Request, Response, NextFunction } from 'express';
const basicAuth = require('basic-auth');
import * as dotenv from 'dotenv';

dotenv.config();

export const authBasic = (req: Request, res: Response, next: NextFunction) => {
  const credentials = basicAuth(req);

  const username = process.env.USER as string;
  const password = process.env.PASS as string;

  if (!credentials || credentials.name !== username || credentials.pass !== password) {
    res.set('WWW-Authenticate', 'Basic ');
    return res.status(401).send('Authentication required.');
  }

  next();
};
