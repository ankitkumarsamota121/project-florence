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
import { Attachment } from '../entities/Attachment';
import { FieldError } from '../utils/FieldError';
import { UserInputError } from 'apollo-server-express';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { DOCTOR } from '../constants/userType';
import { DoctorPatient } from '../entities/DoctorPatient';

@InputType()
class RecordInput {
  @Field()
  title: string;

  @Field()
  category: string;

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
  async getRecords(@Ctx() { payload }: MyContext): Promise<Record[]> {
    // @Arg('cursor', () => String, { nullable: true }) cursor: string | null // @Arg('limit', () => Int) limit: number,
    // const recordRepo = getConnection().getRepository(Record);
    const records = await Record.find({ where: { patient: payload!.userId } });
    return records;
  }

  @Query(() => Record, { nullable: true })
  @UseMiddleware(isAuthenticated)
  async getRecord(
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

  @Mutation(() => Record)
  @UseMiddleware(isAuthenticated)
  async createRecord(
    @Arg('input') input: RecordInput,
    @Arg('attachmentId', () => Int) attachmentId: number,
    @Arg('userType') userType: string,
    @Ctx() { payload }: MyContext,
    @Arg('patientId', () => String, { nullable: true }) patientId?: string
  ): Promise<Record> {
    let patient;
    if (userType === DOCTOR) {
      console.log('HIT HIT HIT HIT!!!');
      const dpCnt = await DoctorPatient.count({
        doctorId: payload!.userId,
        patientId,
      });
      patient = await Patient.findOne(patientId);

      if (dpCnt === 0 || !patient) {
        throw new UserInputError('No patient found with given ID!');
      }
    } else {
      patient = await Patient.findOne(payload!.userId);
      if (!patient) {
        throw new UserInputError('No patient found with given ID!');
      }
    }

    const attachment = await Attachment.findOne(attachmentId);
    if (!attachment) {
      throw new UserInputError('No attachment found with given ID!');
    }

    const record = await Record.create(input);

    record.patient = Promise.resolve(patient);
    await Record.save(record);

    attachment.record = Promise.resolve(record);
    return record;
  }

  @Mutation(() => Int)
  async uploadFile(
    @Arg('file', () => GraphQLUpload)
    { createReadStream, filename }: FileUpload
  ) {
    const a = filename.split('.');
    const idx = a.length - 1;
    const ext = a[idx];
    const newFileName = uuidv4() + '.' + ext;
    const filePath = __dirname + `/../../uploads/${newFileName}`;
    const url = `http://localhost:4000/uploads/${newFileName}`;

    return new Promise(async (resolve, reject) =>
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          const attachment = await Attachment.create({ url });
          await Attachment.save(attachment);
          return resolve(attachment.id);
        })
        .on('error', () => reject(-1))
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
}
