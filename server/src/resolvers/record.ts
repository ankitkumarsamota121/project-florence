import { Patient } from '../entities/Patient';
import { isAuth } from '../middleware/isAuth';
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
import { FieldError } from './FieldError';

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
  errors?: FieldError[];
}

@Resolver(Record)
export class RecordResolver {
  @Query(() => [Record])
  @UseMiddleware(isAuth)
  async records(@Ctx() { payload }: MyContext): Promise<Record[]> {
    // @Arg('cursor', () => String, { nullable: true }) cursor: string | null // @Arg('limit', () => Int) limit: number,
    // const recordRepo = getConnection().getRepository(Record);
    const records = await Record.find({ where: { patient: payload!.userId } });
    return records;
  }

  @Query(() => Record, { nullable: true })
  @UseMiddleware(isAuth)
  async record(
    @Arg('id', () => Int) id: number,
    @Ctx() { payload }: MyContext
  ): Promise<RecordResponse> {
    const record = await Record.findOne({
      id: id,
      patient: await Patient.findOne({ where: { id: payload!.userId } }),
    });
    if (!record) {
      return {
        errors: [
          {
            field: 'record id',
            message: 'No Record found with given ID.',
          },
        ],
      };
    }

    return { record };
  }

  @Mutation(() => RecordResponse)
  @UseMiddleware(isAuth)
  async createRecord(
    @Arg('input') input: RecordInput,
    @Ctx() { payload }: MyContext
  ): Promise<RecordResponse> {
    const record = await Record.create(input);
    const user = await Patient.findOne({ where: { id: payload!.userId } });
    if (!user) {
      return {
        errors: [
          {
            field: 'user',
            message: 'User not found!',
          },
        ],
      };
    }

    record.patient = user;
    await Record.save(record);

    return {
      record,
    };
  }

  @Mutation(() => Record, { nullable: true })
  @UseMiddleware(isAuth)
  async updateRecord(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title?: string,
    @Arg('category', () => String, { nullable: true }) category?: string,
    @Arg('description', () => String, { nullable: true }) description?: string
    // @Ctx() { payload }: MyContext
  ): Promise<Record | null> {
    const record = await Record.findOne(id);
    if (!record) return null;
    if (title) record.title = title;
    if (category) record.category = category;
    if (description) record.description = description;
    await Record.save(record);
    return record;
  }

  @Mutation(() => Boolean)
  // @UseMiddleware(isAuth)
  async deleteRecord(
    @Arg('id', () => Int) id: number
    // @Ctx() { req }: MyContext
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

    await Record.delete({ id });
    return true;
  }
}
