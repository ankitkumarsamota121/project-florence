import { isAuthorized } from '../middleware/isAuthorized';
import { Field, ID, ObjectType, UseMiddleware } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from './Doctor';
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

  @Field()
  @Column()
  category: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @UseMiddleware(isAuthorized)
  attachment: string;

  @Field()
  @Column()
  description: string;

  @ManyToOne(() => Patient, (patient) => patient.records)
  patient: Patient;

  @ManyToMany(() => Doctor, (doctor) => doctor.records)
  doctors: Doctor[];
}
