import { Patient } from '../entities/Patient';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
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
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

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
      patient: Patient.findOne({ where: { id: payload!.userId } }),
    });
    if (!record) {
      throw new UserInputError('Not record found with given ID!');
    }

    return record;
  }

  // @Mutation(() => Record)
  // @UseMiddleware(isAuthenticated)
  // async createPatientRecord(
  //   @Arg('input') input: RecordInput,
  //   @Arg('file', () => GraphQLUpload)
  //   { createReadStream, filename }: FileUpload,
  //   @Ctx() { payload }: MyContext
  // ): Promise<Record> {
  //   const patient = await Patient.findOne({
  //     where: { id: payload!.userId },
  //   });
  //   if (!patient) {
  //     throw new UserInputError('No patient found with given ID!');
  //   }

  //   const a = filename.split('.');
  //   const idx = a.length - 1;
  //   const ext = a[idx];
  //   const uuidFilename = uuidv4() + ext;
  //   return new Promise(async (resolve, reject) =>
  //     createReadStream()
  //       .pipe(createWriteStream(__dirname + `/../../files/${uuidFilename}`))
  //       .on('finish', async () => {
  //         const fileUrl = `http://localhost:4000/files/${uuidFilename}`;
  //         const record = await Record.create(input);

  //         record.patient = patient;
  //         record.attachment = fileUrl;
  //         await Record.save(record);
  //         resolve(record);
  //       })
  //       .on('error', () =>
  //         reject(new ApolloError('Some error occured! Please try again later.'))
  //       )
  //   );
  // }

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
      patient: Patient.findOne({ where: { id: payload!.userId } }),
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
      patient: Patient.findOne({ where: { id: payload!.userId } }),
    });
    return true;
  }

  @Mutation(() => String)
  async singleUpload(
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    const a = filename.split('.');
    const idx = a.length - 1;
    const ext = a[idx];
    const newFileName = uuidv4() + '.' + ext;
    const filePath = __dirname + `/../../uploads/${newFileName}`;

    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', () => resolve(newFileName))
        .on('error', () => reject(''))
    );
  }

  @Mutation(() => Boolean)
  async deleteFile(@Arg('filename') filename: string) {
    const filePath = __dirname + `/../../uploads/${filename}`;
    try {
      fs.unlinkSync(filePath);
      return true;
    } catch (err) {
      return false;
    }
  }

  @Mutation(() => Record)
  @UseMiddleware(isAuthenticated)
  async createPatientRecord(
    @Arg('input') input: RecordInput,
    @Ctx() { payload }: MyContext
  ): Promise<Record> {
    const patient = await Patient.findOne({
      where: { id: payload!.userId },
    });
    if (!patient) {
      throw new UserInputError('No patient found with given ID!');
    }

    const record = await Record.create(input);

    record.patient = Promise.resolve(patient);
    await Record.save(record);

    return record;
  }
}
