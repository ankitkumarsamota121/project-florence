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
import { isAuthenticated } from '../middleware/isAuthenticated';
import { MyContext } from '../types';
import { Patient } from '../entities/Patient';
import { Doctor } from '../entities/Doctor';
import { FieldError } from './FieldError';
@ObjectType()
class UserResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
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
  experience: string;

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
      console.log(err);
      return {
        errors: [
          {
            field: 'register',
            message: 'Unable to register user. Try Again!',
          },
        ],
      };
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
      console.log(err);
      return {
        errors: [
          {
            field: 'register',
            message: 'Unable to register user. Try Again!',
          },
        ],
      };
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
      return {
        errors: [
          {
            field: 'email',
            message: 'No user found. Try again!',
          },
        ],
      };
    }

    const verify = argon2.verify(user.password, password);

    if (!verify) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Incorrect Password. Try Again!',
          },
        ],
      };
    }

    return {
      accessToken: sign({ userId: user.id }, 'MySecretKey', {
        expiresIn: '15d',
      }),
    };
  }
}
