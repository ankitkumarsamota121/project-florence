import { MiddlewareFn } from 'type-graphql';
import { verify } from 'jsonwebtoken';
import { MyContext } from '../types';
import { AuthenticationError } from 'apollo-server-express';

export const isAuthenticated: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) {
    throw new AuthenticationError('You must be logged in!');
  }

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, 'MySecretKey');
    context.payload = payload as any;
  } catch (_) {
    throw new AuthenticationError('You must be logged in!');
  }
  return next();
};
