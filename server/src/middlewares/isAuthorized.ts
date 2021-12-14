import { DoctorRecord } from '../entities/DoctorRecord';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from '../types';
import { ForbiddenError } from 'apollo-server-express';
import { PATIENT } from '../constants/userType';
import { Record } from '../entities/Record';
import { Patient } from '../entities/Patient';

export const isAuthorized: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  if (!context.payload!.userId || !args.recordId) return next();
  let cnt = 0;
  if (context.payload!.userType === PATIENT) {
    cnt = await Record.count({
      where: {
        id: args.recordId,
        patient: await Patient.findOne(context.payload!.userId),
      },
    });
  } else {
    cnt = await DoctorRecord.count({
      doctorId: context.payload!.userId,
      recordId: args.recordId,
    });
  }

  if (cnt === 0) {
    throw new ForbiddenError('You are not authorized to access this record!');
  }

  return next();
};
