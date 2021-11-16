import { Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { Patient } from './Patient';
import { Record } from './Record';

@ObjectType()
@Entity()
export class Doctor extends User {
  @Field()
  @Column()
  experience: string;

  @Field()
  @Column()
  specialities: string;

  @Field()
  @Column()
  designation: string;

  @ManyToMany(() => Patient, (patient) => patient.doctors)
  @JoinTable()
  patients: Patient[];

  @ManyToMany(() => Record, record => record.doctors)
  @JoinTable()
  records: Record[];
}
