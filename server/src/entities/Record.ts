import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Patient } from './Patient';

@ObjectType()
@Entity()
export class Record extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field()
  @Column({ length: 40 })
  title: string;
  // doctor: string;

  @Field()
  @Column()
  category: string;
  // attachment: string;

  @Field()
  @Column()
  description: string;

  @ManyToOne(() => Patient, (patient) => patient.records)
  patient: Patient;
}
