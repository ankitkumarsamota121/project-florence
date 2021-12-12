import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from 'type-graphql';

// Types
import { MyContext } from '../types';

// Entities
import { Doctor } from '../entities/Doctor';
import { Patient } from '../entities/Patient';
import { Record } from '../entities/Record';

// Middlewares
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Utils
import { UserInputError } from 'apollo-server-express';
import { ConsentRequest } from '../entities/ConsentRequest';
import { DoctorPatient } from '../entities/DoctorPatient';

@Resolver(ConsentRequest)
export class ConsentRequestResolver {
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async createConsentRequest(
    @Arg('patientId') patientId: string,
    @Arg('recordId') recordId: number,
    @Arg('content') content: string,
    @Ctx() { payload }: MyContext
  ) {
    const record = await Record.findOne({
      where: {
        id: recordId,
        patient: Patient.find({ id: patientId }),
      },
    });
    if (!record) {
      throw new UserInputError('No record found with the given ID!');
    }

    const dp = await DoctorPatient.findOne({
      doctorId: payload!.userId,
      patientId,
    });
    if (!dp) {
      throw new UserInputError('No patient found with the given ID!');
    }

    const patient = await Patient.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new UserInputError('No patient found with the given ID!');
    }

    const doctor = await Doctor.findOne({ id: payload!.userId });
    if (!doctor) {
      throw new UserInputError('No doctor found with given ID!');
    }

    const cr = await ConsentRequest.create({ content });
    cr.patient = Promise.resolve(patient);
    cr.record = Promise.resolve(record);
    cr.doctor = Promise.resolve(doctor);

    await cr.save();
    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteConsentRequest(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: MyContext
  ) {
    await ConsentRequest.delete({
      id,
      patient: Patient.findOne(payload!.userId),
    });
    return true;
  }
}
