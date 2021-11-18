import { Patient } from '../entities/Patient';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  // FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Record } from '../entities/Record';
import { FieldError } from '../utils/FieldError';
import { UserInputError } from 'apollo-server-express';

@InputType()
class RecordInput {
  @Field()
  title: string;
  // doctor: string;

  @Field()
  category: string;
  // attachment: string;

  @Field()
  description: string;
}

@ObjectType()
class RecordResponse {
  @Field(() => Record, { nullable: true })
  record?: Record;

  @Field(() => [FieldError], { nullable: true })
  error?: FieldError;
}

@Resolver(Record)
export class RecordResolver {
  @Query(() => [Record])
  @UseMiddleware(isAuthenticated)
  async records(@Ctx() { payload }: MyContext): Promise<Record[]> {
    // @Arg('cursor', () => String, { nullable: true }) cursor: string | null // @Arg('limit', () => Int) limit: number,
    // const recordRepo = getConnection().getRepository(Record);
    const records = await Record.find({ where: { patient: payload!.userId } });
    return records;
  }

  @Query(() => Record, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async record(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: MyContext
  ): Promise<Record> {
    const record = await Record.findOne({
      id: id,
      patient: await Patient.findOne({ where: { id: payload!.userId } }),
    });
    if (!record) {
      throw new UserInputError('Not record found with given ID!');
    }

    return record;
  }

  @Mutation(() => RecordResponse)
  @UseMiddleware(isAuthenticated)
  async createPatientRecord(
    @Arg('input') input: RecordInput,
    @Ctx() { payload }: MyContext
  ): Promise<RecordResponse> {
    const record = await Record.create(input);
    const patient = await Patient.findOne({ where: { id: payload!.userId } });
    if (!patient) {
      return {
        error: new FieldError('user', 'User not found!'),
      };
    }

    record.patient = patient;
    await Record.save(record);

    return {
      record,
    };
  }

  /**
   * TODO: Create a Mutation for the doctor to add records
   */

  @Mutation(() => Record, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async updateRecord(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: MyContext,
    @Arg('title', () => String, { nullable: true }) title?: string,
    @Arg('category', () => String, { nullable: true }) category?: string,
    @Arg('description', () => String, { nullable: true }) description?: string
  ): Promise<RecordResponse> {
    const record = await Record.findOne({
      id: id,
      patient: await Patient.findOne({ where: { id: payload!.userId } }),
    });

    if (!record)
      return {
        error: new FieldError('record', 'No record found with the given id.'),
      };

    if (title) record.title = title;
    if (category) record.category = category;
    if (description) record.description = description;

    await Record.save(record);
    return { record };
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async deleteRecord(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: MyContext
  ): Promise<boolean> {
    // not cascade way
    // const post = await Post.findOne(id);
    // if (!post) {
    //   return false;
    // }
    // if (post.creatorId !== req.session.userId) {
    //   throw new Error("not authorized");
    // }

    // await Updoot.delete({ postId: id });
    // await Post.delete({ id });

    await Record.delete({
      id,
      patient: await Patient.findOne({ where: { id: payload!.userId } }),
    });
    return true;
  }
}
