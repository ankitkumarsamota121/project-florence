import { DoctorRecord } from '../entities/DoctorRecord';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';
import { ForbiddenError } from 'apollo-server-express';

export const isAuthorized: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  if (!context.payload!.userId || !args.recordId) return next();

  const dr = await DoctorRecord.count({
    doctorId: context.payload!.userId,
    recordId: args.recordId,
  });

  if (dr === 0) {
    throw new ForbiddenError('You are not authorized to access this record!');
  }

  return next();
};
