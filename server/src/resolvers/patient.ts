import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';

// Types
import { MyContext } from '../types';

// Entities
import { Doctor } from '../entities/Doctor';
import { DoctorRecord } from '../entities/DoctorRecord';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';

// Middlewares
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Utils
import { UserInputError } from 'apollo-server-express';
import { ConsentRequest } from '../entities/ConsentRequest';

@Resolver(Patient)
export class PatientResolver {
  @Query(() => [ConsentRequest])
  @UseMiddleware(isAuthenticated)
  async getConsentRequests(@Ctx() { payload }: MyContext) {
    const crs = await ConsentRequest.find({
      relations: ['doctor', 'record'],
      where: {
        patient: Patient.findOne(payload!.userId),
      },
    });
    return crs;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async grantAccess(
    @Arg('doctorId') doctorId: string,
    @Arg('recordId') recordId: number,
    @Ctx() { payload }: MyContext
  ) {
    const recordCnt = await Record.count({
      where: {
        id: recordId,
        patient: Patient.find({ id: payload!.userId }),
      },
    });
    if (recordCnt === 0) {
      throw new UserInputError('No record found with the given ID!');
    }

    const doctorCnt = await Doctor.count({ id: doctorId });
    if (doctorCnt === 0) {
      throw new UserInputError('No doctor found with the given ID!');
    }

    await DoctorRecord.create({ doctorId, recordId }).save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async revokeAccess(
    @Arg('doctorId') doctorId: string,
    @Arg('recordId') recordId: number,
    @Ctx() { payload }: MyContext
  ) {
    const recordCnt = await Record.count({
      where: {
        id: recordId,
        patient: Patient.find({ where: { id: payload!.userId } }),
      },
    });
    if (recordCnt === 0) {
      throw new UserInputError('No record found with the given ID!');
    }

    const doctorCnt = await Doctor.count({ id: doctorId });
    if (doctorCnt === 0) {
      throw new UserInputError('No doctor found with the given ID!');
    }

    await DoctorRecord.delete({ doctorId, recordId });
    return true;
  }
}
