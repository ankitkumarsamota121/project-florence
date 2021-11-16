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
// import { FieldError } from './FieldError';

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
  async patients(@Ctx() { payload }: MyContext): Promise<Patient[]> {
    const doctor = await Doctor.findOne({
      relations: ['patients'],
      where: { id: payload!.userId },
    });
    if (!doctor) return [];
    return doctor?.patients;
  }

  @Mutation(() => DoctorResponse)
  @UseMiddleware(isAuthenticated)
  async addPatient(
    @Arg('patientId', () => Int) patientId: number,
    @Ctx() { payload }: MyContext
  ) {
    const doctor = await Doctor.findOne({
      relations: ['patients'],
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

    doctor.patients = [...doctor.patients, patient];
    await Doctor.save(doctor);
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
    const doctor = await Doctor.findOne({
      relations: ['patients'],
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

    doctor.patients = doctor.patients.filter((p) => p.id !== patientId);
    await Doctor.save(doctor);
    return {
      status: true,
    };
  }

  /**
   * TODO: getPatientRecords and getRecord
   */
  // getPatientRecords -> (patientId) => {Basic Record Info of all Records, IsAccessible or Not}
  // getRecord -> (recordId) => {Complete Record Info}
}
