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

@ObjectType()
class BasicRecordResponse {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  category: string;

  @Field()
  description: string;
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
    @Arg('patientId') patientId: string,
    @Ctx() { payload }: MyContext
  ) {
    const dpCnt = await DoctorPatient.count({
      doctorId: payload!.userId,
      patientId,
    });
    if (dpCnt !== 0) {
      throw new UserInputError('Patient already exists!');
    }

    const doctorCnt = await Doctor.count({ id: payload!.userId });
    if (doctorCnt === 0) {
      throw new UserInputError('No doctor found with given ID!');
    }

    const patientCnt = await Patient.count({ id: patientId });
    if (patientCnt === 0) {
      throw new UserInputError('No Patient found with given ID!');
    }

    await DoctorPatient.create({
      doctorId: payload!.userId,
      patientId,
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
    @Arg('patientId') patientId: string
  ): Promise<BasicRecordResponse[]> {
    const records = await Record.find({
      where: { patient: await Patient.findOne({ id: patientId }) },
      select: ['id', 'title', 'category', 'description'],
    });
    return records;
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
