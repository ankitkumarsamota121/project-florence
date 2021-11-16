import { Doctor } from '../entities/Doctor';
import { Record } from '../entities/Record';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';

export const isAuthorized: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  if (!context.payload!.userId || !args.recordId) next();

  const record = await Record.findOne({
    relations: ['doctors'],
    where: { id: args.recordId },
  });
  if (!record) throw new Error('Record not found!');

  const doctor = await Doctor.findOne({
    where: { id: context.payload!.userId },
  });
  if (!doctor) throw new Error('No doctor found with given ID!');

  const idx = record.doctors.indexOf(doctor);
  if (idx == -1) throw new Error('Not authorized to access the given record!');

  return next();
};
