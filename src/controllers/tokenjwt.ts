import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { handled_response } from '../utils/function';

dotenv.config();

const prisma = new PrismaClient();

export const createToken = async (req: Request, res: Response) => {
  const { email, password } = req.body as User;

  if (!email || !password) {
    return handled_response(res, 400, { msg: 'Email and password não encontrados' });
  }

  const user = await prisma.user.findFirst({
    where: {
      email: email,
      password: password
    }
  });

  if (!user) {
    return handled_response(res, 401, { msg: 'Invalid email or password' });
  }
  const secret = process.env.JWT_SECRET || 'luis';
  const token = jwt.sign({ user_acess: user.id }, secret, { expiresIn: 3600 });

  return handled_response(res, 200, { token_aceess: token, type: 'Bearer', expires_in: 3600});
}

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return handled_response(res, 401, { msg: 'Token não encontrado' });
  }

  jwt.verify;
  try {
    const secret = process.env.JWT_SECRET || 'luis';
    const decoded: string | jwt.JwtPayload = await jwt.verify(token, secret);
    if (typeof decoded === 'object' && Object(decoded).hasOwnProperty('user_acess')){
      if (req.method === 'POST' || req.method === 'PUT')
        req.body.userId = decoded.user_acess
      else
        req.query.userId = decoded.user_acess;
      return next()
    }
    return handled_response(res, 401, { msg: 'Token Inválido' });
  } catch (e) {
    return handled_response(res, 401, { msg: 'Token Inválido' });
  }
}