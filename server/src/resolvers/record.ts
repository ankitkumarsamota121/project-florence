import {
  Arg,
  // Ctx,
  Field,
  // FieldResolver,
  InputType,
  Int,
  Mutation,
  // ObjectType,
  Query,
  Resolver,
  // Root,
  // UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
// import { getConnection, getRepository } from 'typeorm';
import { Record } from '../entities/Record';
// import { MyContext } from '../types';

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

@Resolver(Record)
export class RecordResolver {
  @Query(() => [Record])
  async records(): Promise<Record[]> {
    // @Arg('cursor', () => String, { nullable: true }) cursor: string | null // @Arg('limit', () => Int) limit: number,
    const recordRepo = getConnection().getRepository(Record);
    const records = await recordRepo.find();
    return records;
  }

  @Query(() => Record, { nullable: true })
  record(@Arg('id', () => Int) id: number): Promise<Record | undefined> {
    const recordRepo = getConnection().getRepository(Record);
    return recordRepo.findOne(id);
  }

  @Mutation(() => Record)
  // @UseMiddleware(isAuth)
  async createRecord(
    @Arg('input') input: RecordInput
    // @Ctx() { req }: MyContext
  ): Promise<Record> {
    const recordRepo = await getConnection().getRepository(Record);
    const record = new Record();
    record.title = input.title;
    record.category = input.category;
    record.description = input.description;
    await recordRepo.save(record);

    return record;
  }

  @Mutation(() => Record, { nullable: true })
  // @UseMiddleware(isAuth)
  async updateRecord(
    @Arg('id', () => Int) id: number,
    @Arg('title', () => String, { nullable: true }) title?: string,
    @Arg('category', () => String, { nullable: true }) category?: string,
    @Arg('description', () => String, { nullable: true }) description?: string
    // @Ctx() { req }: MyContext
  ): Promise<Record | null> {
    const recordRepo = getConnection().getRepository(Record);
    const record = await recordRepo.findOne(id);
    if (!record) return null;
    if (title) record.title = title;
    if (category) record.category = category;
    if (description) record.description = description;
    await recordRepo.save(record);
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
    const recordRepo = getConnection().getRepository(Record);

    await recordRepo.delete({ id });
    return true;
  }
}
