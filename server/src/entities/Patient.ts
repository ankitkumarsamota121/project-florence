import { Entity, Column, OneToMany, ManyToMany } from 'typeorm';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import { Record } from './Record';
import { Doctor } from './Doctor';

@ObjectType()
@Entity()
export class Patient extends User {
  @Field()
  @Column()
  gender: string;

  @Field()
  @Column()
  blood_group: string;

  @OneToMany(() => Record, (record) => record.patient)
  records: Record[];

  @ManyToMany(() => Doctor, (doctor) => doctor.patients)
  doctors: Doctor[];
}
