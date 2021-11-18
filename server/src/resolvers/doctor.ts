import { Doctor } from '../entities/Doctor';
import {
  Arg,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { MyContext } from '../types';
import { isAuthenticated } from '../middleware/isAuthenticated';
import { Patient } from '../entities/Patient';
import { FieldError } from './FieldError';
import { Record } from '../entities/Record';
import { isAuthorized } from '../middleware/isAuthorized';
import { DoctorPatient } from '../entities/DoctorPatient';

@ObjectType()
class DoctorResponse {
  @Field(() => Boolean, { nullable: true })
  status?: boolean;

  @Field(() => [FieldError], { nullable: true })
  error?: FieldError;
}

@Resolver(Doctor)
export class DoctorResolver {
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

  @Mutation(() => DoctorResponse)
  @UseMiddleware(isAuthenticated)
  async addPatient(
    @Arg('patientId', () => Int) patientId: number,
    @Ctx() { payload }: MyContext
  ) {
    /**
     * TODO1: Find a more efficient and clever way to check for the availability
     * TODO2: Add a duplicate key check.
     */
    const doctor = await Doctor.findOne({
      where: { id: payload!.userId },
    });
    if (!doctor) {
      return {
        status: false,
        error: new FieldError('doctor', 'No doctor found with given ID.'),
      };
    }

    const patient = await Patient.findOne({ id: patientId });
    if (!patient) {
      return {
        status: false,
        error: new FieldError('patient', 'No patient found with given ID.'),
      };
    }

    await DoctorPatient.create({
      doctorId: doctor.id,
      patientId: patientId,
    }).save();
    return {
      status: true,
    };
  }

  @Mutation(() => DoctorResponse)
  @UseMiddleware(isAuthenticated)
  async removePatient(
    @Arg('patientId', () => Int) patientId: number,
    @Ctx() { payload }: MyContext
  ) {
    await DoctorPatient.delete({
      doctorId: payload!.userId,
      patientId: patientId,
    });
    return {
      status: true,
    };
  }

  /**
   * TODO: getPatientRecords and getRecord
   */
  @Query(() => [Record])
  @UseMiddleware(isAuthenticated)
  async getPatientRecords(
    @Arg('patientId', () => Int) patientId: number
  ): Promise<Record[]> {
    const records = await Record.find({
      where: { patient: await Patient.findOne({ id: patientId }) },
      select: ['id', 'title', 'category', 'description'],
    });
    return records;
  }

  @Query(() => Record)
  @UseMiddleware(isAuthenticated)
  @UseMiddleware(isAuthorized)
  async getPatientRecord(@Arg('recordId') recordId: number) {
    const record = await Record.findOne({ id: recordId });
    return record;
  }
}
