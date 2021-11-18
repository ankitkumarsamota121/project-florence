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
    where: { id: args.recordId },
    join: {
      alias: 'record',
      innerJoinAndSelect: {
        doctorId: 'record.doctors',
      },
    },
  });
  if (!record) throw new Error('Record not found!');

  const doctor = await Doctor.findOne({
    where: { id: context.payload!.userId },
  });
  if (!doctor) throw new Error('No doctor found with given ID!');

  // console.log('Records => ', docs);
  record.doctors.forEach((d) => {
    console.log(d.id);
  });
  // console.log(doctor);
  // const idx = record.doctors.indexOf(doctor);
  const idx = -1;
  if (idx == -1) throw new Error('Not authorized to access the given record!');

  return next();
};
