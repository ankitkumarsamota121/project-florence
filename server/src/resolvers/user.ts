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
  @Field()
  experience: number;

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

  @Query(() => String)
  @UseMiddleware(isAuthenticated)
  async me(@Ctx() { payload }: MyContext) {
    return `Your user id : ${payload!.userId}`;
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
