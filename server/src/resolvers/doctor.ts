import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';

// Types
import { MyContext } from '../types';

// Entities
import { Doctor } from '../entities/Doctor';
import { DoctorPatient } from '../entities/DoctorPatient';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';

// Middlewares
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { isAuthorized } from '../middlewares/isAuthorized';

// Utils
// import { FieldError } from '../utils/FieldError';
import { UserInputError } from 'apollo-server-express';
import { DoctorRecord } from '../entities/DoctorRecord';

@ObjectType()
class BasicRecordResponse {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field()
  category: string;

  @Field()
  description: string;

  @Field(() => Boolean)
  isAuthorized: Promise<boolean>;
}

@Resolver(Doctor)
export class DoctorResolver {
  /**
   * * Get all patients
   * @param context
   * @returns
   */
  @Query(() => [Patient])
  @UseMiddleware(isAuthenticated)
  async getPatients(@Ctx() { payload }: MyContext): Promise<Patient[]> {
    const dp = await DoctorPatient.find({
      where: { doctorId: payload!.userId },
      relations: ['patient'],
    });
    const patients: Patient[] = [];
    dp.forEach(async (_) => patients.push(await _.patient));
    return patients;
  }

  /**
   * * Add a Patient
   * @param patientId =>
   * @param context =>
   * @returns
   */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async addPatient(
    @Arg('patientEmail') patientEmail: string,
    @Ctx() { payload }: MyContext
  ) {
    const patient = await Patient.findOne({ email: patientEmail });
    if (!patient) {
      throw new UserInputError('No Patient found with given ID!');
    }

    const dpCnt = await DoctorPatient.count({
      doctorId: payload!.userId,
      patientId: patient.id,
    });
    if (dpCnt !== 0) {
      throw new UserInputError('Patient already exists!');
    }

    await DoctorPatient.create({
      doctorId: payload!.userId,
      patientId: patient.id,
    }).save();
    return true;
  }

  /**
   * * Remove a patient
   * @param patientId
   * @param context
   * @returns
   */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async removePatient(
    @Arg('patientId') patientId: string,
    @Ctx() { payload }: MyContext
  ) {
    await DoctorPatient.delete({
      doctorId: payload!.userId,
      patientId: patientId,
    });
    return true;
  }

  /**
   * * Get all basic record info for a particular patient
   * @param patientId
   * @returns
   */
  @Query(() => [BasicRecordResponse])
  @UseMiddleware(isAuthenticated)
  async getPatientRecords(
    @Arg('patientId') patientId: string,
    @Ctx() { payload }: MyContext
  ): Promise<BasicRecordResponse[]> {
    const records = await Record.find({
      where: { patient: await Patient.findOne({ id: patientId }) },
      select: ['id', 'title', 'category', 'description'],
    });

    const checkAccess = records.map(async (record) => {
      let isAuthorized = false;
      const drCnt = await DoctorRecord.count({
        doctorId: payload!.userId,
        recordId: record.id,
      });
      if (drCnt !== 0) {
        isAuthorized = true;
      }

      return isAuthorized;
    });

    const res: BasicRecordResponse[] = records.map((record, idx) => {
      return {
        id: record.id.toString(),
        category: record.category,
        description: record.description,
        title: record.title,
        isAuthorized: checkAccess[idx],
      };
    });

    return res;
  }

  /**
   * * Get detailed info about a particular record
   * @param recordId
   * @returns
   */
  @Query(() => Record)
  @UseMiddleware(isAuthenticated)
  @UseMiddleware(isAuthorized)
  async getPatientRecord(@Arg('recordId') recordId: number) {
    const record = await Record.findOne({ id: recordId });
    return record;
  }
}
