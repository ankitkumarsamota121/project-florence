import { DoctorRecord } from '../entities/DoctorRecord';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

export const isAuthorized: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  if (!context.payload!.userId || !args.recordId) return next();

  const dr = await DoctorRecord.findOne({
    doctorId: context.payload!.userId,
    recordId: args.recordId,
  });

  if (!dr) throw new Error('Not authorized to access the record!');

  return next();
};
