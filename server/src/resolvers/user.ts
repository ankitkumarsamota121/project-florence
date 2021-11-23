import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  UseMiddleware,
  Ctx,
  InputType,
  createUnionType,
} from 'type-graphql';
import argon2 from 'argon2';
import { sign } from 'jsonwebtoken';
import { ApolloError, UserInputError } from 'apollo-server-express';

// Types
import { MyContext } from '../types';

// Middlewares
import { isAuthenticated } from '../middlewares/isAuthenticated';

// Entities
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';

@ObjectType()
class UserResponse {
  @Field(() => String)
  accessToken: string;
}

const UserUnion = createUnionType({
  name: 'User', // the name of the GraphQL union
  types: () => [Patient, Doctor] as const, // function that returns tuple of object types classes
});
@ObjectType()
class MeResponse {
  @Field(() => UserUnion)
  user: Patient | Doctor;

  @Field()
  userType: string;
}



@InputType()
abstract class UserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class PatientInput extends UserInput {
  @Field()
  gender: string;

  @Field()
  blood_group: string;
}

@InputType()
class DoctorInput extends UserInput {
  // @Field()
  // experience: number;

  @Field()
  specialities: string;

  @Field()
  designation: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [Patient])
  async patients() {
    return await Patient.find();
  }

  @Query(() => [Doctor])
  async doctors() {
    return await Doctor.find();
  }

  @Query(() => MeResponse)
  @UseMiddleware(isAuthenticated)
  async me(@Ctx() { payload }: MyContext) {
    const patient = await Patient.findOne(payload!.userId);
    if (patient) {
      return { user: patient, userType: 'patient' };
    }

    const doctor = await Doctor.findOne(payload!.userId);
    return { user: doctor, userType: 'doctor' };
  }

  @Mutation(() => UserResponse)
  async patientRegister(
    @Arg('input', () => PatientInput) input: PatientInput
  ): Promise<UserResponse> {
    /**
     * TODO: Add checks to verify that the email and password are valid.
     */
    const hashedPassword = await argon2.hash(input.password);
    try {
      const user = Patient.create({
        ...input,
        password: hashedPassword,
      });
      await Patient.save(user);

      return {
        accessToken: sign({ userId: user.id }, 'MySecretKey', {
          expiresIn: '15d',
        }),
      };
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => UserResponse)
  async doctorRegister(
    @Arg('input', () => DoctorInput) input: DoctorInput
  ): Promise<UserResponse> {
    /**
     * TODO: Add checks to verify that the email and password are valid.
     */
    const hashedPassword = await argon2.hash(input.password);
    try {
      const user = Doctor.create({
        ...input,
        password: hashedPassword,
      });
      await Doctor.save(user);

      return {
        accessToken: sign({ userId: user.id }, 'MySecretKey', {
          expiresIn: '15d',
        }),
      };
    } catch (err) {
      throw new ApolloError(err);
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Arg('userType') userType: string
  ): Promise<UserResponse> {
    let user;
    if (userType === 'patient') {
      user = await Patient.findOne({ where: { email } });
    } else {
      user = await Doctor.findOne({ where: { email } });
    }

    if (!user) {
      throw new UserInputError('Incorrect Email/Password!');
    }

    const verify = argon2.verify(user.password, password);

    if (!verify) {
      throw new UserInputError('Incorrect Email/Password!');
    }

    return {
      accessToken: sign({ userId: user.id }, 'MySecretKey', {
        expiresIn: '15d',
      }),
    };
  }

  /**
   * TODO: Add resolvers to update or delete user.
   */
}
