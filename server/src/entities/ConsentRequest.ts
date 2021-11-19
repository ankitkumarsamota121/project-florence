import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from './Doctor';
import { Patient } from './Patient';
import { Record } from './Record';

@ObjectType()
@Entity()
export class ConsentRequest extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column()
  content: string;

  @Field(() => Patient)
  @ManyToOne(() => Patient, (patient) => patient.requests)
  patient: Promise<Patient>;

  @Field(() => Doctor)
  @ManyToOne(() => Doctor, (doctor) => doctor.requests)
  doctor: Promise<Doctor>;

  @Field(() => Record)
  @ManyToOne(() => Record, (record) => record.requests)
  record: Promise<Record>;
}
