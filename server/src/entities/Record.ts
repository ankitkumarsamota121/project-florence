import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './Patient';
import { DoctorRecord } from './DoctorRecord';
import { ConsentRequest } from './ConsentRequest';
import { Attachment } from './Attachment';

@ObjectType()
@Entity()
export class Record extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  category: string;

  // @Field(() => String, { nullable: true })
  // @Column({ nullable: true })
  // @UseMiddleware(isAuthorized)
  // attachment: string;

  @Field()
  @Column()
  description: string;

  @OneToMany(() => Attachment, (attachment) => attachment.record)
  attachments: Promise<Attachment[]>;

  @ManyToOne(() => Patient, (patient) => patient.records)
  patient: Promise<Patient>;

  @OneToMany(() => DoctorRecord, (dp) => dp.record)
  doctorConnection: Promise<DoctorRecord[]>;

  @OneToMany(() => ConsentRequest, (cr) => cr.record)
  requests: Promise<ConsentRequest[]>;
}
