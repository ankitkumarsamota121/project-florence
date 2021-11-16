import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../types';

//format like bearer 21321n2bmbbj

export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new Error('Not authenticated!');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, 'MySecretKey');
    context.payload = payload as any;
  } catch (err) {
    throw new Error('Not authenticated!');
  }
  return next();
};
